# 🚀 SeedDream UI

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Zustand-5.0-51483F?style=for-the-badge&logo=zustand" alt="Zustand">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Image%20Generation-F59E0B?style=for-the-badge&logo=openai" alt="AI Image Generation">
  <img src="https://img.shields.io/badge/Powered%20by-Seedream-FDBA74?style=for-the-badge" alt="Powered by Seedream">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## ✨ 特性一览

### 🎨 强大的 AI 图像生成能力

| 功能 | 描述 | 支持模型 |
|------|------|----------|
| 📝 **文生图** | 文字描述秒变精美图像 | 5.0-lite / 4.5 /|
| 🖼️ **图生图** | 参考图风格再创作 | 5.0-lite / 4.5 /|
| 🔗 **多图融合** | 多张参考图混合生成 | 5.0-lite / 4.5 |
| 🔍 **联网搜索** | 智能联网获取灵感 | 5.0-lite |
| 📺 **流式输出** | 实时预览生成进度 | 5.0-lite |

### 📐 丰富的分辨率与比例选择

```
┌─────────────────────────────────────────────────────────────┐
│  分辨率选项                                                    │
├─────────────────────────────────────────────────────────────┤
│  🌟 2K (2048×2048)  ─  轻量快速，适合预览                        │
│  🚀 3K (3072×3072)  ─  平衡之选，质量与速度兼顾                   │
│  💎 4K (4096×4096)  ─  超高清输出，专业级品质                     │
└─────────────────────────────────────────────────────────────┘

比例: 1:1 · 3:4 · 4:3 · 16:9 · 9:16 · 2:3 · 3:2 · 21:9
```

### 🧩 模型矩阵

| 模型 | 版本 | 特色能力 | 最大生成数 |
|------|------|----------|------------|
| **Seedream 5.0-lite** | 260128 | 联网搜索 🔥 | 15 |
| **Seedream 4.5** | 251128 | 4K超清 | 10 |
| **Seedream 4.0** | 250828 | 经典稳定 | 10 |

---

## 🏗️ 项目架构

```
SeedDream_UI/
├── 📂 src/
│   ├── 📂 components/           # 组件库
│   │   ├── 📂 ui/             # 基础 UI 组件 (shadcn/ui)
│   │   ├── 📂 layout/         # 布局组件
│   │   ├── 📂 image/          # 图像相关组件
│   │   └── 📂 generation/     # 生成器组件
│   │       ├── PromptInput.tsx          💬 提示词输入
│   │       ├── ReferenceImageUpload.tsx 🖼️ 参考图上传
│   │       ├── ModelSelector.tsx         🤖 模型选择
│   │       ├── ImageSizeSelector.tsx     📐 分辨率选择
│   │       ├── FormatSelector.tsx        📁 格式选择
│   │       ├── GenerateButton.tsx        ⚡ 一键生成
│   │       └── ...
│   ├── 📂 pages/              # 页面
│   │   └── HomePage.tsx       🏠 首页
│   ├── 📂 services/          # 业务服务
│   │   └── api.ts            🔌 API 服务
│   ├── 📂 stores/            # 状态管理
│   │   └── settings.ts       ⚙️ 设置状态
│   ├── 📂 types/             # 类型定义
│   │   └── index.ts          📋 类型安全
│   ├── 📂 lib/               # 工具库
│   │   ├── utils.ts          🛠️ 工具函数
│   │   └── constants.ts      📌 常量配置
│   └── 📂 assets/            # 静态资源
├── 📂 public/                # 公共资源
└── 📄 package.json           📦 依赖配置
```

---

## 🎯 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| ⚛️ **框架** | React 19 | 现代化的 UI 框架 |
| 🔷 **语言** | TypeScript 5.9 | 类型安全的 JavaScript 超集 |
| ⚡ **构建** | Vite 8.0 | 极快的开发服务器和构建工具 |
| 🎨 **样式** | Tailwind CSS 4.2 | 原子化 CSS 框架 |
| 🧩 **组件** | shadcn/ui + Radix UI | 精美的无障碍组件库 |
| 📊 **状态** | Zustand 5.0 | 轻量级状态管理 |
| 🧭 **路由** | React Router 7 | 声明式路由 |
| 🔮 **图标** | Lucide React | 精美的开源图标库 |
| 🎭 **动画** | Tailwind Animations | 流畅的交互动画 |

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (推荐) 或 npm / yarn

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-repo/SeedDream_UI.git
cd SeedDream_UI

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 构建生产版本
pnpm build
```

### 📝 可用命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |

---

## 🔧 功能演示

### 1️⃣ 文生图模式

```
输入提示词 ──→ 选择模型 ──→ 选择分辨率 ──→ 点击生成 ──→ 获取图像
     │              │              │              │
     ▼              ▼              ▼              ▼
  "一只赛博     Seedream      2K / 3K / 4K     🔥 AI 图像
  朋克猫咪"      5.0-lite                    秒速生成中...
