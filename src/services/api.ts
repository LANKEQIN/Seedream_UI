/**
 * Seedream API 服务
 * 参考文档: https://www.volcengine.com/docs/82379/1824121
 * 参考文档: https://www.volcengine.com/docs/82379/1541523
 */

import type {
  GenerationParams,
  GenerationResponse,
  ModelInfo,
  ModelId,
  ImageFormat,
  ImageSizeConfig,
  Resolution,
  AspectRatio,
} from "@/types"
import { getEffectiveApiKey } from "@/stores/settings"

const API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"

// 分辨率对应的推荐像素尺寸映射表
// 根据官方文档推荐的宽高像素值
export const RESOLUTION_DIMENSIONS: Record<
  Resolution,
  Record<Exclude<AspectRatio, "auto">, { width: number; height: number }>
> = {
  "2K": {
    "1:1": { width: 2048, height: 2048 },
    "4:3": { width: 2304, height: 1728 },
    "3:4": { width: 1728, height: 2304 },
    "16:9": { width: 2848, height: 1600 },
    "9:16": { width: 1600, height: 2848 },
    "3:2": { width: 2496, height: 1664 },
    "2:3": { width: 1664, height: 2496 },
    "21:9": { width: 3136, height: 1344 },
  },
  "3K": {
    // 3K 的推荐尺寸（基于 2K 比例放大）
    "1:1": { width: 3072, height: 3072 },
    "4:3": { width: 3456, height: 2592 },
    "3:4": { width: 2592, height: 3456 },
    "16:9": { width: 3648, height: 2048 },
    "9:16": { width: 2048, height: 3648 },
    "3:2": { width: 3744, height: 2496 },
    "2:3": { width: 2496, height: 3744 },
    "21:9": { width: 4032, height: 1728 },
  },
  "4K": {
    "1:1": { width: 4096, height: 4096 },
    "3:4": { width: 3520, height: 4704 },
    "4:3": { width: 4704, height: 3520 },
    "16:9": { width: 5504, height: 3040 },
    "9:16": { width: 3040, height: 5504 },
    "2:3": { width: 3328, height: 4992 },
    "3:2": { width: 4992, height: 3328 },
    "21:9": { width: 6240, height: 2656 },
  },
}

// 比例选项配置
export const ASPECT_RATIO_OPTIONS: {
  value: AspectRatio
  label: string
  icon: string
  description?: string
}[] = [
  { value: "auto", label: "智能", icon: "smart", description: "由模型自动判断" },
  { value: "1:1", label: "1:1", icon: "square", description: "正方形" },
  { value: "3:4", label: "3:4", icon: "portrait", description: "竖版" },
  { value: "4:3", label: "4:3", icon: "landscape", description: "横版" },
  { value: "16:9", label: "16:9", icon: "wide", description: "宽屏" },
  { value: "9:16", label: "9:16", icon: "tall", description: "全竖屏" },
  { value: "2:3", label: "2:3", icon: "portrait", description: "竖版" },
  { value: "3:2", label: "3:2", icon: "landscape", description: "横版" },
  { value: "21:9", label: "21:9", icon: "ultrawide", description: "超宽屏" },
]

// 支持的模型列表
// 根据官方文档：https://www.volcengine.com/docs/82379/1541523
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: "doubao-seedream-5-0-lite-260128",
    name: "Seedream 5.0 Lite",
    description: "轻量级高性能模型，支持文生图、图生图、多图融合、联网搜索",
    supports: {
      textToImage: true,
      imageToImage: true,
      multiImage: true,
      streaming: true,
      webSearch: true,
    },
    // 5.0 Lite 支持 png 和 jpeg
    supportedFormats: ["png", "jpeg"],
    // 5.0 Lite 支持 2K 和 3K
    supportedSizes: ["2K", "3K"],
    // 最大生成数量：参考图数量 + 生成数量 ≤ 15
    maxGenerationCount: 15,
  },
  {
    id: "doubao-seedream-4-5-251128",
    name: "Seedream 4.5",
    description: "平衡质量与速度，支持多种创作模式",
    supports: {
      textToImage: true,
      imageToImage: true,
      multiImage: true,
      streaming: true,
      webSearch: false,
    },
    // 4.5 仅支持 jpeg
    supportedFormats: ["jpeg"],
    // 4.5 支持 2K 和 4K
    supportedSizes: ["2K", "4K"],
    maxGenerationCount: 15,
  },
]

// 图片尺寸选项（向后兼容）
export const IMAGE_SIZES = [
  { value: "2K", label: "2K (推荐)", description: "2048x2048 或类似比例" },
  { value: "4K", label: "4K", description: "4096x4096 或类似比例" },
  { value: "1024x1024", label: "1024x1024", description: "1:1 正方形" },
  { value: "1024x1536", label: "1024x1536", description: "2:3 竖版" },
  { value: "1536x1024", label: "1536x1024", description: "3:2 横版" },
  { value: "1024x576", label: "1024x576", description: "16:9 横版" },
  { value: "576x1024", label: "576x1024", description: "9:16 竖版" },
]

// 生成数量选项
export const GENERATION_COUNT_OPTIONS = {
  min: 1,
  max: 15,
  default: 1,
  step: 1,
}

