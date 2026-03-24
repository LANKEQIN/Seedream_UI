import { Sparkles, Zap, Star } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MODEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

const modelIcons: Record<string, React.ReactNode> = {
  'doubao-seedream-5-0-lite-260128': <Sparkles className="h-4 w-4" />,
  'doubao-seedream-4-5-251128': <Star className="h-4 w-4" />,
  'doubao-seedream-4-0-250828': <Zap className="h-4 w-4" />,
}

const modelBadges: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  'doubao-seedream-5-0-lite-260128': { label: '最新', variant: 'default' },
  'doubao-seedream-4-5-251128': { label: '推荐', variant: 'secondary' },
  'doubao-seedream-4-0-250828': { label: '稳定', variant: 'outline' },
}

export function ModelSelector({
  value,
  onChange,
  className,
  disabled = false,
}: ModelSelectorProps) {
  const selectedModel = MODEL_CONFIG[value as keyof typeof MODEL_CONFIG]

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">模型选择</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择模型">
            {selectedModel && (
              <div className="flex items-center gap-2">
                {modelIcons[value]}
                <span>{selectedModel.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(MODEL_CONFIG).map(([modelId, config]) => (
            <SelectItem key={modelId} value={modelId}>
              <div className="flex items-center gap-3 py-1">
                <div className="flex items-center gap-2">
                  {modelIcons[modelId]}
                  <span className="font-medium">{config.name}</span>
                </div>
                <Badge variant={modelBadges[modelId]?.variant || 'outline'} className="text-xs">
                  {modelBadges[modelId]?.label}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedModel && (
        <div className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {selectedModel.supports.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            支持分辨率：{selectedModel.sizes.join(' / ')}
          </div>
        </div>
      )}
    </div>
  )
}
