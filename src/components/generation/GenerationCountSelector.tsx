/**
 * 生成数量选择组件
 * 支持滑动条选择生成图片数量（1-15张）
 * 参考文档: https://www.volcengine.com/docs/82379/1541523
 * 注意：参考图数量 + 生成数量 ≤ 15张
 */

import { useCallback, useMemo, useState } from "react"
import { Images, Info } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { GENERATION_COUNT_OPTIONS } from "@/services/api"

interface GenerationCountSelectorProps {
  value: number
  onChange: (value: number) => void
  referenceImageCount?: number
  disabled?: boolean
}

export function GenerationCountSelector({
  value,
  onChange,
  referenceImageCount = 0,
  disabled = false,
}: GenerationCountSelectorProps) {
  const [showHint, setShowHint] = useState(false)

  // 计算最大可用数量（参考图数量 + 生成数量 ≤ 15）
  const maxCount = useMemo(() => {
    return Math.max(
      1,
      GENERATION_COUNT_OPTIONS.max - referenceImageCount
    )
  }, [referenceImageCount])

  // 确保当前值不超过最大值
  const effectiveValue = Math.min(value, maxCount)

  // 处理滑动条变化
  const handleSliderChange = useCallback(
    (values: number[]) => {
      const newValue = values[0]
      onChange(newValue)
    },
    [onChange]
  )

  // 处理数字输入变化
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue)) {
        const clampedValue = Math.max(1, Math.min(newValue, maxCount))
        onChange(clampedValue)
      }
    },
    [onChange, maxCount]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">生成张数</Label>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={disabled}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold tabular-nums w-6 text-center">
            {effectiveValue}
          </span>
          <span className="text-xs text-muted-foreground">张</span>
        </div>
      </div>

      {/* 提示信息 */}
      {showHint && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
          <p>参考图数量 + 生成数量 ≤ 15张</p>
          {referenceImageCount > 0 && (
            <p className="mt-1">
              已上传 {referenceImageCount} 张参考图，最多可生成 {maxCount} 张
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Slider
          value={[effectiveValue]}
          onValueChange={handleSliderChange}
          min={GENERATION_COUNT_OPTIONS.min}
          max={maxCount}
          step={GENERATION_COUNT_OPTIONS.step}
          disabled={disabled}
          className="flex-1"
        />
        <input
          type="number"
          min={GENERATION_COUNT_OPTIONS.min}
          max={maxCount}
          value={effectiveValue}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-14 h-9 px-2 text-center text-sm border rounded-md bg-background
                     focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{GENERATION_COUNT_OPTIONS.min}张</span>
        <span>最多 {maxCount} 张</span>
      </div>
    </div>
  )
}
