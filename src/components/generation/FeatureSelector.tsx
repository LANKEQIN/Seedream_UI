/**
 * 功能选择器 - 创作类型下拉菜单
 * 支持切换：图片生成、视频生成
 * 集成模型选择：4.5 和 5.0-lite
 */

import { useState, useRef, useEffect } from "react"
import {
  ImageIcon,
  Video,
  ChevronDown,
  Check,
  Zap,
  Star,
} from "lucide-react"

export type FeatureType = "image" | "video"
export type ModelId = "doubao-seedream-5-0-lite-260128" | "doubao-seedream-4-5-251128"

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
  {
    id: "video",
    label: "视频生成",
    icon: Video,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50",
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
  const containerRef = useRef<HTMLDivElement>(null)

  const currentFeature = FEATURE_OPTIONS.find((f) => f.id === feature) || FEATURE_OPTIONS[0]
  const currentModel = MODEL_OPTIONS.find((m) => m.id === model) || MODEL_OPTIONS[0]
  const CurrentFeatureIcon = currentFeature.icon
  const CurrentModelIcon = currentModel.icon

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFeatureSelect = (featureId: FeatureType) => {
    onFeatureChange(featureId)
  }

  const handleModelSelect = (modelId: ModelId) => {
    onModelChange(modelId)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 py-2 z-50 animate-fade-in">
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
      )}
    </div>
  )
}
