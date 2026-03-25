/**
 * 提示词输入组件
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
      {/* 输入框 */}
      <div className="relative">
        <Textarea
          placeholder="描述你想要生成的图片，例如：一只可爱的橘猫在樱花树下打盹..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-h-[120px] resize-none pr-12 text-base leading-relaxed"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 提示词示例 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>试试这些示例</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PROMPT_EXAMPLES.map((example, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors max-w-[200px] truncate"
              onClick={() => !disabled && handleExampleClick(example)}
            >
              <span className="truncate">{example.slice(0, 20)}...</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
