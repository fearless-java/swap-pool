任务目标：                                                               
  使用 @uniswap/default-token-list（静态 JSON）和 viem/wagmi 的 multicall3，实现一个与 SushiSwap 项目源码中实现质量一致的代币列表模块。需要实现以下三个核心函数：

  1. `useSearchTokens` — 代币搜索 + 分页无限滚动
  2. `useMyTokens` — 用户钱包代币余额查询
  3. `useTrendingTokens` — 热门/推荐代币列表

  ## 技术栈要求

  - **代币数据源**：`@uniswap/default-token-list` NPM 包，导入 `tokens` 数组
  - **链交互**：viem v2，搭配 wagmi v2 的 `usePublicClient` / `useWalletClient`
  - **状态管理**：TanStack Query v5（`@tanstack/react-query`）
  - **缓存策略**：严格参考 SushiSwap 项目中的 staleTime 设置
  - **多链支持**：至少支持 Ethereum(1)、Polygon(137)、Arbitrum(42161)、Optimism(10)、Base(8453)
  - **本地自定义代币**：`useLocalStorage`（参考 @sushiswap/hooks 的 `useCustomTokens` 模式）

  ## 代币数据结构（参考 sushi/evm 的 EvmToken）

  ```typescript
  // 参考 packages/evm/src/token/EvmToken.ts 的实现
  interface Token {
    address: Address          // checksummed 地址
    chainId: number           // 链 ID
    decimals: number         // 代币精度
    symbol: string            // 代币符号
    name: string              // 代币全名
    id: string                // 格式: "${chainId}:${address}"
    metadata?: {
      approved?: boolean       // 是否通过官方审核
      logoUrl?: string        // 代币 logo URL
    }
  }

  三个函数的具体实现要求

  1. useSearchTokens — 代币搜索（分页 + 无限滚动）

  参考 SushiSwap 源码实现：
  - 文件：apps/web/src/lib/wagmi/components/token-selector/hooks/use-search-tokens.ts
  - 使用 useInfiniteQuery（不是 useQuery）
  - 缓存 key：['uniswap-token-list', { chainId, search, pageSize }]
  - 分页逻辑：skip: pageParam * pageSize，getNextPageParam 返回 lastPageParam + 1
  - 默认 pageSize: 50
  - enabled: !!chainId，即 chainId 为空时不发起请求
  - staleTime: 15 * 60 * 1000（15 分钟，参考 SushiSwap）
  - 支持 search 关键字过滤（对 symbol 和 name 模糊匹配，不区分大小写）
  - 支持 customTokens 参数：额外包含用户自定义添加的代币
  - 返回值要包含 hasMore 字段，判断逻辑：data.pages[lastPage].length === pageSize

  搜索过滤逻辑（前端实现）：
  const filteredTokens = tokens.filter(token => {
    const query = search.toLowerCase()
    return (
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)  // 支持直接搜地址
    )
  })

  2. useMyTokens — 用户代币余额查询（使用 multicall3）

  参考 SushiSwap 源码实现：
  - 文件：apps/web/src/lib/wagmi/components/token-selector/hooks/use-my-tokens.ts
  - 使用 useQuery（不是 useInfiniteQuery）
  - 缓存 key：['uniswap-token-balances', { chainId, account, customTokens }]
  - enabled: Boolean(account && chainId)，account 和 chainId 都不为空时才执行
  - staleTime: 30 * 1000（30 秒短期缓存）
  - refetchInterval: 10 * 1000（每 10 秒自动刷新，参考 SushiSwap）
  - 使用 viem 的 multicall 批量查询 ERC20 balanceOf
  - 如果用户余额为 "0"，仍然返回该代币（用于展示"余额为0的代币"这个状态）
  - 返回结构：{ tokens: Token[], balanceMap: Map<Address, bigint> }，balanceMap 用 Address 做 key 便于 O(1) 查找
  - 原生代币（ETH/MATIC）余额通过 eth_getBalance 查询，不走 ERC20
  - 支持 includeNative 参数控制是否包含原生代币

  multicall 查询模式（参考 viem 官方用法）：
  import { createPublicClient, http, multicall3 } from 'viem'
  import { mainnet } from 'viem/chains'

  const erc20ABI = [
    {
      name: 'balanceOf',
      type: 'function',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
    },
  ] as const

  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  })

  // 批量查询
  const results = await client.multicall({
    contracts: tokens.map((token) => ({
      address: token.address,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [account],
    })),
    allowFailure: true,  // 单个失败不影响其他结果
  })

  3. useTrendingTokens — 热门代币推荐

  参考 SushiSwap 源码实现：
  - 文件：apps/web/src/lib/wagmi/components/token-selector/hooks/use-trending-tokens.ts
  - 使用 useQuery（简单查询，不需要分页）
  - 缓存 key：['uniswap-trending-tokens', { chainId }]
  - enabled: Boolean(chainId)
  - staleTime: 3600 * 1000（1 小时，参考 SushiSwap）
  - 前 20 个代币作为默认推荐（也可以基于交易量排序取前 N 个）
  - 排序逻辑：默认取列表中前 20 个展示（数据来自 @uniswap/default-token-list 本身无排序）

  错误处理模式（严格参考 SushiSwap）

  每个 hook 的错误处理遵循以下模式（SushiSwap 标准）：

  // 1. 组件层判断
  const { data, isError, isLoading } = useSearchTokens({ chainId, search })

  if (isLoading) {
    return <LoadingSkeleton count={20} />
  }

  if (isError) {
    return <div className="flex w-full justify-center pt-3">An error has occurred.</div>
  }

  if (!data || !data.length) {
    return <div className="flex w-full justify-center pt-3">No tokens found.</div>
  }

  // 2. Hook 内部 never 主动抛出可以让组件处理的错误
  // 所有错误由 TanStack Query 的 isError 状态暴露给组件
  // 不要用 try/catch 吞掉错误后返回空数据，要让错误正常传播
  queryFn: async () => {
    if (!chainId) throw new Error('chainId is required')  // 明确的参数校验
    // ... 执行逻辑
  }

  自定义代币管理（参考 @sushiswap/hooks 的 useCustomTokens）

  参考 packages/hooks/src/useCustomTokens.ts 的实现模式：

  存储结构：
  // key 格式: "${chainId}:${address}"
  type CustomTokenData = {
    chainId: number
    address: string
    decimals: number
    name: string
    symbol: string
    logoUrl?: string
  }

  type CustomTokensMap = Record<string, CustomTokenData>

  操作接口：
  interface UseCustomTokensReturn {
    data: CustomTokensMap           // key: "${chainId}:${address}"
    addCustomToken: (token: Token) => void
    removeCustomToken: (address: string, chainId: number) => void
    hasToken: (address: string, chainId: number) => boolean
    mutate: (type: 'add' | 'remove', tokens: Token[]) => void
  }

  存储方式：使用 localStorage + SSR-safe 读取（参考 SushiSwap 的 useLocalStorage 模式）

  类型定义要求

  必须定义清晰的 TypeScript 类型，参考 sushi/evm 的类型系统：

  type EvmChainId = 1 | 137 | 42161 | 10 | 8453 | ...

  interface UseSearchTokensParams {
    chainId: EvmChainId | undefined
    search?: string
    pagination?: {
      pageSize: number
      initialPage: number
    }
    customTokens?: string[]  // 代币地址数组
  }

  interface UseMyTokensParams {
    chainId: EvmChainId | undefined
    account: Address | undefined
    customTokens?: string[]
    includeNative?: boolean
  }

  interface UseTrendingTokensParams {
    chainId: EvmChainId | undefined
  }

  性能优化要求

  1. 批量请求：所有代币余额必须通过 multicall 一次发送，不允许循环调用
  2. 防抖：搜索 input 需要 300ms 防抖再发起请求（参考 SushiSwap 用 useDebounce）
  3. 无限滚动阈值：触发下一页加载的滚动位置为 "最后一项以上 64 * (pageSize + 5) px"（参考 SushiSwap）
  4. referential equality：返回数据用 useMemo 包装，避免不必要的重渲染
  5. Map 查找：余额 map 用 Address 作为 key 实现 O(1) 查找，不用每次 filter

  UI 组件层实现（参考 SushiSwap 源码）

  参考 apps/web/src/lib/wagmi/components/token-selector/ 下的组件实现模式：

  TokenSelectorSearch：
  - 使用 react-infinite-scroll-component 实现无限滚动
  - scrollThreshold 设置为 ${64 * (pageSize + 5)}px
  - scrollableTarget 设为 "token-list-container"
  - 分页加载时显示 TokenSelectorCurrencyListLoading skeleton
  - 搜索为空时显示 TokenSelectorTrendingTokens

  TokenSelectorTrendingTokens / TokenSelectorMyTokens：
  - 使用 @sushiswap/ui 的 List 组件
  - Loading 状态：显示 20 个 skeleton 行
  - Error 状态：显示 "An error has occurred."
  - Empty 状态：显示 "No tokens found."
  - 每个代币行需要显示：logo、symbol、name、余额（MyTokens）、价格（可选）

  状态枚举（参考 token-selector-states.tsx）：
  - idle / loading / error / success / empty

  目录结构要求

  src/
  ├── lib/
  │   ├── tokens/
  │   │   ├── constants.ts              # 支持的链配置 + 链信息
  │   │   ├── types.ts                  # Token 类型定义
  │   │   ├── erc20.ts                  # ERC20 ABI
  │   │   └── index.ts                  # 统一导出
  │   ├── hooks/
  │   │   ├── useSearchTokens.ts
  │   │   ├── useMyTokens.ts
  │   │   ├── useTrendingTokens.ts
  │   │   ├── useCustomTokens.ts        # 本地自定义代币管理
  │   │   └── useDebounce.ts             # 防抖 hook
  │   └── utils/
  │       └── format.ts                 # 格式化（余额、symbol 等）
  ├── components/
  │   └── TokenSelector/
  │       ├── TokenSelector.tsx         # 主组件
  │       ├── TokenSelectorSearch.tsx   # 搜索视图
  │       ├── TokenSelectorMyTokens.tsx # 我的代币视图
  │       ├── TokenSelectorTrendingTokens.tsx
  │       ├── TokenSelectorCurrencyList.tsx
  │       ├── TokenSelectorCurrencyRow.tsx
  │       ├── TokenSelectorCurrencyListLoading.tsx
  │       └── Shell.tsx                 # 通用布局壳

  交付物要求

  1. 完整可运行的 React hooks（TypeScript）
  2. 每个 hook 带有完整的 JSDoc 类型注释
  3. 三个函数必须使用 TanStack Query v5 实现
  4. multicall3 批量查询余额的实现（使用 viem）
  5. 完整的错误处理和加载状态
  6. 演示如何在 Next.js App Router 中使用（SSR-safe）
  7. 包含单元测试基本思路（不需要完整测试，但要有测试要点）

  ---
