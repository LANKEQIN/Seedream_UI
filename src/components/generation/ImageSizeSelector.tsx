/**
 * 图片尺寸选择组件
 * 支持分辨率选择、比例选择、自定义尺寸
 * 参考文档: https://www.volcengine.com/docs/82379/1541523
 */

import { useState, useCallback, useMemo } from "react"
import { Monitor, Square, RectangleHorizontal, RectangleVertical, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ImageSizeConfig, Resolution, AspectRatio, ModelId } from "@/types"
import {
  RESOLUTION_DIMENSIONS,
  ASPECT_RATIO_OPTIONS,
  getModelSupportedSizes,
} from "@/services/api"

interface ImageSizeSelectorProps {
  value: ImageSizeConfig
  onChange: (value: ImageSizeConfig) => void
  modelId: ModelId
  disabled?: boolean
}

// 比例图标映射
const ratioIconMap: Record<string, React.ReactNode> = {
  smart: <Sparkles className="h-4 w-4" />,
  square: <Square className="h-4 w-4" />,
  portrait: <RectangleVertical className="h-4 w-4" />,
  landscape: <RectangleHorizontal className="h-4 w-4" />,
  wide: <Monitor className="h-4 w-4" />,
  tall: <RectangleVertical className="h-4 w-4 rotate-180" />,
  ultrawide: <Monitor className="h-4 w-4" />,
}

export function ImageSizeSelector({
  value,
  onChange,
  modelId,
  disabled = false,
}: ImageSizeSelectorProps) {
  const [showCustom, setShowCustom] = useState(false)

  // 获取当前模型支持的分辨率
  const supportedSizes = useMemo(() => getModelSupportedSizes(modelId), [modelId])

  // 处理分辨率变化
  const handleResolutionChange = useCallback(
    (resolution: Resolution) => {
      onChange({
        ...value,
        resolution,
        customWidth: undefined,
        customHeight: undefined,
      })
      setShowCustom(false)
    },
    [value, onChange]
  )

  // 处理比例变化
  const handleAspectRatioChange = useCallback(
    (aspectRatio: AspectRatio) => {
      onChange({
        ...value,
        aspectRatio,
        customWidth: undefined,
        customHeight: undefined,
      })
      setShowCustom(false)
    },
    [value, onChange]
  )

  // 处理自定义宽度变化
  const handleWidthChange = useCallback(
    (width: string) => {
      const numWidth = parseInt(width, 10) || 0
      onChange({
        ...value,
        customWidth: numWidth > 0 ? numWidth : undefined,
      })
    },
    [value, onChange]
  )

  // 处理自定义高度变化
  const handleHeightChange = useCallback(
    (height: string) => {
      const numHeight = parseInt(height, 10) || 0
      onChange({
        ...value,
        customHeight: numHeight > 0 ? numHeight : undefined,
      })
    },
    [value, onChange]
  )

  // 获取当前尺寸显示文本
  const sizeDisplayText = useMemo(() => {
    if (value.customWidth && value.customHeight) {
      return `${value.customWidth}x${value.customHeight}`
    }
    if (value.aspectRatio === "auto") {
      return `${value.resolution} 智能比例`
    }
    const dims = RESOLUTION_DIMENSIONS[value.resolution]?.[value.aspectRatio]
    if (dims) {
      return `${value.resolution} ${dims.width}x${dims.height}`
    }
    return value.resolution
  }, [value])

  return (
    <div className="space-y-4">
      {/* 当前选择显示 */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">图片尺寸</Label>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {sizeDisplayText}
        </span>
      </div>

      {/* 分辨率选择 */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">分辨率</Label>
        <div className="grid grid-cols-3 gap-2">
          {supportedSizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={value.resolution === size ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-xs h-9",
                value.resolution === size && "ring-2 ring-primary ring-offset-1"
              )}
              onClick={() => handleResolutionChange(size)}
              disabled={disabled}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* 比例选择 */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">图片比例</Label>
        <div className="grid grid-cols-5 gap-1.5">
          {ASPECT_RATIO_OPTIONS.map((ratio) => (
            <button
              key={ratio.value}
              type="button"
              onClick={() => handleAspectRatioChange(ratio.value)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all",
                "hover:bg-accent hover:border-accent",
                value.aspectRatio === ratio.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-background text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="text-primary">
                {ratioIconMap[ratio.icon]}
              </span>
              <span className="text-[10px] font-medium">{ratio.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 自定义尺寸切换 */}
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">自定义尺寸</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setShowCustom(!showCustom)}
          disabled={disabled}
        >
          {showCustom ? "收起" : "展开"}
        </Button>
      </div>

      {/* 自定义尺寸输入 */}
      {showCustom && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">宽度 (W)</Label>
              <Input
                type="number"
                placeholder="2048"
                value={value.customWidth || ""}
                onChange={(e) => handleWidthChange(e.target.value)}
                disabled={disabled}
                className="h-9"
                min={64}
                max={8192}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">高度 (H)</Label>
              <Input
                type="number"
                placeholder="2048"
                value={value.customHeight || ""}
                onChange={(e) => handleHeightChange(e.target.value)}
                disabled={disabled}
                className="h-9"
                min={64}
                max={8192}
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            总像素范围: 3,686,400 - 16,777,216 | 宽高比范围: 1/16 - 16
          </p>
        </div>
      )}
    </div>
  )
}
