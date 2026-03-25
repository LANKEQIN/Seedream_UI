/**
 * 功能卡片区域
 * 展示图片生成功能卡片
 */

import { ImageIcon, Sparkles } from "lucide-react"

interface FeatureCard {
  id: "image"
  title: string
  subtitle: string
  desc: string
  icon: React.ElementType
  gradient: string
  bgColor: string
}

const FEATURES: FeatureCard[] = [
  {
    id: "image",
    title: "图片生成",
    subtitle: "Seedream 2.0",
    desc: "智能美学提升",
    icon: ImageIcon,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
]

interface FeatureCardsProps {
  activeFeature: "image"
  onFeatureSelect: (feature: "image") => void
}

export function FeatureCards({ activeFeature, onFeatureSelect }: FeatureCardsProps) {
  return (
    <div className="w-full">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          创作
        </span>
      </div>

      {/* 卡片网格 */}
      <div className="grid grid-cols-2 gap-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          const isActive =
            (feature.id === "image" && activeFeature === "image") ||
            (feature.id === "video" && activeFeature === "video")

          return (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(feature.id)}
              className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
                isActive
                  ? "bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 shadow-lg shadow-indigo-500/10"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"
              }`}
            >
              {/* 图标 */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* 文字内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {feature.title}
                  </h3>
                  {isActive && (
                    <Sparkles className="h-3 w-3 text-indigo-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {feature.subtitle}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  {feature.desc}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
