/**
 * 图片结果展示组件 - 仿官方体验中心排版
 * 上方显示提示词和参数信息，中间是图片网格展示
 * 加载状态：根据生成数量显示对应数量的骨架屏动效
 */

import { Download, RefreshCw, ImageIcon, Sparkles, Clock, Maximize2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { GeneratedImage, GenerationTask, ImageSizeConfig, GenerationParams } from "@/types"
import { useState } from "react"

interface ImageResultProps {
  task: GenerationTask | null
  onRegenerate?: () => void
}

/**
 * 格式化尺寸显示
 */
function formatSize(sizeConfig: ImageSizeConfig): string {
  if (sizeConfig.preset === "custom" && sizeConfig.width && sizeConfig.height) {
    return `${sizeConfig.width}×${sizeConfig.height}`
  }
  const presetMap: Record<string, string> = {
    "1:1": "1:1",
    "4:3": "4:3",
    "3:4": "3:4",
    "16:9": "16:9",
    "9:16": "9:16",
    "custom": "自定义",
  }
  return presetMap[sizeConfig.preset] || sizeConfig.preset
}

/**
 * 格式化模型名称显示
 */
function formatModelName(model: string): string {
  const modelMap: Record<string, string> = {
    "doubao-seedream-5-0-lite-260128": "Seedream 5.0-lite",
    "doubao-seedream-4-5-251128": "Seedream 4.5",
  }
  return modelMap[model] || model
}

/**
 * 获取网格列数类名
 */
function getGridColsClass(count: number): string {
  if (count === 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  if (count <= 4) return "grid-cols-2"
  return "grid-cols-2 md:grid-cols-3"
}

/**
 * 获取图片宽高比类名
 */
function getAspectRatioClass(params: GenerationParams): string {
  const { aspectRatio } = params.sizeConfig
  if (aspectRatio === "9:16" || aspectRatio === "3:4" || aspectRatio === "2:3") {
    return "aspect-[3/4]"
  }
  if (aspectRatio === "16:9" || aspectRatio === "21:9") {
    return "aspect-video"
  }
  if (aspectRatio === "4:3") {
    return "aspect-[4/3]"
  }
  return "aspect-square"
}

export function ImageResult({ task, onRegenerate }: ImageResultProps) {
  const [copied, setCopied] = useState(false)

  // 空状态
  if (!task) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 py-12">
          {/* 装饰性图标 */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">
              准备就绪
            </p>
            <p className="text-sm text-slate-400 max-w-[280px] mx-auto">
              输入提示词并点击生成按钮，AI 将为你创作精美图片
            </p>
          </div>
        </div>
      </div>
    )
  }

  const params = task.params
  const generationCount = params.generationCount || 1

  // 加载状态 - 仿官方体验中心：显示多张骨架屏
  if (task.status === "loading") {
    return (
      <div className="space-y-4">
        {/* 顶部信息栏 */}
        <div className="space-y-3">
          {/* 第一行：时间 */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {new Date(task.createdAt).toLocaleString("zh-CN", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* 第二行：提示词 */}
          <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {params.prompt}
          </h3>

          {/* 第三行：参数标签 */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {formatSize(params.sizeConfig)}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {generationCount}张
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Sparkles className="h-3 w-3 mr-1 text-indigo-500" />
              {formatModelName(params.model)}
            </Badge>
            {params.image && (Array.isArray(params.image) ? params.image.length > 0 : true) && (
              <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <ImageIcon className="h-3 w-3 mr-1" />
                参考图
              </Badge>
            )}
          </div>
        </div>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        {/* 骨架屏网格 - 根据生成数量显示对应数量的占位符 */}
        <SkeletonGrid count={generationCount} aspectRatioClass={getAspectRatioClass(params)} />
      </div>
    )
  }

  // 错误状态
  if (task.status === "error") {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-4 py-12">
          <div className="w-16 h-16 mx-auto rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <p className="text-base font-medium text-red-600">生成失败</p>
            <p className="text-sm text-slate-400 max-w-[300px] mx-auto">
              {task.error || "未知错误，请稍后重试"}
            </p>
          </div>

          {onRegenerate && (
            <Button
              variant="outline"
              onClick={onRegenerate}
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重新生成
            </Button>
          )}
        </div>
      </div>
    )
  }

  // 成功状态 - 仿官方体验中心排版
  if (task.status === "success" && task.result) {
    const images = task.result.data

    // 复制提示词
    const handleCopyPrompt = () => {
      navigator.clipboard.writeText(params.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="space-y-4">
        {/* 顶部信息栏 - 仿官方风格 */}
        <div className="space-y-3">
          {/* 第一行：时间和操作 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {task.completedAt
                  ? new Date(task.completedAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : new Date(task.createdAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="h-7 px-2 text-xs text-slate-500 hover:text-indigo-600"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  重新生成
                </Button>
              )}
            </div>
          </div>

          {/* 第二行：提示词 */}
          <div className="group relative">
            <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed pr-8">
              {params.prompt}
            </h3>
            <button
              onClick={handleCopyPrompt}
              className="absolute right-0 top-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="复制提示词"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>

          {/* 第三行：参数标签 */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200">
              {formatSize(params.sizeConfig)}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200">
              {images.length}张
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200">
              <Sparkles className="h-3 w-3 mr-1 text-indigo-500" />
              {formatModelName(params.model)}
            </Badge>
            {params.image && (Array.isArray(params.image) ? params.image.length > 0 : true) && (
              <Badge variant="secondary" className="text-xs font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200">
                <ImageIcon className="h-3 w-3 mr-1" />
                参考图
              </Badge>
            )}
          </div>
        </div>

        <Separator className="bg-slate-100 dark:bg-slate-800" />

        {/* 图片网格 - 仿官方风格 */}
        <ImageGrid images={images} params={params} />
      </div>
    )
  }

  return null
}

/**
 * 骨架屏网格组件 - 仿官方体验中心加载动效
 * 显示多个带流光效果的占位卡片
 */
function SkeletonGrid({ count, aspectRatioClass }: { count: number; aspectRatioClass: string }) {
  const gridClass = getGridColsClass(count)

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} index={index} aspectRatioClass={aspectRatioClass} />
      ))}
    </div>
  )
}

