/**
 * 图片生成相关类型定义
 * 参考文档: https://www.volcengine.com/docs/82379/1541523
 */

// 支持的模型
export type ModelId =
  | "doubao-seedream-5-0-lite-260128"
  | "doubao-seedream-4-5-251128"

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
  // 各模型支持的分辨率
  supportedSizes: Resolution[]
  // 最大生成数量（参考图数量 + 生成数量 ≤ 15）
  maxGenerationCount: number
}

// 分辨率类型
// 根据官方文档：
// - 5.0-lite: 2K, 4K
// - 4.5: 2K, 4K
export type Resolution = "2K" | "4K"

// 图片比例类型
export type AspectRatio =
  | "auto" // 智能比例
  | "1:1"
  | "3:4"
  | "4:3"
  | "16:9"
  | "9:16"
  | "2:3"
  | "3:2"
  | "21:9"

// 图片尺寸配置
export interface ImageSizeConfig {
  // 分辨率
  resolution: Resolution
  // 比例
  aspectRatio: AspectRatio
  // 自定义宽高（当需要精确控制时使用）
  customWidth?: number
  customHeight?: number
}

// 图片格式
export type ImageFormat = "png" | "jpeg" | "webp"

// 响应格式
export type ResponseFormat = "url" | "b64_json"

// 参考图片类型（支持 URL 或 Base64）
export type ImageInput = string

// 组图生成模式
export type SequentialImageGeneration = "auto" | "disabled"

// 生成参数
export interface GenerationParams {
  model: ModelId
  prompt: string
  // 图片尺寸配置
  sizeConfig: ImageSizeConfig
  // 向后兼容的 size 字段（用于 API 调用）
  size: string
  outputFormat: ImageFormat
  responseFormat: ResponseFormat
  watermark: boolean
  // 生成数量（1-15，参考图数量 + 生成数量 ≤ 15）
  generationCount: number
  negativePrompt?: string
  // 参考图片（支持单张或多张，最多14张）
  // 支持 URL 或 Base64 编码格式
  image?: ImageInput | ImageInput[]
  // 组图生成模式：auto 启用组图生成，disabled 单图生成
  sequentialImageGeneration?: SequentialImageGeneration
  // 联网搜索（仅 5.0-lite 支持）
  webSearch?: boolean
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
export type GenerationStatus = "idle" | "loading" | "streaming" | "success" | "error"

// 生成任务
export interface GenerationTask {
  id: string
  status: GenerationStatus
  params: GenerationParams
  result?: GenerationResponse
  error?: string
  createdAt: number
  completedAt?: number
  // 流式生成时已获取的图片
  partialImages?: GeneratedImage[]
  // 已完成的图片数量
  completedCount?: number
}
