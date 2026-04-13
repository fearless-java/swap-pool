# SushiSwap 官方 vs 你的克隆项目 对比报告

> 生成日期: 2026-04-13
> 这是一份大白话版本的报告，用大白文解释技术差异

---

## 一句话总结

**官方 SushiSwap 是一个支持 50+ 链的成熟多链应用，使用 dRPC、Enso Finance、自己的价格 API 等企业级方案。而你的项目是一个刚起步的 5 链版本，使用公共 RPC 和简单的 0x/Jupiter API。**

---

## 一、多链底层配置对比

### 1.1 支持的链数量 📊

| 对比项 | 官方 SushiSwap | 你的项目 |
|--------|---------------|---------|
| EVM 链数量 | **50+** | 5 |
| 完整列表 | Ethereum, Arbitrum, Optimism, Polygon, Base, zkSync Era, Linea, Scroll, Avalanche, BSC, Fantom, Gnosis, Berachain, Monad, Sonic, HyperEVM, MegaETH, XLayer, Ape, Katana, Hemi 等 | Ethereum, Polygon, Arbitrum, Optimism, Base |
| Solana SVM | ✅ 支持 | ✅ 支持 (通过 Jupiter) |
| 其他非 EVM | Stellar, Aptos 等 | ❌ 无 |

**差距原因**: 官方已经运营多年，你的项目刚起步。

---

### 1.2 RPC 配置 🔗

**官方 SushiSwap:**
```
- 使用 dRPC (分布式 RPC) 作为核心
- API Key: NEXT_PUBLIC_DRPC_ID
- 格式: https://lb.drpc.live/ogrpc?network={name}&dkey={id}
- 每个链可以配置不同的 polling interval
  - Ethereum: 8秒
  - Polygon zkEVM: 8秒
  - Filecoin: 20秒
- 有 JWT 认证支持
```

**你的项目:**
```
- 使用公共 Llamarpc API (免费但有限制)
- Ethereum: https://eth.llamarpc.com
- Polygon: https://polygon.llamarpc.com
- 没有认证机制
```

**问题**: 公共 RPC 有 rate limit，你的项目在高频使用时可能挂掉。

---

### 1.3 EVM/SVM 类型分离 🎯

**官方 SushiSwap (做得很清晰):**

```typescript
// 明确的类型判断函数
import { isEvmChainId } from 'sushi/evm'
import { isSvmChainId } from 'sushi/svm'

// 根据类型执行不同逻辑
if (isEvmChainId(chainId)) {
  // EVM 逻辑
} else if (isSvmChainId(chainId)) {
  // SVM 逻辑
}
```

**你的项目 (相对简单):**

```typescript
// 只是用数字 vs 字符串区分
export function isEvmChainId(chainId: ChainId): chainId is EvmChainId {
  return typeof chainId === "number"
}

export function isSvmChainId(chainId: ChainId): chainId is SvmChainId {
  return typeof chainId === "string"
}
```

**差距**: 官方有专门的 `sushi/evm` 和 `sushi/svm` 包处理类型，你的项目用简单的 typeof 区分。

---

### 1.4 Solana 钱包连接 🌅

**官方 SushiSwap:**
```
- 使用 @solana/connector 包
- 配置示例:
  getDefaultConfig({
    appName: 'SushiSwap',
    appUrl: 'https://sushi.com',
    autoConnect: true,
    enableMobile: true
  })
- 有专门的 SvmConnectorProvider
```

**你的项目:**
```
- 没有 Solana 钱包连接配置
- 只有 useSvmTradeQuote 获取报价
- 没有实际执行 swap 的功能
```

---

## 二、交易报价逻辑对比

### 2.1 EVM 报价 API 📊

**官方 SushiSwap (复杂但强大):**

| 功能 | 官方方案 |
|------|---------|
| V2/V3 池子 zap | **Enso Finance** (`/api/zap/v2`, `/api/zap/v3`) |
| API 缓存 | 60秒 + stale-while-revalidate 到 600秒 |
| 费用 | 自己的 UI fee (35 bips) |

**你的项目 (简单直接):**

```typescript
// 只有一个 0x API
const url = `https://api.0x.org/swap/v1/quote?${queryParams}`

// 问题: 0x 免费版有 rate limit
```

**差距说明**: 官方用 Enso 做 DEX 聚合，你的项目直接用 0x。Enso 可以访问更多流动性来源。

---

### 2.2 Solana 报价 API 🌟

**官方 SushiSwap:**
```typescript
// 使用 Jupiter Ultra API (付费版)
const JUPITER_ULTRA_API_BASE_URL = 'https://api.jup.ag/ultra/v1'
const JUPITER_API_KEY = process.env.JUPITER_API_KEY // 服务端保护

