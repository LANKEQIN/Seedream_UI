/**
 * 生成参数选择弹窗
 * 整合分辨率、比例、生成数量、格式选择
 * 放在对话框区域，方便用户快速调整
 * 使用 Portal 渲染，避免被父容器 overflow 裁剪
 */

import { useState, useRef, useEffect, useCallback } from "react"
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
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ImageSizeConfig, Resolution, AspectRatio, ImageFormat, ModelId } from "@/types"
import {
  RESOLUTION_DIMENSIONS,
  ASPECT_RATIO_OPTIONS,
  getModelSupportedSizes,
  getSupportedFormats,
  GENERATION_COUNT_OPTIONS,
} from "@/services/api"

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

    const handleScroll = () => {
      if (isOpen) {
        updatePosition()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleScroll)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleScroll)
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
          <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">宽度 (W)</span>
              <Input
                type="number"
                placeholder="2048"
                value={sizeConfig.customWidth || ""}
                onChange={(e) => handleCustomWidthChange(e.target.value)}
                disabled={disabled}
                className="h-8 text-xs"
                min={64}
                max={8192}
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">高度 (H)</span>
              <Input
                type="number"
                placeholder="2048"
                value={sizeConfig.customHeight || ""}
                onChange={(e) => handleCustomHeightChange(e.target.value)}
                disabled={disabled}
                className="h-8 text-xs"
                min={64}
                max={8192}
              />
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-slate-400">
                总像素范围: 3,686,400 - 16,777,216 | 宽高比: 1/16 - 16
              </p>
            </div>
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
          onValueChange={(values) => onGenerationCountChange(values[0])}
          min={GENERATION_COUNT_OPTIONS.min}
          max={GENERATION_COUNT_OPTIONS.max}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{GENERATION_COUNT_OPTIONS.min}张</span>
          <span>上限{GENERATION_COUNT_OPTIONS.max}张</span>
        </div>
      </div>

      {/* 输出格式 */}
      <div className="space-y-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">输出格式</span>
        <div className="grid grid-cols-2 gap-2">
          {supportedFormats.map((format) => (
            <button
              key={format.value}
              onClick={() => onOutputFormatChange(format.value)}
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
