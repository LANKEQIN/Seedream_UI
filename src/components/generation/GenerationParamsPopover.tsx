/**
 * 生成参数选择弹窗
 * 整合分辨率、比例、生成数量、格式选择
 * 放在对话框区域，方便用户快速调整
 * 使用 Portal 渲染，避免被父容器 overflow 裁剪
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import {
  Settings2,
  ChevronDown,
  Monitor,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Sparkles,
  FileImage,
  Check,
  X,
  Edit3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ImageSizeConfig, Resolution, AspectRatio, ImageFormat, ModelId, SequentialImageGeneration } from "@/types"
import {
  RESOLUTION_DIMENSIONS,
  ASPECT_RATIO_OPTIONS,
  getModelSupportedSizes,
  getSupportedFormats,
  GENERATION_COUNT_OPTIONS,
  validateImageSize,
  getSuggestedValidSize,
  SIZE_VALIDATION,
} from "@/services/api"
import type { SizeValidationResult } from "@/services/api"

// 比例图标映射
const ratioIconMap: Record<string, React.ReactNode> = {
  smart: <Sparkles className="h-3.5 w-3.5" />,
  square: <Square className="h-3.5 w-3.5" />,
  portrait: <RectangleVertical className="h-3.5 w-3.5" />,
  landscape: <RectangleHorizontal className="h-3.5 w-3.5" />,
  wide: <Monitor className="h-3.5 w-3.5" />,
  tall: <RectangleVertical className="h-3.5 w-3.5 rotate-180" />,
  ultrawide: <Monitor className="h-3.5 w-3.5" />,
}

interface GenerationParamsPopoverProps {
  sizeConfig: ImageSizeConfig
  onSizeConfigChange: (config: ImageSizeConfig) => void
  generationCount: number
  onGenerationCountChange: (count: number) => void
  outputFormat: ImageFormat
  onOutputFormatChange: (format: ImageFormat) => void
  modelId: ModelId
  disabled?: boolean
  // 组图生成模式
  sequentialImageGeneration: SequentialImageGeneration
  onSequentialImageGenerationChange: (mode: SequentialImageGeneration) => void
  // 联网搜索
  webSearch: boolean
  onWebSearchChange: (enabled: boolean) => void
}

export function GenerationParamsPopover({
  sizeConfig,
  onSizeConfigChange,
  generationCount,
  onGenerationCountChange,
  outputFormat,
  onOutputFormatChange,
  modelId,
  disabled = false,
  sequentialImageGeneration,
  onSequentialImageGenerationChange,
  webSearch,
  onWebSearchChange,
}: GenerationParamsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // 下拉菜单的 ref，用于检测点击是否在菜单内
  const dropdownRef = useRef<HTMLDivElement>(null)
  // 是否显示自定义尺寸输入
  const [showCustomSize, setShowCustomSize] = useState(false)

  // 获取当前模型支持的分辨率
  const supportedSizes = getModelSupportedSizes(modelId)
  const supportedFormats = getSupportedFormats(modelId)

  // 验证自定义尺寸（使用 useMemo 避免级联渲染）
  const validation = useMemo<SizeValidationResult>(() => {
    if (sizeConfig.customWidth && sizeConfig.customHeight) {
      return validateImageSize(sizeConfig.customWidth, sizeConfig.customHeight)
    }
    return { isValid: true }
  }, [sizeConfig.customWidth, sizeConfig.customHeight])

  // 计算下拉菜单位置
  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
      })
    }
  }, [])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 检查点击是否在触发按钮或下拉菜单内
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    // 使用防抖优化滚动和resize事件
    let scrollTimeout: number | null = null
    const handleScroll = () => {
      if (isOpen) {
        if (scrollTimeout) clearTimeout(scrollTimeout)
        scrollTimeout = window.setTimeout(updatePosition, 16) // 约60fps
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleScroll)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [isOpen, updatePosition])

  // 打开时更新位置
  useEffect(() => {
    if (isOpen) {
      updatePosition()
    }
  }, [isOpen, updatePosition])

  // 处理分辨率变化
  const handleResolutionChange = (resolution: Resolution) => {
    onSizeConfigChange({
      ...sizeConfig,
      resolution,
      customWidth: undefined,
      customHeight: undefined,
    })
    setShowCustomSize(false)
  }

  // 处理比例变化
  const handleAspectRatioChange = (aspectRatio: AspectRatio) => {
    onSizeConfigChange({
      ...sizeConfig,
      aspectRatio,
      customWidth: undefined,
      customHeight: undefined,
    })
    setShowCustomSize(false)
  }

  // 处理自定义宽度变化
  const handleCustomWidthChange = (width: string) => {
    const numWidth = parseInt(width, 10) || 0
    onSizeConfigChange({
      ...sizeConfig,
      customWidth: numWidth > 0 ? numWidth : undefined,
    })
  }

  // 处理自定义高度变化
  const handleCustomHeightChange = (height: string) => {
    const numHeight = parseInt(height, 10) || 0
    onSizeConfigChange({
      ...sizeConfig,
      customHeight: numHeight > 0 ? numHeight : undefined,
    })
  }

  // 获取当前尺寸显示文本
  const getSizeDisplayText = () => {
    if (sizeConfig.customWidth && sizeConfig.customHeight) {
      return `${sizeConfig.customWidth}x${sizeConfig.customHeight}`
    }
    if (sizeConfig.aspectRatio === "auto") {
      return `${sizeConfig.resolution} 智能比例`
    }
    const dims = RESOLUTION_DIMENSIONS[sizeConfig.resolution]?.[sizeConfig.aspectRatio]
    if (dims) {
      return `${sizeConfig.resolution} ${dims.width}x${dims.height}`
    }
    return sizeConfig.resolution
  }

  const handleToggle = () => {
    if (disabled) return
    if (!isOpen) {
      updatePosition()
    }
    setIsOpen(!isOpen)
  }

  // 下拉菜单内容
  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="fixed w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-4 z-[9999] animate-fade-in max-h-[70vh] overflow-y-auto"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
      }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          生成设置
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 分辨率选择 */}
      <div className="space-y-2 mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">分辨率</span>
        <div className="grid grid-cols-3 gap-2">
          {supportedSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleResolutionChange(size)}
              className={cn(
                "px-2 py-1.5 text-xs rounded-md border transition-all",
                sizeConfig.resolution === size
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 比例选择 */}
      <div className="space-y-2 mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">图片比例</span>
        <div className="grid grid-cols-4 gap-1.5">
          {ASPECT_RATIO_OPTIONS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => handleAspectRatioChange(ratio.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all",
                sizeConfig.aspectRatio === ratio.value && !showCustomSize
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <span className={sizeConfig.aspectRatio === ratio.value && !showCustomSize ? "text-indigo-500" : "text-slate-400"}>
                {ratioIconMap[ratio.icon]}
              </span>
              <span className="text-[10px]">{ratio.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 自定义尺寸 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">自定义尺寸</span>
          <button
            onClick={() => setShowCustomSize(!showCustomSize)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-[10px] rounded-md border transition-all",
              showCustomSize
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400"
            )}
          >
            <Edit3 className="h-3 w-3" />
            <span>{showCustomSize ? "已启用" : "点击启用"}</span>
          </button>
        </div>

        {/* 自定义尺寸输入 */}
        {showCustomSize && (
          <div className="space-y-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">宽度 (W)</span>
                <Input
                  type="number"
                  placeholder={`${SIZE_VALIDATION.MIN_DIMENSION}`}
                  value={sizeConfig.customWidth || ""}
                  onChange={(e) => handleCustomWidthChange(e.target.value)}
                  disabled={disabled}
                  className={cn(
                    "h-8 text-xs",
                    !validation.isValid && "border-red-500 focus-visible:ring-red-500"
                  )}
                  min={SIZE_VALIDATION.MIN_DIMENSION}
                  max={SIZE_VALIDATION.MAX_DIMENSION}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">高度 (H)</span>
                <Input
                  type="number"
                  placeholder={`${SIZE_VALIDATION.MIN_DIMENSION}`}
                  value={sizeConfig.customHeight || ""}
                  onChange={(e) => handleCustomHeightChange(e.target.value)}
                  disabled={disabled}
                  className={cn(
                    "h-8 text-xs",
                    !validation.isValid && "border-red-500 focus-visible:ring-red-500"
                  )}
                  min={SIZE_VALIDATION.MIN_DIMENSION}
                  max={SIZE_VALIDATION.MAX_DIMENSION}
                />
              </div>
            </div>

            {/* 验证结果提示 */}
            {sizeConfig.customWidth && sizeConfig.customHeight && (
              <div
                className={cn(
                  "flex items-start gap-1.5 p-1.5 rounded text-[10px]",
                  validation.isValid
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                )}
              >
                {validation.isValid ? (
                  <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  {validation.isValid ? (
                    <span>
                      有效 · {validation.totalPixels?.toLocaleString()}px
                      {validation.warning && (
                        <span className="text-amber-600 dark:text-amber-400 ml-1">
                          ({validation.warning})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>{validation.error}</span>
                  )}
                </div>
              </div>
            )}

            {/* 无效时显示建议按钮 */}
            {!validation.isValid && sizeConfig.customWidth && sizeConfig.customHeight && (
              <button
                type="button"
                onClick={() => {
                  const suggested = getSuggestedValidSize(sizeConfig.customWidth!, sizeConfig.customHeight!)
                  onSizeConfigChange({
                    ...sizeConfig,
                    customWidth: suggested.width,
                    customHeight: suggested.height,
                  })
                }}
                disabled={disabled}
                className="w-full text-[10px] px-2 py-1 rounded border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
              >
                应用建议: {validation.suggestedSize?.width}x{validation.suggestedSize?.height}
              </button>
            )}

            <p className="text-[10px] text-slate-400">
              总像素: {SIZE_VALIDATION.MIN_TOTAL_PIXELS.toLocaleString()}-{SIZE_VALIDATION.MAX_TOTAL_PIXELS.toLocaleString()} | 
              宽高比: 1:16-16:1
            </p>
          </div>
        )}
      </div>

      {/* 生成数量 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">生成数量</span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {generationCount} 张
          </span>
        </div>
        <Slider
          value={[generationCount]}
          onValueChange={(values) => {
            const newCount = values[0]
            onGenerationCountChange(newCount)
            // 仅当数量从1变为大于1且当前是单图模式时才自动切换
            if (generationCount === 1 && newCount > 1 && sequentialImageGeneration === "disabled") {
              onSequentialImageGenerationChange("auto")
            }
          }}
          min={GENERATION_COUNT_OPTIONS.min}
          max={GENERATION_COUNT_OPTIONS.max}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{GENERATION_COUNT_OPTIONS.min}张</span>
          <span>上限{GENERATION_COUNT_OPTIONS.max}张</span>
        </div>
        {generationCount > 1 && (
          <p className="text-[10px] text-amber-500">
            ⚠️ 多图输出将自动启用组图模式
          </p>
        )}
      </div>

      {/* 输出格式 */}
      <div className="space-y-2 mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">输出格式</span>
        <div className="grid grid-cols-2 gap-2">
          {supportedFormats.map((format) => (
            <button
              key={format.value}
              onClick={() => onOutputFormatChange(format.value as ImageFormat)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-all",
                outputFormat === format.value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <FileImage className="h-3.5 w-3.5" />
              <span>{format.label}</span>
              {outputFormat === format.value && (
                <Check className="h-3 w-3 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 组图生成模式 */}
      <div className="space-y-2 mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">生成模式</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSequentialImageGenerationChange("disabled")}
            className={cn(
              "flex flex-col items-start gap-1 px-3 py-2 text-xs rounded-lg border transition-all",
              sequentialImageGeneration === "disabled"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <FileImage className="h-3.5 w-3.5" />
              <span>单图模式</span>
              {sequentialImageGeneration === "disabled" && (
                <Check className="h-3 w-3 ml-auto" />
              )}
            </div>
            <span className="text-[10px] text-slate-400">仅生成1张图片</span>
          </button>
          <button
            onClick={() => onSequentialImageGenerationChange("auto")}
            className={cn(
              "flex flex-col items-start gap-1 px-3 py-2 text-xs rounded-lg border transition-all",
              sequentialImageGeneration === "auto"
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <Sparkles className="h-3.5 w-3.5" />
              <span>组图模式</span>
              {sequentialImageGeneration === "auto" && (
                <Check className="h-3 w-3 ml-auto" />
              )}
            </div>
            <span className="text-[10px] text-slate-400">生成多张关联图片</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-400">
          💡 多图输出需选择组图模式
        </p>
      </div>

      {/* 联网搜索（仅 5.0-lite 支持） */}
      {modelId === "doubao-seedream-5-0-lite-260128" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">联网搜索</span>
              <span className="text-[10px] text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded">
                5.0-lite
              </span>
            </div>
            <button
              onClick={() => onWebSearchChange(!webSearch)}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors duration-200",
                webSearch
                  ? "bg-indigo-500"
                  : "bg-slate-200 dark:bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                  webSearch && "translate-x-5"
                )}
              />
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            启用后可融合实时网络信息，提升生图时效性
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div ref={containerRef} className="relative">
      {/* 触发按钮 */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        disabled={disabled}
        className="flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
      >
        <Settings2 className="h-3 w-3" />
        <span>{getSizeDisplayText()}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 使用 Portal 渲染下拉菜单到 body */}
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  )
}
