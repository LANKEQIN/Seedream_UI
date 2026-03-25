/**
 * 图片结果展示组件
 */

import { Download, RefreshCw, ExternalLink, ImageIcon } from "lucide-react"
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
      <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              图片将在这里显示
            </p>
            <p className="text-sm text-muted-foreground">
              输入提示词并点击生成按钮开始创作
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (task.status === "loading") {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center space-y-6">
          {/* 加载动画 */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse-ring" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">正在创作中...</p>
            <p className="text-sm text-muted-foreground">
              AI正在根据你的描述生成图片，请稍候
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (task.status === "error") {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center border-destructive">
        <CardContent className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <RefreshCw className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-destructive">生成失败</p>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              {task.error || "未知错误，请稍后重试"}
            </p>
          </div>
          {onRegenerate && (
            <Button variant="outline" onClick={onRegenerate}>
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
    // 根据图片数量决定网格列数
    const gridCols = images.length === 1 ? 1 : images.length <= 4 ? 2 : 3

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">生成结果</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              共 {images.length} 张
            </span>
          </div>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              重新生成
            </Button>
          )}
        </div>

        <div
          className={`grid gap-3 ${
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
 * 单张图片卡片
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
    <Card className="overflow-hidden group">
      <div className="relative aspect-square bg-muted">
        <img
          src={imageUrl}
          alt={`生成的图片 ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* 悬浮操作栏 */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            下载
          </Button>
          <Button variant="secondary" size="sm" onClick={handleOpen}>
            <ExternalLink className="mr-2 h-4 w-4" />
            查看
          </Button>
        </div>
      </div>
      {image.revised_prompt && (
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {image.revised_prompt}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