// Server-side API route
POST /api/jupiter/ultra/order  // 获取报价
POST /api/jupiter/ultra/execute  // 执行交易
```

**你的项目:**
```typescript
// 使用 Jupiter 公共 API
const JUPITER_BASE_URL = "https://quote-api.jup.ag"

// 直接前端调用，问题:
1. 没有 API key
2. 没有服务端代理
3. 公共 API 有严格 rate limit
```

---

### 2.3 交叉链交易 🌐

**官方 SushiSwap:**
```
- 使用 LI.FI 方案
- 端点: /api/cross-chain/routes, /api/cross-chain/step
- 支持不同链之间的 swap
- 配置: SushiSwap-only DEX, single-step routes only, 0.35% UI fee
```

**你的项目:**
```
- 完全不支持交叉链
```

---

### 2.4 TWAP (时间加权平均价格) ⏰

**官方 SushiSwap:**
```
- 使用 @orbs-network/twap-sdk
- 支持大额订单的分批执行
- 减少大单对市场价格的影响
```

**你的项目:**
```
- 不支持 TWAP
```

---

## 三、价格获取逻辑对比

### 3.1 价格数据来源 🎯

**官方 SushiSwap (三层保障):**

```
第一层: SushiSwap 自己价格 API
  - https://api.sushi.com/price/v1/{chainId}
  - 所有链并行获取 (Promise.allSettled)

第二层: The Graph 协议
  - 自己的 subgraph 索引链上数据
  - DataSource 枚举: SUBGRAPH, CACHE, STALE_CACHE, WEB3, COINGECKO

第三层: CoinGecko
  - 作为备用/参考价格源
