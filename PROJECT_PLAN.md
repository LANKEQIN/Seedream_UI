# Seedream 可视化创作平台 - 项目计划

## 1. 项目概述

### 1.1 项目名称
**Seedream Studio** - 火山方舟Seedream图片生成平台

### 1.2 项目目标
为个人用户提供一个可视化、易用的界面，通过火山方舟引擎调用Seedream 4.5/5.0-lite模型进行图片创作，支持文生图、组图生成、多图融合等全部核心功能。

### 1.3 核心价值
- 降低个人用户使用Seedream模型的门槛
- 提供直观易用的可视化操作界面
- 完整支持Seedream系列模型的所有功能特性

---

## 2. Seedream模型能力分析

### 2.1 支持的模型版本

| 模型名称 | Model ID | 支持功能 |
|---------|----------|---------|
| Seedream 5.0-lite | `doubao-seedream-5-0-lite-260128` | 文生图、文生组图、单/多图生图、单/多图生组图、联网搜索 |
| Seedream 4.5 | `doubao-seedream-4-5-251128` | 文生图、文生组图、单/多图生图、单/多图生组图 |
| Seedream 4.0 | `doubao-seedream-4-0-250828` | 文生图、文生组图、单/多图生图、单/多图生组图 |

### 2.2 核心功能模块

#### 2.2.1 文生图（Text-to-Image）
- **输入**：纯文本提示词
- **输出**：单张高质量图片
- **分辨率**：2K / 3K（5.0-lite）、2K / 4K（4.5）、1K / 2K / 4K（4.0）
- **输出格式**：PNG / JPEG

#### 2.2.2 文生组图（Text-to-Image Series）
- **输入**：文本提示词
- **输出**：多张关联图片（1-15张，取决于参考图数量）
- **应用场景**：系列作品创作、连续场景生成

#### 2.2.3 单图生图（Single Image-to-Image）
- **输入**：1张参考图 + 文本提示词
- **输出**：基于参考图的生成结果
- **应用**：风格迁移、内容替换、细节调整

#### 2.2.4 多图生图（Multi-Image-to-Image）
- **输入**：2+张参考图 + 文本提示词
- **输出**：融合多图特征的生成结果
- **应用**：服装换装、风格融合、元素组合

#### 2.2.5 单/多图生组图
- **输入**：参考图 + 文本描述
- **输出**：多张关联图片（保持主体一致性）
- **应用**：角色多姿态、连续剧情创作

#### 2.2.6 联网搜索（仅5.0-lite）
- **功能**：融合实时网络信息进行生成
- **应用**：天气预报、实时新闻配图、时效性内容创作

### 2.3 参数配置

| 参数 | 说明 | 可选值 |
|------|------|--------|
| `size` | 输出分辨率 | 1K, 2K, 3K, 4K（根据模型不同） |
| `output_format` | 输出格式 | png, jpeg |
| `response_format` | 返回格式 | url, base64 |
| `watermark` | 水印设置 | true, false |
| `prompt` | 提示词优化模式 | 标准模式、极速模式（仅4.0） |

### 2.4 限流说明
- **IPM（张/分钟）**：500张/分钟

---

## 3. 技术栈选择

### 3.1 前端技术栈

| 技术 | 选择 | 说明 |
|------|------|------|
| **框架** | React 18 + TypeScript | 成熟稳定，类型安全 |
| **构建工具** | Vite 5 | 快速开发体验 |
| **UI框架** | shadcn/ui | 基于Radix的高质量组件库 |
| **样式方案** | Tailwind CSS 3.4 | 原子化CSS，快速布局 |
| **图标库** | Lucide React | 统一的SVG图标库 |
| **状态管理** | Zustand | 轻量级状态管理 |
| **HTTP客户端** | Fetch API | 原生支持，配合Volcengine SDK |
| **图片处理** | react-dropzone | 图片上传组件 |

