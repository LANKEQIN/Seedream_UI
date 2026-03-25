/**
 * 模型选择组件
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AVAILABLE_MODELS } from "@/services/api"
import type { ModelId } from "@/types"
import { Zap, Star } from "lucide-react"

interface ModelSelectorProps {
  value: ModelId
  onChange: (value: ModelId) => void
  disabled?: boolean
}

const MODEL_ICONS: Record<ModelId, React.ReactNode> = {
  "doubao-seedream-5-0-lite-260128": <Zap className="h-4 w-4 text-yellow-500" />,
  "doubao-seedream-4-5-251128": <Star className="h-4 w-4 text-blue-500" />,
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">选择模型</label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as ModelId)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择模型" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                {MODEL_ICONS[model.id]}
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
