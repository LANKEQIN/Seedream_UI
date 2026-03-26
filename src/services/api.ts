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
  GeneratedImage,
} from "@/types"
import { getEffectiveApiKey } from "@/stores/settings"

const API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"

// 图片尺寸验证常量（根据官方文档）
// 总像素范围：[2560x1440=3686400, 4096x4096=16777216]
export const SIZE_VALIDATION = {
  MIN_TOTAL_PIXELS: 2560 * 1440, // 3686400
  MAX_TOTAL_PIXELS: 4096 * 4096, // 16777216
  MIN_ASPECT_RATIO: 1 / 16, // 0.0625
  MAX_ASPECT_RATIO: 16,
  MIN_DIMENSION: 256, // 最小边长
  MAX_DIMENSION: 4096, // 最大边长
} as const

// 尺寸验证结果
export interface SizeValidationResult {
  isValid: boolean
  error?: string
  warning?: string
  // 计算值
  totalPixels?: number
  aspectRatio?: number
}

/**
 * 验证自定义图片尺寸是否符合 API 要求
 * 根据官方文档：https://www.volcengine.com/docs/82379/1541523
 * - 总像素范围：[3686400, 16777216]
 * - 宽高比范围：[1/16, 16]
 * @param width 宽度（像素）
 * @param height 高度（像素）
 * @returns 验证结果
 */
export function validateImageSize(
  width: number,
  height: number
): SizeValidationResult {
  // 基础验证
  if (!width || !height || width <= 0 || height <= 0) {
    return { isValid: false, error: "宽度和高度必须为正数" }
  }

  // 边长验证
  if (width < SIZE_VALIDATION.MIN_DIMENSION || height < SIZE_VALIDATION.MIN_DIMENSION) {
    return {
      isValid: false,
      error: `宽度和高度不能小于 ${SIZE_VALIDATION.MIN_DIMENSION}px`,
    }
  }

  if (width > SIZE_VALIDATION.MAX_DIMENSION || height > SIZE_VALIDATION.MAX_DIMENSION) {
    return {
      isValid: false,
      error: `宽度和高度不能超过 ${SIZE_VALIDATION.MAX_DIMENSION}px`,
    }
  }

  // 计算总像素和宽高比
  const totalPixels = width * height
  const aspectRatio = width / height

  // 总像素验证
  if (totalPixels < SIZE_VALIDATION.MIN_TOTAL_PIXELS) {
    return {
      isValid: false,
      error: `总像素 ${totalPixels.toLocaleString()} 过小，最小需要 ${SIZE_VALIDATION.MIN_TOTAL_PIXELS.toLocaleString()} (如 2560x1440)`,
      totalPixels,
      aspectRatio,
    }
  }

  if (totalPixels > SIZE_VALIDATION.MAX_TOTAL_PIXELS) {
    return {
      isValid: false,
      error: `总像素 ${totalPixels.toLocaleString()} 过大，最大允许 ${SIZE_VALIDATION.MAX_TOTAL_PIXELS.toLocaleString()} (如 4096x4096)`,
      totalPixels,
      aspectRatio,
    }
  }

  // 宽高比验证
  if (aspectRatio < SIZE_VALIDATION.MIN_ASPECT_RATIO) {
    return {
      isValid: false,
      error: `宽高比 ${aspectRatio.toFixed(4)} 过小，最小为 1:16`,
      totalPixels,
      aspectRatio,
    }
  }

  if (aspectRatio > SIZE_VALIDATION.MAX_ASPECT_RATIO) {
    return {
      isValid: false,
      error: `宽高比 ${aspectRatio.toFixed(2)} 过大，最大为 16:1`,
      totalPixels,
      aspectRatio,
    }
  }

  // 接近边界的警告
  const warnings: string[] = []
  if (totalPixels < SIZE_VALIDATION.MIN_TOTAL_PIXELS * 1.1) {
    warnings.push("总像素接近最小限制")
  }
  if (aspectRatio < SIZE_VALIDATION.MIN_ASPECT_RATIO * 2) {
    warnings.push("宽高比接近最小限制")
  }
  if (aspectRatio > SIZE_VALIDATION.MAX_ASPECT_RATIO * 0.5) {
    warnings.push("宽高比接近最大限制")
  }

  return {
    isValid: true,
    warning: warnings.length > 0 ? warnings.join("，") : undefined,
    totalPixels,
    aspectRatio,
  }
}

