import { create } from 'zustand'
import type { 
  ModelId, 
  Resolution, 
  OutputFormat, 
  GenerationType,
  GeneratedImage 
} from '@/types/generation'
import { 
  ArkApiService, 
  createArkApiService, 
  fileToBase64,
  type ImageGenerationRequest 
} from '@/services/arkApi'
import { useSettingsStore } from './settingsStore'

/**
 * 生成状态枚举
 */
export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * 生成状态接口
 */
export interface GenerationState {
  // 当前状态
  status: GenerationStatus
  error: string | null
  
  // 生成参数
  model: ModelId
  prompt: string
  size: Resolution
  outputFormat: OutputFormat
  watermark: boolean
  webSearch: boolean
  generationType: GenerationType
  
  // 参考图片
  referenceImages: string[]
  
  // 组图数量
  seriesCount: number
  
  // 生成结果
  results: GeneratedImage[]
  
  // API服务实例
  apiService: ArkApiService | null
  
  // Actions
  setModel: (model: ModelId) => void
  setPrompt: (prompt: string) => void
  setSize: (size: Resolution) => void
  setOutputFormat: (format: OutputFormat) => void
  setWatermark: (watermark: boolean) => void
  setWebSearch: (webSearch: boolean) => void
  setGenerationType: (type: GenerationType) => void
  setSeriesCount: (count: number) => void
  
  // 参考图片操作
  addReferenceImage: (base64: string) => void
  removeReferenceImage: (index: number) => void
  clearReferenceImages: () => void
  
  // 生成操作
  generate: () => Promise<void>
  reset: () => void
  clearResults: () => void
  
  // 初始化API服务
  initApiService: () => boolean
}

/**
 * 默认生成参数
 */
const defaultParams = {
  model: 'doubao-seedream-5-0-lite-260128' as ModelId,
  prompt: '',
  size: '2K' as Resolution,
  outputFormat: 'png' as OutputFormat,
  watermark: false,
  webSearch: false,
  generationType: 'text-to-image' as GenerationType,
  seriesCount: 4,
}

/**
 * 图片生成状态管理Store
 */
export const useGenerationStore = create<GenerationState>((set, get) => ({
  // 初始状态
  status: 'idle',
  error: null,
  ...defaultParams,
  referenceImages: [],
  results: [],
  apiService: null,
  
  // 参数设置Actions
  setModel: (model) => set({ model }),
  setPrompt: (prompt) => set({ prompt }),
  setSize: (size) => set({ size }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),
  setWatermark: (watermark) => set({ watermark }),
  setWebSearch: (webSearch) => set({ webSearch }),
  setGenerationType: (generationType) => set({ generationType }),
  setSeriesCount: (seriesCount) => set({ seriesCount }),
  
  // 参考图片操作
  addReferenceImage: (base64) => {
    const { referenceImages } = get()
    set({ referenceImages: [...referenceImages, base64] })
  },
  
  removeReferenceImage: (index) => {
    const { referenceImages } = get()
    set({ 
      referenceImages: referenceImages.filter((_, i) => i !== index) 
    })
  },
  
  clearReferenceImages: () => set({ referenceImages: [] }),
  
  // 初始化API服务
  initApiService: () => {
    const apiKey = useSettingsStore.getState().apiKey
    if (!apiKey) {
      set({ error: '请先配置API Key' })
      return false
    }
    set({ 
      apiService: createArkApiService(apiKey),
      error: null 
    })
    return true
  },
  
  // 生成图片
  generate: async () => {
    const state = get()
    
    // 验证提示词
    if (!state.prompt.trim()) {
      set({ error: '请输入提示词' })
      return
    }
    
    // 初始化API服务
    if (!state.apiService) {
      const initialized = state.initApiService()
      if (!initialized) return
    }
    
    set({ status: 'loading', error: null })
    
    try {
      const requestParams: ImageGenerationRequest = {
        model: state.model,
        prompt: state.prompt,
        size: state.size,
        outputFormat: state.outputFormat,
        watermark: state.watermark,
        webSearch: state.webSearch,
        referenceImages: state.referenceImages,
        seriesCount: state.seriesCount,
      }
      
      let results: GeneratedImage[]
      
      // 根据生成类型调用不同的API方法
      switch (state.generationType) {
        case 'text-to-image':
          results = await state.apiService!.textToImage(requestParams)
          break
        case 'image-to-image':
          results = await state.apiService!.imageToImage(requestParams)
          break
        case 'series':
          results = await state.apiService!.seriesGeneration(requestParams)
          break
        default:
          throw new Error('未知的生成类型')
      }
      
      set({ 
        status: 'success', 
        results,
        error: null 
      })
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '生成失败，请重试'
      set({ 
        status: 'error', 
        error: errorMessage 
      })
    }
  },
  
  // 重置状态
  reset: () => set({
    status: 'idle',
    error: null,
    ...defaultParams,
    referenceImages: [],
    results: [],
  }),
  
  // 清除结果
  clearResults: () => set({ 
    results: [], 
    status: 'idle',
    error: null 
  }),
}))

/**
 * 上传参考图片并添加到状态
 */
export async function uploadReferenceImage(file: File): Promise<string> {
  // 验证文件类型（5.0-lite/4.5/4.0 支持 jpeg/png/webp/bmp/tiff/gif）
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/bmp', 'image/tiff', 'image/gif']
  if (!validTypes.includes(file.type)) {
    throw new Error('不支持的图片格式，请上传 PNG、JPEG、WebP、BMP、TIFF 或 GIF 格式的图片')
  }
  
  // 验证文件大小 (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('图片大小不能超过 10MB')
  }
  
  return fileToBase64(file)
}
