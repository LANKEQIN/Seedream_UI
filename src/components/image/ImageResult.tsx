/**
 * 图片结果展示组件
 * 精致的视觉设计，带有优雅的动画效果
 */

import { Download, RefreshCw, ExternalLink, ImageIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { GeneratedImage, GenerationTask } from "@/types"

interface ImageResultProps {
  task: GenerationTask | null
  onRegenerate?: () => void
}

export function ImageResult({ task, onRegenerate }: ImageResultProps) {
  if (!task) {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed border-2 bg-gradient-to-br from-slate-50/50 to-purple-50/50 dark:from-slate-900/50 dark:to-indigo-950/50">
        <CardContent className="text-center space-y-6 py-12">
          {/* 装饰性图标 */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center animate-float">
              <ImageIcon className="h-12 w-12 text-muted-foreground/60" />
            </div>
            {/* 装饰性光晕 */}
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl -z-10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <p className="text-lg font-medium text-foreground">
                准备就绪
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
              输入提示词并点击生成按钮，AI 将为你创作精美图片
            </p>
          </div>

          {/* 装饰性元素 */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (task.status === "loading") {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50/80 to-purple-50/80 dark:from-slate-900/80 dark:to-indigo-950/80 border-indigo-200/50 dark:border-indigo-800/50">
        <CardContent className="text-center space-y-8 py-12">
          {/* 精致的加载动画 */}
          <div className="relative">
            <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse shadow-lg shadow-indigo-500/30" />
            <div className="absolute inset-0 w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse-ring" />
            {/* 装饰性光环 */}
            <div className="absolute -inset-4 w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-indigo-500/10 to-pink-500/10 blur-2xl animate-breathe" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <p className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                正在创作中...
              </p>
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">
              AI 正在根据你的描述生成图片，请稍候
            </p>
          </div>

          {/* 进度指示器装饰 */}
          <div className="flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (task.status === "error") {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center border-destructive/50 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
        <CardContent className="text-center space-y-6 py-12">
          {/* 错误图标 */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <RefreshCw className="h-12 w-12 text-destructive" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-red-500/10 blur-xl -z-10" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-destructive">生成失败</p>
            <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">
              {task.error || "未知错误，请稍后重试"}
            </p>
          </div>

          {onRegenerate && (
            <Button
              variant="outline"
              onClick={onRegenerate}
              className="mt-4 border-destructive/50 hover:bg-destructive/10"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重新生成
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (task.status === "success" && task.result) {
    const images = task.result.data
    const gridCols = images.length === 1 ? 1 : images.length <= 4 ? 2 : 3

    return (
      <div className="space-y-5">
        {/* 标题栏 - 精致设计 */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100/50 dark:border-indigo-800/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">生成结果</h3>
              <p className="text-xs text-muted-foreground">
                共 {images.length} 张图片
              </p>
            </div>
          </div>
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="gap-2 border-indigo-200/50 dark:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
            >
              <RefreshCw className="h-4 w-4" />
              重新生成
            </Button>
          )}
        </div>

        {/* 图片网格 */}
        <div
          className={`grid gap-4 ${
            gridCols === 1
              ? "grid-cols-1"
              : gridCols === 2
              ? "grid-cols-2"
              : "grid-cols-2 md:grid-cols-3"
          }`}
        >
          {images.map((image, index) => (
            <ImageCard key={index} image={image} index={index} />
          ))}
        </div>
      </div>
    )
  }

  return null
}

/**
 * 单张图片卡片 - 优雅的悬浮效果
 */
function ImageCard({
  image,
  index,
}: {
  image: GeneratedImage
  index: number
}) {
  const imageUrl = image.url || image.b64_json

  if (!imageUrl) {
    return null
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl!
    link.download = `generated-image-${index + 1}.png`
    link.click()
  }

  const handleOpen = () => {
    window.open(imageUrl, "_blank")
  }

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
        <img
          src={imageUrl}
          alt={`生成的图片 ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* 悬浮操作栏 - 玻璃态效果 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 gap-2"
          >
            <Download className="h-4 w-4" />
            下载
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpen}
            className="shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            查看
          </Button>
        </div>

        {/* 图片索引标记 */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {index + 1}
        </div>
      </div>

      {/* 优化提示 */}
      {image.revised_prompt && (
        <CardContent className="p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {image.revised_prompt}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