/**
 * 获取推荐的相近有效尺寸
 * 当用户输入无效尺寸时，提供修正建议
 * @param width 宽度
 * @param height 高度
 * @returns 推荐的有效尺寸
 */
export function getSuggestedValidSize(
  width: number,
  height: number
): { width: number; height: number } {
  // 计算当前宽高比
  const targetRatio = width / height

  // 尝试保持宽高比，调整到有效范围
  let newWidth = width
  let newHeight = height

  // 限制宽高比
  const clampedRatio = Math.max(
    SIZE_VALIDATION.MIN_ASPECT_RATIO,
    Math.min(SIZE_VALIDATION.MAX_ASPECT_RATIO, targetRatio)
  )

  // 如果宽高比被调整，重新计算尺寸
  if (clampedRatio !== targetRatio) {
    if (targetRatio < SIZE_VALIDATION.MIN_ASPECT_RATIO) {
      // 太窄，增加宽度
      newWidth = Math.round(height * SIZE_VALIDATION.MIN_ASPECT_RATIO)
    } else {
      // 太宽，增加高度
      newHeight = Math.round(width / SIZE_VALIDATION.MAX_ASPECT_RATIO)
    }
  }

  // 调整总像素到有效范围
  const currentPixels = newWidth * newHeight
  if (currentPixels < SIZE_VALIDATION.MIN_TOTAL_PIXELS) {
    // 放大到最小像素
    const scale = Math.sqrt(SIZE_VALIDATION.MIN_TOTAL_PIXELS / currentPixels)
    newWidth = Math.round(newWidth * scale)
    newHeight = Math.round(newHeight * scale)
  } else if (currentPixels > SIZE_VALIDATION.MAX_TOTAL_PIXELS) {
    // 缩小到最大像素
    const scale = Math.sqrt(SIZE_VALIDATION.MAX_TOTAL_PIXELS / currentPixels)
    newWidth = Math.round(newWidth * scale)
    newHeight = Math.round(newHeight * scale)
  }

  // 确保边长在限制内
  newWidth = Math.max(SIZE_VALIDATION.MIN_DIMENSION, Math.min(SIZE_VALIDATION.MAX_DIMENSION, newWidth))
  newHeight = Math.max(SIZE_VALIDATION.MIN_DIMENSION, Math.min(SIZE_VALIDATION.MAX_DIMENSION, newHeight))

  return { width: newWidth, height: newHeight }
}

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
    // 根据官方文档，5.0-lite 支持 2K 和 4K
    supportedSizes: ["2K", "4K"],
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
 * 计算参考图片数量
 * @param image 参考图片参数
 * @returns 参考图片数量
 */
function getReferenceImageCount(image?: string | string[]): number {
  if (!image) return 0
  return Array.isArray(image) ? image.length : 1
}

/**
 * 验证生成参数约束
 * 根据官方文档：输入的参考图数量 + 最终生成的图片数量 ≤ 15张
 * @param params 生成参数
 * @returns 验证结果
 */
export function validateGenerationConstraints(params: GenerationParams): {
  isValid: boolean
  error?: string
  referenceImageCount: number
  maxAllowedGeneration: number
} {
  const referenceImageCount = getReferenceImageCount(params.image)
  const maxAllowedGeneration = 15 - referenceImageCount

  // 检查参考图数量（最多14张）
  if (referenceImageCount > 14) {
    return {
      isValid: false,
      error: "参考图片数量不能超过14张",
      referenceImageCount,
      maxAllowedGeneration: 0,
    }
  }

  // 检查生成数量约束
  if (params.generationCount > maxAllowedGeneration) {
    return {
      isValid: false,
      error: `已上传 ${referenceImageCount} 张参考图，最多可生成 ${maxAllowedGeneration} 张图片`,
      referenceImageCount,
      maxAllowedGeneration,
    }
  }

  return {
    isValid: true,
    referenceImageCount,
    maxAllowedGeneration,
  }
}

