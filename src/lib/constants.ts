export const MODEL_CONFIG = {
  'doubao-seedream-5-0-lite-260128': {
    name: 'Seedream 5.0-lite',
    supports: ['text-to-image', 'image-to-image', 'series', '联网搜索'] as const,
    sizes: ['2K', '3K'] as const,
  },
  'doubao-seedream-4-5-251128': {
    name: 'Seedream 4.5',
    supports: ['text-to-image', 'image-to-image', 'series'] as const,
    sizes: ['2K', '4K'] as const,
  },
} as const

export const API_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3'

// 支持的图片格式（5.0-lite/4.5/4.0 支持 jpeg/png/webp/bmp/tiff/gif）
export const IMAGE_FILE_EXTENSIONS = ['png', 'jpeg', 'jpg', 'webp', 'bmp', 'tiff', 'gif']

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB