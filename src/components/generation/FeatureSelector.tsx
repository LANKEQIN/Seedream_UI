/**
 * 功能选择器 - 创作类型下拉菜单
 * 支持：图片生成
 * 集成模型选择：4.5 和 5.0-lite
 * 使用 Portal 渲染下拉菜单，避免被父容器 overflow 裁剪
 */

import { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import {
  ImageIcon,
  ChevronDown,
  Check,
  Zap,
  Star,
} from "lucide-react"
import type { ModelId } from "@/types"

export type FeatureType = "image"

interface FeatureOption {
  id: FeatureType
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}

interface ModelOption {
  id: ModelId
  label: string
  desc: string
  icon: React.ElementType
  iconColor: string
}

const FEATURE_OPTIONS: FeatureOption[] = [
  {
    id: "image",
    label: "图片生成",
    icon: ImageIcon,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50",
  },
]

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "doubao-seedream-5-0-lite-260128",
    label: "5.0-lite",
    desc: "速度快，适合日常使用",
    icon: Zap,
    iconColor: "text-yellow-500",
  },
  {
    id: "doubao-seedream-4-5-251128",
    label: "4.5",
    desc: "质量高，细节更丰富",
    icon: Star,
    iconColor: "text-blue-500",
  },
]

interface FeatureSelectorProps {
  feature: FeatureType
  model: ModelId
  onFeatureChange: (feature: FeatureType) => void
  onModelChange: (model: ModelId) => void
}

export function FeatureSelector({
  feature,
  model,
  onFeatureChange,
  onModelChange,
}: FeatureSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // 下拉菜单的 ref，用于检测点击是否在菜单内
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentFeature = FEATURE_OPTIONS.find((f) => f.id === feature) || FEATURE_OPTIONS[0]
  const currentModel = MODEL_OPTIONS.find((m) => m.id === model) || MODEL_OPTIONS[0]
  const CurrentFeatureIcon = currentFeature.icon
  const CurrentModelIcon = currentModel.icon

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

  const handleFeatureSelect = (featureId: FeatureType) => {
    onFeatureChange(featureId)
    setIsOpen(false)
  }

  const handleModelSelect = (modelId: ModelId) => {
    onModelChange(modelId)
    setIsOpen(false)
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
      className="fixed w-56 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 py-2 z-[9999] animate-fade-in"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
      }}
    >
      {/* 创作类型标题 */}
      <div className="px-3 py-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
        创作类型
      </div>

      {/* 功能选项 */}
      {FEATURE_OPTIONS.map((featureOpt) => {
        const Icon = featureOpt.icon
        const isActive = feature === featureOpt.id
        return (
          <button
            key={featureOpt.id}
            onClick={() => handleFeatureSelect(featureOpt.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-200 ${
              isActive
                ? "bg-slate-50 dark:bg-slate-700/50"
                : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
            }`}
          >
            <Icon className={`h-4 w-4 ${featureOpt.color}`} />
            <span
              className={`text-sm flex-1 ${
                isActive
                  ? "text-slate-900 dark:text-slate-100 font-medium"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {featureOpt.label}
            </span>
            {isActive && <Check className="h-3.5 w-3.5 text-indigo-500" />}
          </button>
        )
      })}

      {/* 分隔线 */}
      <div className="my-2 border-t border-slate-100 dark:border-slate-700" />

      {/* 模型选择标题 */}
      <div className="px-3 py-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
        选择模型
      </div>

      {/* 模型选项 */}
      {MODEL_OPTIONS.map((modelOpt) => {
        const Icon = modelOpt.icon
        const isActive = model === modelOpt.id
        return (
          <button
            key={modelOpt.id}
            onClick={() => handleModelSelect(modelOpt.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-200 ${
              isActive
                ? "bg-slate-50 dark:bg-slate-700/50"
                : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
            }`}
          >
            <Icon className={`h-4 w-4 ${modelOpt.iconColor}`} />
            <div className="flex-1">
              <div
                className={`text-sm ${
                  isActive
                    ? "text-slate-900 dark:text-slate-100 font-medium"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {modelOpt.label}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {modelOpt.desc}
              </div>
            </div>
            {isActive && <Check className="h-3.5 w-3.5 text-indigo-500" />}
          </button>
        )
      })}
    </div>
  )

  return (
    <div ref={containerRef} className="relative">
      {/* 触发按钮 */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`flex items-center gap-2 h-8 px-3 text-xs rounded-full transition-all duration-200 ${currentFeature.bgColor}`}
      >
        <CurrentFeatureIcon className={`h-3.5 w-3.5 ${currentFeature.color}`} />
        <span className={currentFeature.color}>{currentFeature.label}</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <CurrentModelIcon className={`h-3.5 w-3.5 ${currentModel.iconColor}`} />
        <span className="text-slate-600 dark:text-slate-400">{currentModel.label}</span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 使用 Portal 渲染下拉菜单到 body */}
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  )
}