/**
 * 生成图片 - 非流式版本
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

  // 验证约束条件
  const validation = validateGenerationConstraints(params)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  // 构建请求体
  const requestBody = buildRequestBody(params)

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

  const result = await response.json()
  console.log("非流式生成完成，响应:", result)
  console.log("返回的图片数量:", result.data?.length || 0)
  return result
}

/**
 * 流式生成图片 - 逐张获取生成的图片
 * @param params 生成参数
 * @param onImageGenerated 每张图片生成时的回调
 * @returns 最终生成结果
 */
export async function generateImageStream(
  params: GenerationParams,
  onImageGenerated: (image: GeneratedImage, index: number) => void
): Promise<GenerationResponse> {
  const apiKey = getEffectiveApiKey()

  if (!apiKey) {
    throw new Error("未设置 API Key，请点击右上角设置按钮进行配置")
  }

  // 验证约束条件
  const validation = validateGenerationConstraints(params)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  // 构建请求体，启用流式输出
  const requestBody = buildRequestBody(params)
  requestBody.stream = true

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

  // 处理流式响应 (SSE格式)
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("无法读取响应流")
  }

  const decoder = new TextDecoder()
  let buffer = ""
  const allImages: GeneratedImage[] = []
  let currentIndex = 0
  let chunkCount = 0

  console.log("开始读取流式响应...")

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      console.log("流式响应读取完成")
      break
    }

    chunkCount++
    const decodedChunk = decoder.decode(value, { stream: true })
    console.log(`收到第 ${chunkCount} 个数据块，长度: ${decodedChunk.length}`)
    console.log(`数据块内容: "${decodedChunk}"`)

    buffer += decodedChunk
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    console.log(`当前 buffer: "${buffer}"`)
    console.log(`解析出 ${lines.length} 行`)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      console.log(`处理第 ${i + 1} 行: "${line}"`)
      
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim()
        console.log(`  提取 data 部分: "${data}"`)
        
        if (data === "[DONE]") {
          console.log("  收到 [DONE] 信号")
          continue
        }
        
        try {
          const parsed = JSON.parse(data)
          console.log("  解析后的JSON:", parsed)
          
          // 处理流式响应格式 - 根据官方文档的实际格式
          // 格式: { type: "image_generation.partial_succeeded", image_index: 0, url: "..." }
          if (parsed.type === "image_generation.partial_succeeded" && parsed.url) {
            console.log("  检测到格式: image_generation.partial_succeeded")
            const img: GeneratedImage = {
              url: parsed.url,
              b64_json: parsed.b64_json,
              revised_prompt: parsed.revised_prompt,
            }
            allImages.push(img)
            console.log(`  添加图片 ${currentIndex + 1} (index=${parsed.image_index}):`, img)
            onImageGenerated(img, currentIndex++)
          }
          // 格式1: { data: [{url: "..."}, {url: "..."}] } - 数组格式 (备选)
          else if (parsed.data && Array.isArray(parsed.data)) {
            console.log("  检测到格式1: data数组")
            for (const img of parsed.data) {
              allImages.push(img)
              console.log(`  添加图片 ${currentIndex + 1}:`, img)
              onImageGenerated(img, currentIndex++)
            }
          }
          // 格式2: { url: "..." } 或 { b64_json: "..." } - 单张图片格式 (备选)
          else if (parsed.url || parsed.b64_json) {
            console.log("  检测到格式2: 单张图片")
            const img: GeneratedImage = {
              url: parsed.url,
              b64_json: parsed.b64_json,
              revised_prompt: parsed.revised_prompt,
            }
            allImages.push(img)
            console.log(`  添加图片 ${currentIndex + 1}:`, img)
            onImageGenerated(img, currentIndex++)
          }
          // 格式3: 检查其他可能的结构，例如 choices 字段 (备选)
          else if (parsed.choices && Array.isArray(parsed.choices)) {
            console.log("  检测到格式3: choices数组")
            for (const choice of parsed.choices) {
              const img: GeneratedImage = {
                url: choice.url,
                b64_json: choice.b64_json,
                revised_prompt: choice.revised_prompt,
              }
              allImages.push(img)
              console.log(`  添加图片 ${currentIndex + 1}:`, img)
              onImageGenerated(img, currentIndex++)
            }
          }
          // image_generation.completed 只是完成信号，不包含图片
          else if (parsed.type === "image_generation.completed") {
            console.log("  收到完成信号，不包含图片数据")
          }
          else {
            console.log("  未知格式，尝试查找任何可能的图片数据")
            console.log("  完整对象键:", Object.keys(parsed))
          }
        } catch (e) {
          console.error("解析流式响应失败:", e, "原始数据:", data)
        }
      }
    }
  }

  console.log("流式生成完成，共获取图片:", allImages.length)

  return {
    created: Date.now(),
    data: allImages,
  }
}