```

**你的项目 (只有 CoinGecko):**

```typescript
// 只有一个函数
export async function getTokenPrices(coinIds: string[]): Promise<...> {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&...`
  // 局限:
  // 1. 公共 API 有 rate limit
  // 2. 不是专门为 DEX 设计的价格源
  // 3. 可能不够实时
}
```

---

### 3.2 缓存策略 🗄️

**官方 SushiSwap (谨慎):**

```typescript
// useTokenWithCache.ts
{
  staleTime: 900000,    // 15 分钟 - 数据被认为新鲜的
  gcTime: 86400000,      // 24 小时 - 垃圾回收阈值
  refetchOnWindowFocus: false  // 避免不必要的重新获取
}
```

**你的项目:**

```typescript
// useSvmTradeQuote.ts
{
  staleTime: 1000,      // 只有 1 秒！
  gcTime: 0,            // 不缓存
  refetchInterval: 2500 // 每 2.5 秒重新获取
}
// 问题: 没有必要的缓存，高频请求可能触发 rate limit
```

---

### 3.3 Token 搜索 🔍

**官方 SushiSwap:**

```graphql
// GraphQL 查询
query TokenList($chainId: TokenListChainId!, $search: String, $customTokens: [Address!]) {
  tokenList(chainId: $chainId, search: $search, customTokens: $customTokens) {
    address, symbol, name, decimals, approved
  }
}

// 三层 fallback 机制:
// 1. LocalStorage (自定义 token)
// 2. Token List API (GraphQL 搜索)
// 3. 直接 RPC 查询链上
```

**你的项目 (需要检查):**

```
- 有 useSearchTokens hook
- 使用 CoinGecko search API
- 可能没有完整的 fallback 机制
```

---

## 四、钱包连接对比

### 4.1 支持的钱包 💼

**官方 SushiSwap:**

```typescript
// Wagmi connectors
- injected() // 浏览器钱包
- walletConnect({ projectId: ... })
- coinbaseWallet({ appName: ... })
- safe() // Safe Wallet

// Solana connectors
- @solana/connector 封装包

// 特殊配置
SUPPORTED_CHAIN_IDS_BY_WALLET = {
  argent: [ETHEREUM],  // Argent 只支持以太坊
  'xyz.ithaca.porto': portoChains...
}
```

**你的项目:**

```typescript
// config.ts
connectors: [
  injected(),
  walletConnect({...}),
  coinbaseWallet({...}),
  safe(),
]

// 问题:
// 1. 没有 Solana 钱包连接
// 2. 没有针对不同钱包的链过滤
```

---

## 五、代码架构对比

### 5.1 路由结构 🗂️

**官方 SushiSwap (按网络分组):**

```
/app/(networks)/
  ├── (evm)/           // EVM 路由组
  │   ├── [chainId]/  // 动态链 ID (/1, /137)
  │   │   ├── swap/
  │   │   ├── claim/
  │   │   └── perps/
  │   └── layout.tsx  // EVM providers
  │
  └── (non-evm)/       // 非 EVM 路由组
      └── solana/      // Solana 专属
          ├── swap/
          ├── providers.tsx  // SvmConnectorProvider
          └── _common/config/
```

**你的项目 (简单结构):**

```
/app/
  ├── page.tsx   // 首页
  └── layout.tsx // providers
/src/
  ├── components/TokenSelector/
  ├── hooks/trade/
  │   ├── useSvmTradeQuote.ts
  │   └── useEvmTradeQuote.ts
  └── providers/
```

---

### 5.2 包结构 📦

**官方 SushiSwap (完整 monorepo):**

```
/apps
  /web          // Next.js 主应用
  /storybook    // UI 文档
/packages
  /sushiswap    // 核心 SDK
  /hooks        // React hooks
  /ui           // UI 组件库
  /graph-client // GraphQL 客户端
  /telemetry    // 分析
  /stellar      // Stellar 链支持
```

**你的项目 (简化版):**

```
/apps
  /web   // Next.js 主应用
/packages
  /ui    // 只有 UI 组件
```

**缺失的核心包**: `sushi` (核心 SDK), `hooks` (通用 hooks), `graph-client` (GraphQL)

---

## 六、具体改进建议 (大白话版)

### 6.1 高优先级 🔴

#### 问题 1: 没有 Solana 钱包连接
**现状**: 只能看报价，不能真正 swap
**建议**: 添加 `@solana/connector` 配置

#### 问题 2: 价格 API 容易触发 rate limit
**现状**: CoinGecko 公共 API 有限制
**建议**:
1. 添加服务端 price API proxy
2. 或使用 dRPC 的价格服务
3. 添加缓存减少请求

#### 问题 3: 报价高频请求
**现状**: 2.5 秒轮询，没有缓存
**建议**: 添加 staleTime 缓存机制

---

### 6.2 中优先级 🟡

#### 问题 4: 支持链太少
**现状**: 只有 5 条链
**建议**: 逐步添加更多 EVM 链支持

#### 问题 5: 没有 Enso/Zap 路由
**现状**: 只能做简单 swap
**建议**: 添加 Enso Finance 集成获得更多流动性

#### 问题 6: 没有交叉链
**现状**: 只能同链 swap
**建议**: 如果业务需要，再添加 LI.FI

---

### 6.3 低优先级 🟢

#### 问题 7: 没有 TWAP
**现状**: 不支持大单分批
**建议**: 后期如果有大户需求再添加

#### 问题 8: 没有 The Graph 索引
**现状**: 依赖 CoinGecko
**建议**: 部署自己的 subgraph 获取更多链上数据

---

## 七、架构差距可视化

```
                    官方 SushiSwap              你的项目
                         │                         │
      ┌──────────────────┼──────────────────┐       │
      │                  │                  │       │
   前端层            服务端 API           基础设施     │
      │                  │                  │       │
      ▼                  ▼                  ▼       │
 ┌─────────┐      ┌─────────────┐      ┌─────────┐  │
 │ Next.js │      │ /api/zap/*  │      │  dRPC   │  │
 │         │      │ /api/price/*│      │ (RPC)   │  │
 └────┬────┘      └──────┬──────┘      └────┬────┘  │
      │                  │                  │       │
      ▼                  ▼                  ▼       │
 ┌─────────────────────────────────────────────┐    │
 │           Wagmi + Solana Connector          │    │
 └─────────────────────────────────────────────┘    │
      │                                       │      │
      ▼                                       ▼      │
 ┌─────────────┐                        ┌─────────┐  │
 │ 50+ Chains  │                        │5 Chains │  │
 └─────────────┘                        └─────────┘  │
      │                                       │      │
      ▼                                       ▼      │
 ┌─────────────────────────────────────────────┐    │
 │   价格层: Sushi API > The Graph > CG      │    │
 └─────────────────────────────────────────────┘    │
      │                                       │      │
      ▼                                       ▼      │
 ┌─────────────┐                        ┌─────────┐  │
 │   Enso/Li.FI│                        │ 0x API │  │
 │  + Jupiter  │                        │Jupiter │  │
 └─────────────┘                        └─────────┘  │
```

---

## 八、总结

| 维度 | 官方 | 你的项目 | 差距 |
|------|------|---------|------|
| 链支持 | 50+ | 5 | 10x |
| RPC | dRPC (企业级) | 公共 Llamarpc | 2-3代 |
| 价格 | 自建 + Graph + CG | 仅 CoinGecko | 3层 vs 1层 |
| EVM Swap | Enso Finance | 0x API | 企业 vs 简单 |
| SVM Swap | Jupiter Ultra | Jupiter 公共 | 付费 vs 免费 |
| 缓存 | 完善 | 基本没有 | 需要补 |
| 钱包 | 完整 | 缺 Solana | 需要补 |
| 交叉链 | LI.FI | 无 | 可选 |

**一句话建议**: 你的项目适合作为学习/起步，要达到官方水平需要:
1. 添加 Solana 钱包连接
2. 搭建服务端 price API 并加缓存
3. 逐步扩展更多 EVM 链
4. 考虑 Enso Finance 集成获取更多流动性

---

*报告结束*
