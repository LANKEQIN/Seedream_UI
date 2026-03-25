/**
 * 提示词输入组件
 * 精致的视觉设计，带有柔和的动画效果
 */

import { Sparkles, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// 提示词示例
const PROMPT_EXAMPLES = [
  "一只可爱的橘猫在樱花树下打盹，阳光透过花瓣洒下，温馨治愈风格",
  "未来城市夜景，霓虹灯闪烁，赛博朋克风格，高楼林立，飞行器穿梭",
  "古风少女在竹林中抚琴，水墨画风格，意境悠远，淡雅清新",
  "海底世界，五彩斑斓的珊瑚礁，热带鱼群游弋，写实风格，光影柔和",
]

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  const handleClear = () => {
    onChange("")
  }

  const handleExampleClick = (example: string) => {
    onChange(example)
  }

  return (
    <div className="space-y-4">
      {/* 输入框 - 精致边框效果 */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300" />
        <div className="relative">
          <Textarea
            placeholder="描述你想要生成的图片，例如：一只可爱的橘猫在樱花树下打盹..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="min-h-[120px] resize-none pr-12 text-base leading-relaxed bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          />
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-all duration-200"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 提示词示例 - 精美的标签样式 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="font-medium">试试这些示例</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PROMPT_EXAMPLES.map((example, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80"
              onClick={() => !disabled && handleExampleClick(example)}
            >
              <span className="truncate max-w-[180px]">{example.slice(0, 20)}...</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