### 3.2 后端（如需部署）
- **运行时**：Node.js 20+
- **框架**：Express.js（可选，用于代理API请求）
- **注意**：由于是个人使用，可以考虑纯前端方案，直接从浏览器调用方舟API

### 3.3 第三方库依赖
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-*": "various",
    "lucide-react": "^0.400.0",
    "zustand": "^4.5.4",
    "tailwind-merge": "^2.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "react-dropzone": "^14.2.3"
  }
}
```

---

## 4. 项目结构设计

```
SeedDream_UI/
├── public/                      # 静态资源
│   └── favicon.ico
├── src/
│   ├── components/              # 组件目录
│   │   ├── ui/                  # 基础UI组件（来自shadcn/ui）
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   └── dialog.tsx
│   │   ├── layout/              # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── image/               # 图片相关组件
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── ImagePreview.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── ImageComparison.tsx
│   │   ├── generation/          # 生成相关组件
│   │   │   ├── PromptInput.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   ├── ParameterPanel.tsx
│   │   │   └── GenerationButton.tsx
│   │   └── result/              # 结果展示组件
│   │       ├── ResultViewer.tsx
│   │       └── ResultActions.tsx
│   ├── pages/                   # 页面目录
│   │   ├── Home.tsx             # 首页/工作台
│   │   ├── TextToImage.tsx      # 文生图
│   │   ├── ImageToImage.tsx     # 图生图
│   │   ├── SeriesGenerate.tsx   # 组图生成
│   │   ├── History.tsx          # 生成历史
│   │   └── Settings.tsx         # 设置页
│   ├── hooks/                   # 自定义Hooks
│   │   ├── useImageGeneration.ts
│   │   ├── useImageUpload.ts
│   │   ├── useHistory.ts
│   │   └── useSettings.ts
│   ├── services/                # 服务层
│   │   └── arkApi.ts            # 火山方舟API调用
│   ├── stores/                  # Zustand状态库
│   │   ├── generationStore.ts
│   │   ├── historyStore.ts
│   │   └── settingsStore.ts
│   ├── types/                   # TypeScript类型定义
│   │   ├── generation.ts
│   │   └── ark.d.ts
│   ├── lib/                     # 工具函数
│   │   ├── utils.ts             # cn等工具函数
│   │   └── constants.ts         # 常量定义
│   ├── App.tsx                  # 应用入口
│   ├── main.tsx                 # React渲染入口
│   └── index.css                # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── components.json               # shadcn/ui配置文件
```

---

## 5. 功能模块设计

### 5.1 首页/工作台（Home）

**功能描述**：
- 展示最近生成的作品缩略图
- 提供快速入口到各功能模块
- 显示API Key配置状态

**核心元素**：
- 最近使用的工作区
- 快捷功能卡片（文生图、图生图、组图生成）
- API状态指示器

### 5.2 文生图模块（Text-to-Image）

**功能描述**：
- 纯文本提示词输入
- 选择模型版本（4.0 / 4.5 / 5.0-lite）
- 配置生成参数（分辨率、输出格式、水印）
- 5.0-lite模型可选联网搜索功能

**界面布局**：
```
┌─────────────────────────────────────────────┐
│  模型选择    [Seedream 5.0-lite ▼]          │
├─────────────────────────────────────────────┤
│  提示词输入                              [联网]│
│  ┌─────────────────────────────────────┐   │
│  │ 描述你想要生成的图片...              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  高级选项                                    │
│  分辨率: [2K ▼]  输出格式: [PNG ▼]          │
│  水印: [关闭]                               │
│                                             │
│  [        开始生成        ]                  │
├─────────────────────────────────────────────┤
│  生成结果                                    │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │           [生成的图片]                │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│  [下载] [重新生成] [添加到组图]              │
└─────────────────────────────────────────────┘
```

### 5.3 图生图模块（Image-to-Image）

**功能描述**：
- 单图参考输入
- 文本提示词编辑
- 多图融合模式（可选）
- 服装替换等功能

**界面布局**：
```
┌─────────────────────────────────────────────┐
│  模式: [单图生图 ▼] [多图融合]               │
├─────────────────────────────────────────────┤
│  参考图片                                    │
│  ┌──────────┐  ┌──────────┐               │
│  │ 图片1    │  │ 图片2    │  [+ 添加]     │
│  │  [上传]  │  │  [上传]  │               │
│  └──────────┘  └──────────┘               │
│                                             │
│  提示词:                                     │
│  ┌─────────────────────────────────────┐   │
│  │ 将图1的服装换为图2的服装...          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [        开始生成        ]                  │
└─────────────────────────────────────────────┘
```

### 5.4 组图生成模块（Series Generation）

**功能描述**：
- 基于参考图生成一组关联图片
- 支持单图生组图和多图生组图
- 保持主体一致性
- 可指定生成数量

**界面布局**：
```
┌─────────────────────────────────────────────┐
│  参考图1                                    │
│  ┌─────────────────────────────────────┐   │
│  │           [上传/拖拽图片]            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  提示词:                                    │
│  ┌─────────────────────────────────────┐   │
│  │ 参考图1，生成四图片，图中人物分别    │   │
│  │ 带着墨镜，骑着摩托，带着帽子，拿着棒棒糖│   │
│  └─────────────────────────────────────┘   │
│                                             │
│  生成数量: [4 ▼] (最多15张)                 │
│                                             │
│  [        开始生成        ]                  │
├─────────────────────────────────────────────┤
│  生成结果 (4张)                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │              │
│  └────┘ └────┘ └────┘ └────┘              │
│  [下载全部]                                 │
└─────────────────────────────────────────────┘
```

### 5.5 历史记录模块（History）

**功能描述**：
- 展示所有历史生成记录
- 支持缩略图预览
- 点击查看详情
- 可重新生成或删除记录

**数据结构**：
```typescript
interface HistoryItem {
  id: string;
  type: 'text-to-image' | 'image-to-image' | 'series';
  model: string;
  prompt: string;
  images: GeneratedImage[];
  referenceImages?: string[];
  createdAt: Date;
  parameters: GenerationParams;
}

interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  format: 'png' | 'jpeg';
}
```

### 5.6 设置模块（Settings）

**功能描述**：
- API Key配置和管理
- 默认参数设置
- 界面偏好设置

**配置项**：
```typescript
interface Settings {
  apiKey: string;              // 火山方舟API Key
  defaultModel: string;        // 默认模型
  defaultSize: string;         // 默认分辨率
  defaultFormat: string;      // 默认输出格式
  watermark: boolean;          // 默认水印设置
  theme: 'light' | 'dark' | 'system';  // 主题设置
}
```

---

## 6. API集成设计

### 6.1 火山方舟API调用

**端点信息**：
- Base URL: `https://ark.cn-beijing.volces.com/api/v3`
- 认证方式: API Key (环境变量 `ARK_API_KEY`)

**API调用流程**：
```typescript
// services/arkApi.ts
const client = new Ark({
  base_url: "https://ark.cn-beijing.volces.com/api/v3",
  api_key: import.meta.env.VITE_ARK_API_KEY,
});

async function generateImage(params: GenerationParams) {
  const response = await client.images.generate({
    model: params.model,
    prompt: params.prompt,
    size: params.size,
    output_format: params.outputFormat,
    response_format: "url",
    watermark: params.watermark,
  });
  return response.data[0].url;
}
```

### 6.2 图片上传处理
- 使用 `react-dropzone` 处理拖拽上传
- 支持格式: PNG, JPEG, JPG, WebP
- 限制大小: 10MB以内
- 图片预览: 压缩后本地预览

