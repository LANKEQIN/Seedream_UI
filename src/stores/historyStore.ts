import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  GenerationType, 
  ModelId, 
  GeneratedImage,
  GenerationResult 
} from '@/types/generation'

/**
 * 历史记录状态接口
 */
export interface HistoryState {
  // 历史记录列表
  history: GenerationResult[]
  
  // 最大保存数量
  maxHistorySize: number
  
  // Actions
  addHistory: (result: Omit<GenerationResult, 'id' | 'createdAt'>) => string
  removeHistory: (id: string) => void
  clearHistory: () => void
  getHistoryById: (id: string) => GenerationResult | undefined
  getRecentHistory: (limit?: number) => GenerationResult[]
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 历史记录状态管理Store
 */
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      maxHistorySize: 100,
      
      // 添加历史记录
      addHistory: (result) => {
        const id = generateId()
        const newResult: GenerationResult = {
          ...result,
          id,
          createdAt: new Date(),
        }
        
        set((state) => {
          // 添加到列表开头
          const newHistory = [newResult, ...state.history]
          
          // 限制历史记录数量
          if (newHistory.length > state.maxHistorySize) {
            return { 
              history: newHistory.slice(0, state.maxHistorySize) 
            }
          }
          
          return { history: newHistory }
        })
        
        return id
      },
      
      // 删除历史记录
      removeHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }))
      },
      
      // 清空历史记录
      clearHistory: () => set({ history: [] }),
      
      // 根据ID获取历史记录
      getHistoryById: (id) => {
        return get().history.find((item) => item.id === id)
      },
      
      // 获取最近的历史记录
      getRecentHistory: (limit = 10) => {
        return get().history.slice(0, limit)
      },
    }),
    {
      name: 'seedream-history',
      // 自定义序列化处理Date对象
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const data = JSON.parse(str)
          // 恢复Date对象
          if (data.state?.history) {
            data.state.history = data.state.history.map((item: GenerationResult) => ({
              ...item,
              createdAt: new Date(item.createdAt),
            }))
          }
          return data
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)

/**
 * 从生成结果创建历史记录
 */
export function createHistoryEntry(
  type: GenerationType,
  model: ModelId,
  prompt: string,
  images: GeneratedImage[],
  referenceImages?: string[],
  parameters?: Partial<GenerationResult['parameters']>
): Omit<GenerationResult, 'id' | 'createdAt'> {
  return {
    type,
    model,
    prompt,
    images,
    referenceImages,
    parameters: {
      size: parameters?.size || '2K',
      outputFormat: parameters?.outputFormat || 'png',
      watermark: parameters?.watermark || false,
    },
  }
}

/**
 * 历史记录统计信息
 */
export function getHistoryStats(history: GenerationResult[]) {
  return {
    total: history.length,
    byType: {
      'text-to-image': history.filter((h) => h.type === 'text-to-image').length,
      'image-to-image': history.filter((h) => h.type === 'image-to-image').length,
      series: history.filter((h) => h.type === 'series').length,
    },
    byModel: history.reduce((acc, h) => {
      acc[h.model] = (acc[h.model] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    totalImages: history.reduce((acc, h) => acc + h.images.length, 0),
  }
}
