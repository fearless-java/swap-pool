项目目标                                                                                                                                                                             
                                                                  
  在你的 React/Next.js 项目中实现一个类似 SushiSwap 的代币价格获取和交易报价系统，需要支持多链（EVM + Solana），使用免费公共 API。                                                     
                                                                  
  ---
  技术栈要求

  - React  + TypeScript
  - TanStack Query (React Query) 做数据获取和缓存
  - Zustand 做状态管理
  - Web Worker 做后台轮询（可选）
  - 支持 EVM 链（Ethereum, Polygon, Arbitrum 等）和 Solana

  ---
  API 数据源（免费）

  1. 代币价格 API

  CoinGecko API (免费，无需 API Key):
  - 获取代币价格: GET https://api.coingecko.com/api/v3/simple/price
  - 获取代币信息: GET https://api.coingecko.com/api/v3/coins/{id}
  - 支持 vs_currencies=usd,eur,eth 等

  2. EVM 链交易报价 API

  0x API (免费 tier):
  - 报价端点: GET https://api.0x.org/swap/v1/quote
  - 需要参数: sellToken, buyToken, sellAmount
  - 无需 API Key（有限流）

  3. Solana 链交易报价 API

  Jupiter API (公开):
  - 报价端点: GET https://quote-api.jup.ag/v6/quote
  - 需要参数: inputMint, outputMint, amount

  ---
  功能需求

  核心功能 1: 代币价格获取

  1.1 数据结构设计

  // 价格数据结构
  interface TokenPrice {
    address: string
    chainId: number
    price: number // USD 价格
    lastUpdated: number // timestamp
  }

  // 价格 Map 结构
  type PriceMap = Map<string, TokenPrice> // key = chainId:address

  1.2 状态管理设计

  参考 SushiSwap 的 usePrices hook，实现：
  - PriceProvider - Context 级别的价格状态管理
  - 支持多链价格缓存
  - 支持按链 ID 批量获取价格

  1.3 批量轮询机制

  参考 price-worker.ts 的实现：
  - 每 30-60 秒自动刷新一次
  - 支持增量更新（通过 onlyPricesUpdateSince 参数）
  - 支持页面可见性控制（页面不可见时暂停轮询）

  1.4 React Query 集成

  // 缓存配置参考
  {
    staleTime: 30 * 1000,      // 30秒内不重新获取
    gcTime: 5 * 60 * 1000,     // 5分钟后清理缓存
    refetchOnWindowFocus: true, // 窗口聚焦时重新获取
    refetchInterval: 30 * 1000, // 每30秒轮询
  }

  1.5 缓存策略

  - 内存缓存：使用 Map 存储当前价格
  - 增量更新：只请求变化的数据（如果 API 支持）
  - 批量请求：合并同一链上多个代币的请求

  ---
  核心功能 2: 交易报价获取

  2.1 EVM 链报价 (0x API)

  // 参考 useEvmTradeQuote.ts 的实现
  interface TradeQuoteParams {
    chainId: number
    fromToken: string  // 代币地址
    toToken: string    // 代币地址
    amount: bigint      // 输入金额 (wei)
    slippagePercentage?: number // 默认 0.5%
  }

  // 返回结构
  interface TradeQuote {
    amountIn: bigint
    amountOut: bigint
    priceImpact: number // 百分比
    route: any           // 路由信息
    gasEstimate: bigint  // 预估 gas
  }

  2.2 Solana 链报价 (Jupiter API)

  // 参考 useSvmTradeQuote.ts 的实现
  interface SvmTradeQuoteParams {
    chainId: number
    fromToken: string   // Solana 代币地址
    toToken: string     // Solana 代币地址
    amount: bigint      // 输入金额 (lamports)
  }

  2.3 React Query 配置

  // 参考 useEvmTradeQuote.ts:124-133
  {
    refetchOnWindowFocus: true,
    refetchInterval: 2500,         // 2.5秒高频轮询（交易场景需要）
    gcTime: 0,                     // 不缓存，快速失效
    retry: false,                  // 失败不重试，快速 fallback
  }

  ---
  代码组织结构

  src/
  ├── hooks/
  │   ├── api/
  │   │   ├── useTokenPrices.ts      # 批量获取代币价格
  │   │   ├── useTokenPrice.ts       # 单个代币价格
  │   │   └── useTokenPriceChart.ts  # 价格图表（可选）
  │   └── trade/
  │       ├── useEvmTradeQuote.ts    # EVM 交易报价
  │       └── useSvmTradeQuote.ts    # Solana 交易报价
  ├── context/
  │   └── PriceProvider.tsx          # 价格状态管理
  ├── lib/
  │   ├── api/
  │   │   ├── coingecko.ts           # CoinGecko API 调用
  │   │   ├── zero-x.ts              # 0x API 调用
  │   │   └── jupiter.ts             # Jupiter API 调用
  │   └── utils/
  │       ├── price.ts               # 价格格式化工具
  │       └── address.ts             # 地址处理工具

  ---
  实现要点

  1. 类型安全

  - 使用 type chainId = EvmChainId | SvmChainId 区分链类型
  - EVM 地址用 string (hex) 或 bigint
  - Solana 地址用 string (Base58)

  2. 错误处理

  - API 调用失败时返回 undefined 或默认值
  - 显示 loading 状态给用户
  - 不因为单个代币失败而阻塞整体

  3. 性能优化

  - 使用 useMemo 缓存计算结果
  - 使用 useCallback 稳定函数引用
  - 合并多个 price 请求减少 API 调用

  4. 用户体验

  - 显示价格最后更新时间
  - 显示 loading骨架屏
  - 支持价格刷新按钮

  ---
  参考 SushiSwap 源码文件

  - apps/web/src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-price.ts
  - apps/web/src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-prices.ts
  - apps/web/src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/price-provider.tsx
  - apps/web/src/app/(networks)/(evm)/_common/ui/price-provider/price-worker/price-worker.ts
  - apps/web/src/lib/hooks/react-query/trade/useEvmTradeQuote.ts
  - apps/web/src/lib/hooks/react-query/trade/useSvmTradeQuote.ts

  ---
  注意事项

  1. CoinGecko 免费版有 Rate Limit（约 10-30 calls/minute）
  2. 0x API 免费版有限流，生产环境建议申请 API Key
  3. Jupiter API 是公开的，但建议添加缓存层
  4. 不要在客户端暴露 API Key（如果有的话）
  5. 价格数据应设置合理的缓存时间避免频繁请求

  ---
  预期输出

  1. 完整的 TypeScript 类型定义
  2. PriceProvider Context 实现
  3. usePrices / usePrice hooks
  4. useEvmTradeQuote / useSvmTradeQuote hooks
  5. API 调用函数（coingecko.ts, zero-x.ts, jupiter.ts）
  6. 合理的错误处理和 Loading 状态
