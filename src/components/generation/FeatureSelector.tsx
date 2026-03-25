/**
 * 功能选择器 - Agent模式下拉菜单
 * 支持切换：Agent模式、图片生成、视频生成
 */

import { useState, useRef, useEffect } from "react"
import {
  Zap,
  ImageIcon,
  Video,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type FeatureType = "agent" | "image" | "video"

interface FeatureOption {
  id: FeatureType
  label: string
  desc: string
  icon: React.ElementType
  color: string
}

const FEATURE_OPTIONS: FeatureOption[] = [
  {
    id: "agent",
    label: "Agent 模式",
    desc: "智能创作助手",
    icon: Zap,
    color: "text-indigo-600",
  },
  {
    id: "image",
    label: "图片生成",
    desc: "Seedream 2.0",
    icon: ImageIcon,
    color: "text-blue-600",
  },
  {
    id: "video",
    label: "视频生成",
    desc: "Seedance 2.0",
    icon: Video,
    color: "text-purple-600",
  },
]

interface FeatureSelectorProps {
  value: FeatureType
  onChange: (value: FeatureType) => void
}

export function FeatureSelector({ value, onChange }: FeatureSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentFeature = FEATURE_OPTIONS.find((f) => f.id === value) || FEATURE_OPTIONS[0]
  const CurrentIcon = currentFeature.icon

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

  const handleSelect = (featureId: FeatureType) => {
    onChange(featureId)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* 触发按钮 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 text-xs rounded-full px-3 transition-all duration-200 ${
          value === "agent"
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
            : value === "image"
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50"
        }`}
      >
        <CurrentIcon className="h-3.5 w-3.5 mr-1.5" />
        {currentFeature.label}
        <ChevronDown
          className={`h-3 w-3 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 py-2 z-50 animate-fade-in">
          {FEATURE_OPTIONS.map((feature) => {
            const Icon = feature.icon
            const isActive = value === feature.id
            return (
              <button
                key={feature.id}
                onClick={() => handleSelect(feature.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200 ${
                  isActive
                    ? "bg-slate-50 dark:bg-slate-700/50"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    feature.id === "agent"
                      ? "bg-indigo-100 dark:bg-indigo-900/50"
                      : feature.id === "image"
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : "bg-purple-100 dark:bg-purple-900/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {feature.label}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {feature.desc}
                  </div>
                </div>
                {isActive && (
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
