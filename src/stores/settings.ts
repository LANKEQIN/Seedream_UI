/**
 * 设置状态管理
 * 用于存储和管理 API Key 等用户设置
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsState {
  // API Key
  apiKey: string
  // 是否使用本地存储的 Key
  useLocalApiKey: boolean
  // 设置 API Key
  setApiKey: (key: string) => void
  // 清除 API Key
  clearApiKey: () => void
  // 切换使用本地 Key
  toggleUseLocalApiKey: () => void
}

const STORAGE_KEY = "seeddream-settings"

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: "",
      useLocalApiKey: false,
      setApiKey: (key: string) => set({ apiKey: key, useLocalApiKey: true }),
      clearApiKey: () => set({ apiKey: "", useLocalApiKey: false }),
      toggleUseLocalApiKey: () =>
        set((state) => ({ useLocalApiKey: !state.useLocalApiKey })),
    }),
    {
      name: STORAGE_KEY,
    }
  )
)

/**
 * 获取当前有效的 API Key
 * 优先使用本地存储的 Key，如果没有则使用环境变量
 */
export function getEffectiveApiKey(): string | undefined {
  const state = useSettingsStore.getState()
  if (state.useLocalApiKey && state.apiKey) {
    return state.apiKey
  }
  return import.meta.env.VITE_ARK_API_KEY
}

/**
 * 检查是否有有效的 API Key
 */
export function hasValidApiKey(): boolean {
  return !!getEffectiveApiKey()
}