/**
 * 单个骨架屏卡片 - 带流光渐变动效
 */
function SkeletonCard({ index, aspectRatioClass }: { index: number; aspectRatioClass: string }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800
        ${aspectRatioClass}
      `}
    >
      {/* 流光渐变动效 */}
      <div className="absolute inset-0 skeleton-shimmer" />

      {/* 中央加载指示器 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* 外圈脉冲 */}
          <div className="absolute inset-0 w-10 h-10 -m-1 rounded-full bg-indigo-500/20 animate-ping" />
          {/* 内圈旋转 */}
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>

      {/* 序号标记 */}
      {index > 0 && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/30 text-white text-xs">
          {index + 1}
        </div>
      )}
    </div>
  )
}

/**
 * 图片网格组件 - 仿官方体验中心
 * 根据图片数量自动调整布局
 */
function ImageGrid({ images, params }: { images: GeneratedImage[]; params: GenerationParams }) {
  const gridClass = getGridColsClass(images.length)
  const aspectRatioClass = getAspectRatioClass(params)

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {images.map((image, index) => (
        <ImageItem
          key={index}
          image={image}
          index={index}
          total={images.length}
          aspectRatioClass={aspectRatioClass}
        />
      ))}
    </div>
  )
}

/**
 * 单张图片组件
 */
function ImageItem({
  image,
  index,
  total,
  aspectRatioClass,
}: {
  image: GeneratedImage
  index: number
  total: number
  aspectRatioClass: string
}) {
  const imageUrl = image.url || image.b64_json
  const [isLoaded, setIsLoaded] = useState(false)

  if (!imageUrl) return null

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl!
    link.download = `seedream-${Date.now()}-${index + 1}.png`
    link.click()
  }

  const handleOpen = () => {
    window.open(imageUrl, "_blank")
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800
        group cursor-pointer
        ${aspectRatioClass}
      `}
      onClick={handleOpen}
    >
      {/* 图片 */}
      <img
        src={imageUrl}
        alt={`生成图片 ${index + 1}`}
        className={`
          w-full h-full object-cover
          transition-all duration-500
          group-hover:scale-105
          ${isLoaded ? "opacity-100" : "opacity-0"}
        `}
        onLoad={() => setIsLoaded(true)}
      />

      {/* 加载占位 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      )}

      {/* 悬浮遮罩 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

      {/* 悬浮操作按钮 */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
          className="h-8 px-3 bg-white/90 hover:bg-white text-slate-700"
        >
          <Download className="h-4 w-4 mr-1" />
          下载
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleOpen()
          }}
          className="h-8 px-3 bg-white/90 hover:bg-white text-slate-700"
        >
          <Maximize2 className="h-4 w-4 mr-1" />
          查看
        </Button>
      </div>

      {/* 图片序号 */}
      {total > 1 && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs">
          {index + 1}
        </div>
      )}

      {/* 优化提示词（如果有） */}
      {image.revised_prompt && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs text-white/90 line-clamp-2">
            {image.revised_prompt}
          </p>
        </div>
      )}
    </div>
  )
}