/**
 * 根据尺寸配置生成 API 所需的 size 字符串
 * @param config 图片尺寸配置
 * @returns API 所需的 size 参数值
 */
export function generateSizeString(config: ImageSizeConfig): string {
  // 如果使用了自定义宽高，直接返回 "WxH" 格式
  if (config.customWidth && config.customHeight) {
    return `${config.customWidth}x${config.customHeight}`
  }

  // 智能比例模式下，只返回分辨率
  if (config.aspectRatio === "auto") {
    return config.resolution
  }

  // 获取对应分辨率和比例的推荐尺寸
  const dimensions =
    RESOLUTION_DIMENSIONS[config.resolution]?.[config.aspectRatio]
  if (dimensions) {
    return `${dimensions.width}x${dimensions.height}`
  }

  // 回退到分辨率
  return config.resolution
}

/**
 * 获取模型支持的尺寸选项
 * @param modelId 模型ID
 * @returns 该模型支持的分辨率列表
 */
export function getModelSupportedSizes(modelId: ModelId): Resolution[] {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId)
  return model?.supportedSizes ?? ["2K"]
}

/**
 * 获取默认的尺寸配置
 * @returns 默认 ImageSizeConfig
 */
export function getDefaultSizeConfig(): ImageSizeConfig {
  return {
    resolution: "2K",
    aspectRatio: "auto",
  }
}

// 图片格式选项定义
// 注意：不同模型支持的格式不同，根据官方文档：
// - 5.0 Lite: png, jpeg
// - 4.5/4.0: jpeg only
export const IMAGE_FORMAT_OPTIONS = [
  { value: "png", label: "PNG", description: "无损压缩，支持透明" },
  { value: "jpeg", label: "JPEG", description: "有损压缩，文件较小" },
]

/**
 * 获取指定模型支持的图片格式选项
 * @param modelId 模型ID
 * @returns 该模型支持的格式选项列表
 */
export function getSupportedFormats(modelId: ModelId) {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId)
  if (!model) return IMAGE_FORMAT_OPTIONS

  return IMAGE_FORMAT_OPTIONS.filter(fmt =>
    model.supportedFormats.includes(fmt.value as ImageFormat)
  )
}

/**
 * 获取模型支持的输出格式，如果请求的格式不支持则返回默认格式
 * @param modelId 模型ID
 * @param requestedFormat 请求的格式
 * @returns 实际使用的格式
 */
function getValidOutputFormat(
  modelId: ModelId,
  requestedFormat: ImageFormat
): ImageFormat {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId)
  if (!model) return requestedFormat

  // 如果请求的格式不被支持，使用第一个支持的格式
  if (!model.supportedFormats.includes(requestedFormat)) {
    console.warn(
      `模型 ${modelId} 不支持格式 ${requestedFormat}，已自动切换为 ${model.supportedFormats[0]}`
    )
    return model.supportedFormats[0]
  }

  return requestedFormat
}

/**
 * 生成图片
 * @param params 生成参数
 * @returns 生成结果
 */
export async function generateImage(
  params: GenerationParams
): Promise<GenerationResponse> {
  const apiKey = getEffectiveApiKey()

  if (!apiKey) {
    throw new Error("未设置 API Key，请点击右上角设置按钮进行配置")
  }

  // 根据模型自动适配输出格式
  // 注意：根据官方文档和实际测试，只有 5.0 Lite 支持 output_format 参数
  // 4.5/4.0 模型发送此参数会导致报错
  const validFormat = getValidOutputFormat(params.model, params.outputFormat)
  const supportsOutputFormat = params.model === "doubao-seedream-5-0-lite-260128"

  // 构建请求体
  // 参考文档: https://www.volcengine.com/docs/82379/1541523
  const requestBody: Record<string, unknown> = {
    model: params.model,
    prompt: params.prompt,
    size: params.size,
    response_format: params.responseFormat,
    watermark: params.watermark,
    // 生成数量（1-15，参考图数量 + 生成数量 ≤ 15）
    n: params.generationCount,
  }

  // 只有 5.0 Lite 模型添加 output_format 参数
  if (supportsOutputFormat) {
    requestBody.output_format = validFormat
  }

  // 添加可选参数
  if (params.negativePrompt) {
    requestBody.negative_prompt = params.negativePrompt
  }

  const response = await fetch(`${API_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error?.message || `请求失败: ${response.status}`
    )
  }

  return response.json()
}

/**
 * 获取默认生成参数
 * @returns 默认 GenerationParams
 */
export function getDefaultParams(): GenerationParams {
  const defaultSizeConfig = getDefaultSizeConfig()
  return {
    model: "doubao-seedream-5-0-lite-260128",
    prompt: "",
    sizeConfig: defaultSizeConfig,
    size: generateSizeString(defaultSizeConfig),
    outputFormat: "png",
    responseFormat: "url",
    watermark: false,
    generationCount: GENERATION_COUNT_OPTIONS.default,
  }
}

/**
 * 验证 API Key 是否有效
 * @returns 是否有效
 */
export async function validateApiKey(): Promise<boolean> {
  const apiKey = getEffectiveApiKey()

  if (!apiKey) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    return response.ok
  } catch {
    return false
  }
}


