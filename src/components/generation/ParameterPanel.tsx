import { Settings2, Monitor, FileImage, Droplet } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MODEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ParameterPanelProps {
  model: string
  size: string
  format: 'png' | 'jpeg'
  watermark: boolean
  onSizeChange: (size: string) => void
  onFormatChange: (format: 'png' | 'jpeg') => void
  onWatermarkChange: (watermark: boolean) => void
  className?: string
  disabled?: boolean
}

export function ParameterPanel({
  model,
  size,
  format,
  watermark,
  onSizeChange,
  onFormatChange,
  onWatermarkChange,
  className,
  disabled = false,
}: ParameterPanelProps) {
  const modelConfig = MODEL_CONFIG[model as keyof typeof MODEL_CONFIG]
  const availableSizes = modelConfig?.sizes || ['2K']

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          高级选项
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            输出分辨率
          </Label>
          <Select
            value={size}
            onValueChange={onSizeChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择分辨率" />
            </SelectTrigger>
            <SelectContent>
              {availableSizes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            更高分辨率需要更长生成时间
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <FileImage className="h-4 w-4 text-muted-foreground" />
            输出格式
          </Label>
          <Select
            value={format}
            onValueChange={(v) => onFormatChange(v as 'png' | 'jpeg')}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG（无损）</SelectItem>
              <SelectItem value="jpeg">JPEG（较小文件）</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            PNG适合需要透明背景的图片，JPEG文件更小
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2 text-sm">
              <Droplet className="h-4 w-4 text-muted-foreground" />
              添加水印
            </Label>
            <p className="text-xs text-muted-foreground">
              生成图片时添加水印标识
            </p>
          </div>
          <Switch
            checked={watermark}
            onCheckedChange={onWatermarkChange}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  )
}
