/**
 * Seedream API 服务
 * 参考文档: https://www.volcengine.com/docs/82379/1824121
 */

import type {
  GenerationParams,
  GenerationResponse,
  ModelInfo,
} from "@/types"
import { getEffectiveApiKey } from "@/stores/settings"

const API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"

// 支持的模型列表
// 根据官方文档：https://www.volcengine.com/docs/82379/1541523
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: "doubao-seedream-5-0-lite-260128",
    name: "Seedream 5.0 Lite",
    description: "轻量级高性能模型，支持文生图、图生图、多图融合",
    supports: {
      textToImage: true,
      imageToImage: true,
      multiImage: true,
      streaming: true,
      webSearch: true,
    },
    // 5.0 Lite 支持 png 和 jpeg
    supportedFormats: ["png", "jpeg"],
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
  },
  {
    id: "doubao-seedream-4-0-250828",
    name: "Seedream 4.0",
    description: "经典版本，稳定可靠",
    supports: {
      textToImage: true,
      imageToImage: true,
      multiImage: true,
      streaming: true,
      webSearch: false,
    },
    // 4.0 仅支持 jpeg
    supportedFormats: ["jpeg"],
  },
]

// 图片尺寸选项
export const IMAGE_SIZES = [
  { value: "2K", label: "2K (推荐)", description: "2048x2048 或类似比例" },
  { value: "4K", label: "4K", description: "4096x4096 或类似比例" },
  { value: "1024x1024", label: "1024x1024", description: "1:1 正方形" },
  { value: "1024x1536", label: "1024x1536", description: "2:3 竖版" },
  { value: "1536x1024", label: "1536x1024", description: "3:2 横版" },
  { value: "1024x576", label: "1024x576", description: "16:9 横版" },
  { value: "576x1024", label: "576x1024", description: "9:16 竖版" },
]

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
  const requestBody: Record<string, unknown> = {
    model: params.model,
    prompt: params.prompt,
    size: params.size,
    response_format: params.responseFormat,
    watermark: params.watermark,
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

/**
 * 获取默认生成参数
 * @returns 默认参数
 */
export function getDefaultParams(): GenerationParams {
  return {
    model: "doubao-seedream-5-0-lite-260128",
    prompt: "",
    size: "2K",
    outputFormat: "png",
    responseFormat: "url",
    watermark: false,
  }
}