### 6.3 生成结果处理
- URL格式: 直接显示生成的图片URL
- 下载功能: 触发浏览器下载
- 错误处理: 显示友好错误提示

---

## 7. UI/UX设计方向

### 7.1 视觉风格
- **设计语言**: 现代简约 + 工具类产品风格
- **圆角**: 中等圆角（8-12px），友好但专业
- **阴影**: 柔和阴影，营造层次感
- **卡片**: 明显的卡片分割，信息分组清晰

### 7.2 色彩方案
- **主色调**: 火山引擎品牌蓝 (#246BFD) 或渐变紫
- **辅助色**: 浅灰背景 (#F8FAFC) + 深色文字
- **功能色**:
  - 成功: 绿色 (#22C55E)
  - 警告: 橙色 (#F59E0B)
  - 错误: 红色 (#EF4444)
- **深色模式**: 支持系统/手动切换

### 7.3 布局结构
- **左侧导航**: 固定侧边栏，包含主要功能入口
- **主内容区**: 居中布局，最大宽度限制
- **响应式**: 桌面端侧边栏 + 内容，移动端底部导航

### 7.4 交互反馈
- **加载状态**: 骨架屏或进度条，避免长时间无反馈
- **按钮状态**: hover/active/disabled 状态区分明显
- **图片上传**: 拖拽高亮 + 上传进度
- **生成过程**: 显示生成进度或预估时间

---

## 8. 开发计划

### 8.1 阶段一（完成）：项目初始化（第1天）

**任务**：
1. 初始化 Vite + React + TypeScript 项目
2. 配置 Tailwind CSS 和 shadcn/ui
3. 配置项目路径别名和基础设置
4. 安装所有依赖

**交付物**：
- 可运行的基础项目框架
- 基础UI组件库就绪

### 8.2 阶段二（完成）：核心组件开发（第2-3天）

**任务**：
1. 实现布局组件（Header, Sidebar, MainLayout）
2. 开发基础UI组件（Button, Input, Card, Select等）
3. 实现图片上传组件
4. 开发提示词输入组件

**交付物**：
- 完整的组件库
- 统一的组件使用方式

### 8.3 阶段三（完成）：API集成（第4天）

**任务**：
1. 实现火山方舟API服务封装
2. 开发模型选择器
3. 实现参数配置面板
4. 开发生成结果展示组件

**交付物**：
- API调用服务
- 参数配置界面

### 8.4 阶段四（完成）：功能模块开发（第5-7天）

**任务**：
1. 实现文生图页面
2. 实现图生图页面
3. 实现组图生成页面
4. 实现历史记录页面
5. 实现设置页面

**交付物**：
- 完整的功能页面
- 状态管理（Zustand）

### 8.5 阶段五：测试与优化（长久进行）（第8天）

**任务**：
1. 功能测试
2. 响应式布局测试
3. 错误处理验证
4. UI细节优化

**交付物**：
- 稳定可用的产品

---

## 9. 关键注意事项

### 9.1 API Key安全
- API Key仅存储在本地（localStorage或Zustand persist）
- 不上传到任何服务器
- 提供清晰的API Key获取指引

### 9.2 用户体验
- 所有操作应有即时反馈
- 加载状态必须明显
- 错误信息应友好且有解决建议

### 9.3 性能考虑
- 图片懒加载
- 适当的缓存策略
- 生成队列管理（避免并发过高）

### 9.4 兼容性
- 支持主流浏览器（Chrome, Firefox, Safari, Edge）
- 移动端基本可用
- 遵循无障碍访问标准

---

## 10. 参考资料

- [火山方舟Seedream文档](https://www.volcengine.com/docs/82379/1824121)
- [方舟平台快速入门](https://www.volcengine.com/docs/82379/入门指南)
- [API Key获取地址](https://console.volcengine.com/ark/region:ark+cn-beijing/apikey)

---

*计划制定时间：2026年1月16日*
*版本：v1.0*
