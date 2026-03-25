/**
 * 图片格式选择组件
 * 根据所选模型动态显示支持的格式
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getSupportedFormats } from "@/services/api"
import type { ImageFormat, ModelId } from "@/types"
import { FileImage } from "lucide-react"

interface FormatSelectorProps {
  value: ImageFormat
  onChange: (value: ImageFormat) => void
  disabled?: boolean
  modelId: ModelId
}

export function FormatSelector({ value, onChange, disabled, modelId }: FormatSelectorProps) {
  // 根据模型获取支持的格式列表
  const supportedFormats = getSupportedFormats(modelId)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">输出格式</label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as ImageFormat)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择格式" />
        </SelectTrigger>
        <SelectContent>
          {supportedFormats.map((format) => (
            <SelectItem key={format.value} value={format.value}>
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">{format.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {format.description}
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
