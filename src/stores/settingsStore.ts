import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

export interface SettingsState {
  apiKey: string
  theme: Theme
  defaultModel: string
  defaultSize: string
  defaultFormat: 'png' | 'jpeg'
  watermark: boolean
  setApiKey: (key: string) => void
  setTheme: (theme: Theme) => void
  setDefaultModel: (model: string) => void
  setDefaultSize: (size: string) => void
  setDefaultFormat: (format: 'png' | 'jpeg') => void
  setWatermark: (watermark: boolean) => void
  hasApiKey: () => boolean
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      theme: 'system',
      defaultModel: 'doubao-seedream-5-0-lite-260128',
      defaultSize: '2K',
      defaultFormat: 'png',
      watermark: false,
      setApiKey: (key) => set({ apiKey: key }),
      setTheme: (theme) => set({ theme }),
      setDefaultModel: (model) => set({ defaultModel: model }),
      setDefaultSize: (size) => set({ defaultSize: size }),
      setDefaultFormat: (format) => set({ defaultFormat: format }),
      setWatermark: (watermark) => set({ watermark }),
      hasApiKey: () => !!get().apiKey,
    }),
    {
      name: 'seedream-settings',
    }
  )
)
