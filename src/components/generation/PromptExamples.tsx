import { Sparkles } from "lucide-react"

const PROMPT_EXAMPLES = [
  "一只可爱的橘猫在樱花树下打盹，阳光透过花瓣洒下，温馨治愈风格",
  "未来城市夜景，霓虹灯闪烁，赛博朋克风格，高楼林立，飞行器穿梭",
  "古风少女在竹林中抚琴，水墨画风格，意境悠远，淡雅清新",
  "海底世界，五彩斑斓的珊瑚礁，热带鱼群游弋，写实风格，光影柔和",
]

interface PromptExamplesProps {
  disabled?: boolean
  onExampleClick: (example: string) => void
}

export function PromptExamples({ disabled, onExampleClick }: PromptExamplesProps) {
  return (
    <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          试试这些示例
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PROMPT_EXAMPLES.map((example, index) => (
          <button
            key={index}
            onClick={() => !disabled && onExampleClick(example)}
            disabled={disabled}
            className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
          >
            {example.slice(0, 16)}...
          </button>
        ))}
      </div>
    </div>
  )
}