```

### 2️⃣ 图生图模式

```
上传参考图 ──→ 输入提示词 ──→ 调整参数 ──→ 点击生成 ──→ 获取融合结果
     │              │              │              │
     ▼              ▼              ▼              ▼
  🖼️ 拖拽或       "将这只猫     风格强度       🐱 保留主体
  点击上传       变成机器人"     0.1-1.0        换上新风格
```

### 3️⃣ 多图融合模式 (仅 5.0-lite)

```
上传多张参考图 ──→ 选择融合方式 ──→ 输入提示词 ──→ 生成混合图像
       │                │               │
       ▼                ▼               ▼
   最多 15 张       风格混合 /      "融合这两张图的
   参考图上传       主体保持 /       色彩和构图"
       /|\           元素融合
        |
```

---

## 🎨 界面预览

```
┌──────────────────────────────────────────────────────────────────┐
│                         🎨 SeedDream UI                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                                                          │     │
│  │     💬 在此输入你的创意描述...                              │     │
│  │                                                          │     │
│  │     "一座漂浮在星海中的未来城市，高耸的塔楼被霓虹灯           │     │
│  │      点亮，飞车在空中穿梭..."                               │     │
│  │                                                          │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │  🤖 模型          │  │  📐 分辨率        │  │  📁 格式        │  │
│  │  Seedream 5.0   ▼│  │  3K (3072×3072) ▼│  │  PNG          ▼│  │
│  └──────────────────┘  └──────────────────┘  └────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  🖼️ 参考图 (可选)                                          │     │
│  │  拖拽图片到此处或点击上传                                    │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│                        ┌─────────────────────┐                    │
│                        │    ⚡ 开始生成      │                    │
│                        └─────────────────────┘                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API 集成

本项目对接 **字节跳动火山引擎 Seedream** AI 图像生成服务：

- 📚 [Seedream API 文档](https://www.volcengine.com/docs/82379/1824121)
- 🤖 [模型能力文档](https://www.volcengine.com/docs/82379/1541523)

### 配置 API Key

首次使用需要配置 API Key（支持环境变量配置，保护您的密钥安全）：

```typescript
// 在设置中输入您的 API Key
// 或设置环境变量 VITE_API_KEY=your_key
```

---

## 🎓 开发指南

### 添加新组件

```bash
# 组件存放位置
src/components/
├── ui/          # 基础组件（按钮、输入框等）
├── image/       # 图像相关组件
├── generation/  # 生成器相关组件
└── layout/      # 布局组件
```

### 状态管理

使用 Zustand 管理全局状态：

```typescript
// src/stores/settings.ts
import { create } from 'zustand'

interface SettingsState {
  apiKey: string
  setApiKey: (key: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),
}))
```

---

## 🌟 致谢

感谢以下开源项目：

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React" width="80">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" width="80">
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite" alt="Vite" width="80">
  <img src="https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind" width="80">
  <img src="https://img.shields.io/badge/shadcn/ui-latest-000?style=for-the-badge" alt="shadcn/ui" width="80">
</p>

---

## 📄 License

MIT License © 2025 SeedDream Team

---

<p align="center">
  <strong>🌟 如果这个项目对你有帮助，请给我们一个 Star！🌟</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/your-repo/SeedDream_UI?style=social" alt="Stars">
  <img src="https://img.shields.io/github/forks/your-repo/SeedDream_UI?style=social" alt="Forks">
  <img src="https://img.shields.io/github/watchers/your-repo/SeedDream_UI?style=social" alt="Watchers">
</p>

---

<p align="center">
  <sub>Built with ❤️ by SeedDream Team · Powered by 🔥 Volcano Engine</sub>
</p>
