# SushiSwap Clone 项目参考文档

## 1. 项目概述

### 1.1 目标
复刻 [SushiSwap](https://github.com/sushi-labs/sushiswap) 开源仓库中的 **Swap + Pool** 功能（纯前端，不涉及合约和底层API）。

### 1.2 原项目技术栈
基于 SushiSwap Interface 源码分析：
- **框架**: Next.js (App Router)
- **样式**: Tailwind CSS
- **Web3**: wagmi + viem + @tanstack/react-query
- **状态管理**: zustand
- **UI组件**: 基于 Radix UI 的自定义组件库
- **国际化**: 支持多语言
- **构建工具**: Turbo (pnpm workspaces)

---

## 2. SushiSwap 源码结构分析

### 2.1 核心目录结构
```
src/
├── animation/          # 动画效果
├── components/        # 通用UI组件
│   ├── Button/
│   ├── Card/
│   ├── Modal/
│   ├── TokenInput/
│   └── ...
├── config/            # 应用配置
├── constants/         # 常量定义
├── connectors/        # Web3连接器配置
├── entities/          # 数据实体类型
├── features/          # 功能模块
│   ├── swap/          # Swap功能
│   ├── pool/         # Pool功能
│   └── ...
├── hooks/             # 自定义React Hooks
├── layouts/           # 页面布局组件
├── modals/            # 弹窗组件
├── pages/             # 页面组件
├── services/          # API服务层
├── state/             # 状态管理 (zustand)
├── styles/            # 全局样式
└── bootstrap.tsx      # 应用入口
```

### 2.2 核心功能模块

#### 2.2.1 Swap (兑换) 功能
**核心页面组件**: `pages/swap/index.tsx`

**关键组件**:
- `TokenInput` - 代币输入框（数量选择）
- `SwapButton` - 兑换按钮
- `SwapSettings` - 兑换设置（滑点 tolerance）
- `SwapInfo` - 兑换信息展示（价格、费率等）

**核心数据流**:
1. 用户选择输入/输出代币
2. 获取代币余额
3. 计算兑换汇率
4. 计算价格impact
5. 构建交易参数
6. 钱包签名执行

**关键Hooks**:
- `useSwap()` - 兑换逻辑
- `useTokenBalance()` - 代币余额查询
- `useAllTokens()` - 获取所有可用代币
- `usePrice()` - 价格查询

#### 2.2.2 Pool (流动性) 功能
**核心页面组件**: `pages/pool/index.tsx`

**关键组件**:
- `PositionCard` - 持仓卡片
- `AddLiquidity` - 添加流动性
- `RemoveLiquidity` - 移除流动性
- `PoolList` - 流动性池列表

**核心数据流**:
1. 获取用户已添加的流动性仓位
2. 计算每个仓位的价值
3. 显示手续费收益
4. 支持添加/移除流动性操作

**关键Hooks**:
- `useUserPositions()` - 用户仓位查询
- `useAddLiquidity()` - 添加流动性
- `useRemoveLiquidity()` - 移除流动性

---

## 3. 当前项目架构

### 3.1 项目结构
```
sushiswap-clone/
├── apps/
│   └── web/                    # 主应用 (Next.js)
│       ├── src/
│       │   └── app/           # App Router
│       │       ├── layout.tsx
│       │       └── page.tsx
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── ui/                    # 共享UI组件库
│   │   └── src/
│   │       ├── components/    # shadcn/ui 组件
│   │       │   └── ui/       # Button, Input, Card, Badge...
│   │       ├── lib/          # 工具函数
│   │       │   └── utils.ts   # cn() 函数
│   │       └── index.ts      # 导出入口
│   └── typescript-config/     # TypeScript 配置
├── pnpm-workspace.yaml         # pnpm catalog 配置
└── package.json
```

### 3.2 已配置的技术栈
| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 16.1.6 |
| UI | Tailwind CSS v4 | ^4 |
| Web3 | wagmi | latest |
| Web3 | viem | latest |
| 状态 | @tanstack/react-query | latest |
| 状态 | zustand | latest |
| 组件 | shadcn/ui (Radix) | - |

---

## 4. 待实现功能清单

### 4.1 Swap 功能优先级

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P0 | Token 选择器 | 代币列表、搜索、自定义代币 |
| P0 | 金额输入 | 输入框、余额显示、MAX按钮 |
| P0 | 兑换计算 | 汇率计算、价格impact、费率 |
| P0 | Swap 交易 | 执行兑换交易 |
| P1 | Swap 设置 | 滑点 tolerance、截止时间 |
| P1 | 交易历史 | 近期交易记录 |

### 4.2 Pool 功能优先级

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P0 | 仓位列表 | 用户所有流动性仓位 |
| P0 | 添加流动性 | 选择交易对、输入数量 |
| P0 | 移除流动性 | 选择仓位、设置比例 |
| P1 | 仓详情 | 净值、手续费收益 |

---

## 5. 推荐的 Next.js App Router 结构

```
apps/web/src/
├── app/
│   ├── layout.tsx                    # Root Layout (Providers)
│   ├── page.tsx                     # 首页 (Redirect to /swap)
│   ├── swap/
│   │   └── page.tsx                 # Swap 页面
│   ├── pool/
│   │   └── page.tsx                 # Pool 页面
│   └── globals.css
├── components/
│   ├── ui/                          # 基础UI组件 (@sushiswap/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── swap/                        # Swap 业务组件
│   │   ├── token-selector.tsx
│   │   ├── swap-input.tsx
│   │   ├── swap-button.tsx
│   │   ├── swap-settings.tsx
│   │   └── swap-info.tsx
│   └── pool/                        # Pool 业务组件
│       ├── position-card.tsx
│       ├── add-liquidity.tsx
│       └── remove-liquidity.tsx
├── hooks/                           # 自定义 Hooks
│   ├── use-token-balance.ts
│   ├── use-swap.ts
│   ├── use-price.ts
│   ├── use-positions.ts
│   └── use-add-liquidity.ts
├── lib/
│   ├── contracts/                   # 合约 ABI
│   ├── utils/                      # 工具函数
│   └── wagmi.ts                    # Wagmi 配置
├── config/
│   └── tokens.ts                   # 代币列表配置
└── providers/
    └── app-providers.tsx            # Context Providers
```

---

## 6. Wagmi + Web3 配置

### 6.1 必要的 Providers
```tsx
// providers/app-providers.tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### 6.2 Wagmi Config 基础配置
```typescript
// lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { mainnet, arbitrum, optimism } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, arbitrum, optimism],
  connectors: [
    injected(),
    walletConnect({ projectId: '...' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
})
```

---

## 7. UI/UX 设计参考

### 7.1 SushiSwap 设计特点
- **深色主题为主**: 背景色使用深灰/黑色
- **紫色主色调**: Primary color `#E63325` (Sushi 红色)
- **卡片式布局**: 使用 Card 组件承载内容
- **简洁表单**: Token Input 采用简洁的输入样式

### 7.2 关键 UI 组件需求
除了已有的 shadcn/ui 组件，还需创建：

| 组件 | 说明 |
|------|------|
| TokenSelector | 代币选择下拉框 |
| SwapInput | 专用代币输入框（带余额、MAX按钮） |
| SwapButton | 智能兑换按钮（根据状态变化） |
| SettingsPopover | 设置弹窗 |
| PositionCard | 流动性仓位卡片 |

---

## 8. 实施路线图

### Phase 1: 基础搭建 (当前)
- [x] Next.js 项目初始化
- [x] UI 组件库搭建
- [x] Wagmi + Web3 配置
- [ ] Providers 配置

### Phase 2: Swap 功能
- [ ] Token 选择器
- [ ] Swap Input 组件
- [ ] 汇率计算逻辑
- [ ] Swap 执行流程

### Phase 3: Pool 功能
- [ ] 仓位列表
- [ ] 添加流动性
- [ ] 移除流动性

### Phase 4: 优化
- [ ] 交易历史
- [ ] 错误处理
- [ ] Loading 状态
- [ ] 响应式适配

---

## 9. 参考资源

### 9.1 SushiSwap 官方仓库
- 主仓库: https://github.com/sushi-labs/sushiswap
- Interface: https://github.com/sushiswap/sushiswap-interface

### 9.2 相关文档
- [wagmi v2 文档](https://wagmi.sh/)
- [viem 文档](https://viem.sh/)
- [TanStack Query 文档](https://tanstack.com/query/latest)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Next.js 14 App Router](https://nextjs.org/docs/app)

### 9.3 合约ABI
关键合约（需从 SushiSwap 仓库获取）：
- `MasterChef` - 质押合约
- `MiniChef` - 多链质押
- `Router` - 路由合约
- `Factory` - 工厂合约
- `Pair` - 交易对合约

---

## 10. 注意事项

1. **API 数据源**: 原项目使用 SushiSwap 的 subgraph，本项目可使用公共 RPC + subgraph 或第三方 API
2. **交易签名**: 使用用户钱包签名，不在后端执行
3. **错误处理**: Web3 操作需要完善的错误处理和用户提示
4. **Gas 估算**: 执行交易前需要预估 Gas 费用
5. **金额精度**: 代币金额计算需注意精度问题（通常为 18 位）
