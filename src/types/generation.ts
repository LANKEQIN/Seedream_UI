export type ModelId = 'doubao-seedream-5-0-lite-260128' | 'doubao-seedream-4-5-251128' | 'doubao-seedream-4-0-250828'

export type GenerationType = 'text-to-image' | 'image-to-image' | 'series'

export type OutputFormat = 'png' | 'jpeg'

export type Resolution = '1K' | '2K' | '3K' | '4K'

export interface GenerationParams {
  model: ModelId
  prompt: string
  size: Resolution
  outputFormat: OutputFormat
  watermark: boolean
  webSearch?: boolean
}

export interface GeneratedImage {
  url: string
  width: number
  height: number
  format: OutputFormat
}

export interface GenerationResult {
  id: string
  type: GenerationType
  model: ModelId
  prompt: string
  images: GeneratedImage[]
  referenceImages?: string[]
  createdAt: Date
  parameters: Omit<GenerationParams, 'prompt' | 'model'>
}

export interface Settings {
  apiKey: string
  defaultModel: ModelId
  defaultSize: Resolution
  defaultFormat: OutputFormat
  watermark: boolean
  theme: 'light' | 'dark' | 'system'
}