/**
 * 图片生成相关类型定义
 */

// 支持的模型
export type ModelId =
  | "doubao-seedream-5-0-lite-260128"
  | "doubao-seedream-4-5-251128"
  | "doubao-seedream-4-0-250828"

// 模型信息
export interface ModelInfo {
  id: ModelId
  name: string
  description: string
  supports: {
    textToImage: boolean
    imageToImage: boolean
    multiImage: boolean
    streaming: boolean
    webSearch: boolean
  }
  // 根据官方文档，不同模型支持不同的输出格式
  // 5.0-lite: png, jpeg
  // 4.5/4.0: jpeg only
  supportedFormats: ImageFormat[]
}

// 图片尺寸选项
export type ImageSize =
  | "1K"
  | "2K"
  | "4K"
  | string // 自定义尺寸如 "1024x1024"

// 图片格式
export type ImageFormat = "png" | "jpeg" | "webp"

// 响应格式
export type ResponseFormat = "url" | "b64_json"

// 生成参数
export interface GenerationParams {
  model: ModelId
  prompt: string
  size: ImageSize
  outputFormat: ImageFormat
  responseFormat: ResponseFormat
  watermark: boolean
  negativePrompt?: string
}

// 生成的图片
export interface GeneratedImage {
  url?: string
  b64_json?: string
  revised_prompt?: string
}

// API响应
export interface GenerationResponse {
  created: number
  data: GeneratedImage[]
}

// 生成状态
export type GenerationStatus = "idle" | "loading" | "success" | "error"

// 生成任务
export interface GenerationTask {
  id: string
  status: GenerationStatus
  params: GenerationParams
  result?: GenerationResponse
  error?: string
  createdAt: number
  completedAt?: number
}
