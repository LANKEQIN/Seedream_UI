import { useState } from 'react'
import { Lightbulb, Globe, Wand2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showWebSearch?: boolean
  webSearchEnabled?: boolean
  onWebSearchToggle?: (enabled: boolean) => void
  className?: string
  disabled?: boolean
}

const PROMPT_SUGGESTIONS = [
  '一只可爱的猫咪在阳光下打盹',
  '未来城市的天际线，霓虹灯闪烁',
  '山水画风格的瀑布与松树',
  '一位穿着汉服的少女在樱花树下',
]

export function PromptInput({
  value,
  onChange,
  placeholder = '描述你想要生成的图片...',
  showWebSearch = false,
  webSearchEnabled = false,
  onWebSearchToggle,
  className,
  disabled = false,
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">提示词</label>
        {showWebSearch && (
          <Button
            variant={webSearchEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={() => onWebSearchToggle?.(!webSearchEnabled)}
            disabled={disabled}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            联网搜索
            {webSearchEnabled && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                开启
              </Badge>
            )}
          </Button>
        )}
      </div>

      <div
        className={cn(
          'relative rounded-lg border transition-all duration-200',
          isFocused && 'ring-2 ring-ring ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[120px] resize-none border-0 focus-visible:ring-0"
          rows={4}
        />
        
        {value.length > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {value.length} 字符
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          <span>试试这些提示词：</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={disabled}
              className="h-auto py-1.5 px-3 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1.5" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
