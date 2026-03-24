import { useCallback, useEffect } from 'react'
import { useGenerationStore, uploadReferenceImage } from '@/stores/generationStore'
import { useHistoryStore, createHistoryEntry } from '@/stores/historyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { GenerationType, ModelId, Resolution, OutputFormat, GeneratedImage } from '@/types/generation'

/**
 * 图片生成Hook返回类型
 */
export interface UseImageGenerationReturn {
  // 状态
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  
  // 参数
  model: ModelId
  prompt: string
  size: Resolution
  outputFormat: OutputFormat
  watermark: boolean
  webSearch: boolean
  generationType: GenerationType
  seriesCount: number
  referenceImages: string[]
  results: GeneratedImage[]
  
  // 参数设置
  setModel: (model: ModelId) => void
  setPrompt: (prompt: string) => void
  setSize: (size: Resolution) => void
  setOutputFormat: (format: OutputFormat) => void
  setWatermark: (watermark: boolean) => void
  setWebSearch: (webSearch: boolean) => void
  setGenerationType: (type: GenerationType) => void
  setSeriesCount: (count: number) => void
  
  // 参考图片操作
  handleImageUpload: (file: File) => Promise<void>
  removeReferenceImage: (index: number) => void
  clearReferenceImages: () => void
  
  // 生成操作
  generate: () => Promise<void>
  reset: () => void
  clearResults: () => void
  
  // API Key状态
  hasApiKey: boolean
}

/**
 * 图片生成自定义Hook
 * 封装图片生成的所有逻辑，包括状态管理、API调用和历史记录
 */
export function useImageGeneration(): UseImageGenerationReturn {
  // 获取生成状态
  const generationState = useGenerationStore()
  
  // 获取历史记录操作
  const { addHistory } = useHistoryStore()
  
  // 获取API Key状态
  const hasApiKey = useSettingsStore((state) => state.hasApiKey())
  
  // 初始化API服务
  useEffect(() => {
    if (hasApiKey && !generationState.apiService) {
      generationState.initApiService()
    }
  }, [hasApiKey, generationState])
  
  // 处理图片上传
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const base64 = await uploadReferenceImage(file)
      generationState.addReferenceImage(base64)
    } catch (error) {
      generationState.setPrompt(generationState.prompt) // 触发错误显示
      throw error
    }
  }, [generationState])
  
  // 生成图片并保存历史
  const generate = useCallback(async () => {
    await generationState.generate()
    
    // 生成成功后保存到历史记录
    if (generationState.status === 'success' && generationState.results.length > 0) {
      const historyEntry = createHistoryEntry(
        generationState.generationType,
        generationState.model,
        generationState.prompt,
        generationState.results,
        generationState.referenceImages.length > 0 ? generationState.referenceImages : undefined,
        {
          size: generationState.size,
          outputFormat: generationState.outputFormat,
          watermark: generationState.watermark,
        }
      )
      addHistory(historyEntry)
    }
  }, [generationState, addHistory])
  
  return {
    // 状态
    status: generationState.status,
    error: generationState.error,
    isLoading: generationState.status === 'loading',
    isSuccess: generationState.status === 'success',
    isError: generationState.status === 'error',
    
    // 参数
    model: generationState.model,
    prompt: generationState.prompt,
    size: generationState.size,
    outputFormat: generationState.outputFormat,
    watermark: generationState.watermark,
    webSearch: generationState.webSearch,
    generationType: generationState.generationType,
    seriesCount: generationState.seriesCount,
    referenceImages: generationState.referenceImages,
    results: generationState.results,
    
    // 参数设置
    setModel: generationState.setModel,
    setPrompt: generationState.setPrompt,
    setSize: generationState.setSize,
    setOutputFormat: generationState.setOutputFormat,
    setWatermark: generationState.setWatermark,
    setWebSearch: generationState.setWebSearch,
    setGenerationType: generationState.setGenerationType,
    setSeriesCount: generationState.setSeriesCount,
    
    // 参考图片操作
    handleImageUpload,
    removeReferenceImage: generationState.removeReferenceImage,
    clearReferenceImages: generationState.clearReferenceImages,
    
    // 生成操作
    generate,
    reset: generationState.reset,
    clearResults: generationState.clearResults,
    
    // API Key状态
    hasApiKey,
  }
}

/**
 * 检查是否可以使用联网搜索功能
 */
export function useCanUseWebSearch(model: ModelId): boolean {
  return model === 'doubao-seedream-5-0-lite-260128'
}

/**
 * 获取模型支持的分辨率列表
 */
export function useAvailableSizes(model: ModelId): Resolution[] {
  const MODEL_CONFIG = {
    'doubao-seedream-5-0-lite-260128': ['2K', '3K'] as Resolution[],
    'doubao-seedream-4-5-251128': ['2K', '4K'] as Resolution[],
    'doubao-seedream-4-0-250828': ['1K', '2K', '4K'] as Resolution[],
  }
  return MODEL_CONFIG[model] || ['2K'] as Resolution[]
}
