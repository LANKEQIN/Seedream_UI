/**
 * 图片尺寸选择组件
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IMAGE_SIZES } from "@/services/api"
import type { ImageSize } from "@/types"
import { ImageIcon } from "lucide-react"

interface SizeSelectorProps {
  value: ImageSize
  onChange: (value: ImageSize) => void
  disabled?: boolean
}

export function SizeSelector({ value, onChange, disabled }: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">图片尺寸</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择尺寸" />
        </SelectTrigger>
        <SelectContent>
          {IMAGE_SIZES.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">{size.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {size.description}
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
