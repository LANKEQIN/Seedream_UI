import { API_BASE_URL, MODEL_CONFIG } from '@/lib/constants'
import type { ModelId, Resolution, OutputFormat, GeneratedImage } from '@/types/generation'

/**
 * API错误类型
 */
export class ArkApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string
  ) {
    super(message)
    this.name = 'ArkApiError'
  }
}

/**
 * 图片生成请求参数
 */
export interface ImageGenerationRequest {
  model: ModelId
  prompt: string
  size: Resolution
  outputFormat: OutputFormat
  watermark: boolean
  webSearch?: boolean
  referenceImages?: string[]
  seriesCount?: number
}

/**
 * API响应类型
 */
interface ArkImageResponse {
  created: number
  data: Array<{
    url?: string
    b64_json?: string
  }>
}

/**
 * 将分辨率转换为API需要的格式
 * 根据官方文档，直接传分辨率字符串（如 "2K"、"4K"）
 */
function resolutionToSize(resolution: Resolution): string {
  return resolution
}

/**
 * 火山方舟API服务类
 * 封装所有与火山方舟API的交互
 */
export class ArkApiService {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseUrl = API_BASE_URL
  }

  /**
   * 验证API Key是否有效
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * 获取请求头
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    }
  }

  /**
   * 文生图 - 根据文本提示词生成图片
   */
  async textToImage(params: ImageGenerationRequest): Promise<GeneratedImage[]> {
    const requestBody: Record<string, unknown> = {
      model: params.model,
      prompt: params.prompt,
      size: resolutionToSize(params.size),
      output_format: params.outputFormat,
      response_format: 'url',
      watermark: params.watermark,
    }

    // 5.0-lite模型支持联网搜索
    if (params.webSearch && (MODEL_CONFIG[params.model].supports as readonly string[]).includes('联网搜索')) {
      requestBody.web_search = true
    }

    return this.generateImage(requestBody)
  }

  /**
   * 图生图 - 基于参考图生成新图片
   */
  async imageToImage(params: ImageGenerationRequest): Promise<GeneratedImage[]> {
    if (!params.referenceImages || params.referenceImages.length === 0) {
      throw new ArkApiError('图生图需要提供参考图片')
    }

    const requestBody: Record<string, unknown> = {
      model: params.model,
      prompt: params.prompt,
      size: resolutionToSize(params.size),
      output_format: params.outputFormat,
      response_format: 'url',
      watermark: params.watermark,
      image: params.referenceImages.length === 1 
        ? params.referenceImages[0] 
        : params.referenceImages,
    }

    return this.generateImage(requestBody)
  }

  /**
   * 组图生成 - 基于参考图生成一组关联图片
   * 根据官方文档，需配置 sequential_image_generation 为 auto
   */
  async seriesGeneration(params: ImageGenerationRequest): Promise<GeneratedImage[]> {
    if (!params.referenceImages || params.referenceImages.length === 0) {
      throw new ArkApiError('组图生成需要提供参考图片')
    }

    // 验证：参考图数量 + 生成图数量 ≤ 15
    const totalImages = params.referenceImages.length + (params.seriesCount || 1)
    if (totalImages > 15) {
      throw new ArkApiError(`参考图(${params.referenceImages.length}张) + 生成图(${params.seriesCount}张)总数不能超过15张`)
    }

    const requestBody: Record<string, unknown> = {
      model: params.model,
      prompt: params.prompt,
      size: resolutionToSize(params.size),
      output_format: params.outputFormat,
      response_format: 'url',
      watermark: params.watermark,
      image: params.referenceImages.length === 1 
        ? params.referenceImages[0] 
        : params.referenceImages,
      sequential_image_generation: 'auto',
      n: params.seriesCount,
    }

    return this.generateImage(requestBody)
  }

  /**
   * 通用图片生成方法
   */
  private async generateImage(requestBody: Record<string, unknown>): Promise<GeneratedImage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ArkApiError(
          errorData.error?.message || `API请求失败: ${response.status}`,
          response.status,
          errorData.error?.code
        )
      }

      const data: ArkImageResponse = await response.json()

      return data.data.map((item) => ({
        url: item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : ''),
        width: this.parseWidthFromSize(requestBody.size as string),
        height: this.parseHeightFromSize(requestBody.size as string),
        format: requestBody.output_format as OutputFormat,
      }))
    } catch (error) {
      if (error instanceof ArkApiError) {
        throw error
      }
      throw new ArkApiError(
        error instanceof Error ? error.message : '网络请求失败'
      )
    }
  }

  /**
   * 从分辨率字符串解析宽度
   * 根据官方文档推荐值映射
   */
  private parseWidthFromSize(size: string): number {
    // 如果是像素格式（如 "2048x2048"）
    if (size.includes('x')) {
      const width = parseInt(size.split('x')[0], 10)
      return isNaN(width) ? 2048 : width
    }
    // 分辨率字符串映射（1:1 比例）
    const sizeMap: Record<string, number> = {
      '1K': 1024,
      '2K': 2048,
      '3K': 3072,
      '4K': 4096,
    }
    return sizeMap[size] || 2048
  }

  /**
   * 从分辨率字符串解析高度
   * 根据官方文档推荐值映射
   */
  private parseHeightFromSize(size: string): number {
    // 如果是像素格式（如 "2048x2048"）
    if (size.includes('x')) {
      const height = parseInt(size.split('x')[1], 10)
      return isNaN(height) ? 2048 : height
    }
    // 分辨率字符串映射（1:1 比例）
    const sizeMap: Record<string, number> = {
      '1K': 1024,
      '2K': 2048,
      '3K': 3072,
      '4K': 4096,
    }
    return sizeMap[size] || 2048
  }
}

/**
 * 创建API服务实例的工厂函数
 */
export function createArkApiService(apiKey: string): ArkApiService {
  return new ArkApiService(apiKey)
}

/**
 * 将图片文件转换为Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // 移除 data:image/xxx;base64, 前缀
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
  })
}

/**
 * 将URL转换为Base64
 */
export async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = () => reject(new Error('图片数据读取失败'))
    })
  } catch {
    throw new ArkApiError('无法获取图片数据')
  }
}