/**
 * 构建请求体
 * @param params 生成参数
 * @returns 请求体对象
 */
function buildRequestBody(params: GenerationParams): Record<string, unknown> {
  // 根据模型自动适配输出格式
  const validFormat = getValidOutputFormat(params.model, params.outputFormat)
  const supportsOutputFormat = params.model === "doubao-seedream-5-0-lite-260128"

  // 判断是否为组图模式
  const isGroupMode = params.sequentialImageGeneration === "auto"

  // 优化提示词：组图模式下，强制添加明确的组图指令
  let finalPrompt = params.prompt
  if (isGroupMode && params.generationCount > 1) {
    // 强制添加组图指令，确保模型理解需要生成多张图片
    finalPrompt = `${params.prompt}。请生成${params.generationCount}张不同的图片，组成一组组图。`
  }

  // 基础请求体
  const requestBody: Record<string, unknown> = {
    model: params.model,
    prompt: finalPrompt,
    size: params.size,
    response_format: params.responseFormat,
    watermark: params.watermark,
  }

  console.log("buildRequestBody - 调试信息:")
  console.log("  - sequentialImageGeneration:", params.sequentialImageGeneration)
  console.log("  - generationCount:", params.generationCount)
  console.log("  - isGroupMode:", isGroupMode)
  console.log("  - 原始提示词:", params.prompt)
  console.log("  - 最终提示词:", finalPrompt)

  // 根据官方文档：
  // - 组图模式(auto)：使用 sequential_image_generation_options.max_images 控制数量，不使用 n 参数
  // - 单图模式(disabled)：使用 n 参数控制数量
  if (isGroupMode) {
    // 组图模式：设置 sequential_image_generation 和 max_images
    requestBody.sequential_image_generation = "auto"
    requestBody.sequential_image_generation_options = {
      max_images: params.generationCount
    }
    console.log("  - 设置为组图模式，max_images:", params.generationCount)
  } else {
    // 单图模式：使用 n 参数
    requestBody.n = params.generationCount
    // 显式设置 sequential_image_generation 为 disabled
    requestBody.sequential_image_generation = "disabled"
    console.log("  - 设置为单图模式，n:", params.generationCount)
  }

  console.log("  - 最终请求体:", JSON.stringify(requestBody, null, 2))

  if (supportsOutputFormat) {
    requestBody.output_format = validFormat
  }

  if (params.negativePrompt) {
    requestBody.negative_prompt = params.negativePrompt
  }

  if (params.image) {
    requestBody.image = params.image
  }

  if (params.webSearch && params.model === "doubao-seedream-5-0-lite-260128") {
    requestBody.web_search = true
  }

  return requestBody
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
    // 默认设置为 disabled（单图模式）
    sequentialImageGeneration: "disabled",
    // 默认不开启联网搜索
    webSearch: false,
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


