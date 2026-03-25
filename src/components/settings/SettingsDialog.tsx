/**
 * 设置对话框组件
 * 用于配置 API Key 等设置
 */

import { useState } from "react"
import { Settings, Key, Eye, EyeOff, Trash2, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSettingsStore, hasValidApiKey } from "@/stores/settings"

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [inputKey, setInputKey] = useState("")
  const [saved, setSaved] = useState(false)

  const { apiKey, setApiKey, clearApiKey, useLocalApiKey } = useSettingsStore()

  // 处理对话框打开
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      // 对话框打开时填充当前 Key
      setInputKey(apiKey)
      setSaved(false)
    }
  }

  const handleSave = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClear = () => {
    clearApiKey()
    setInputKey("")
    setSaved(false)
  }

  const hasKey = hasValidApiKey()
  const isLocalKey = useLocalApiKey && apiKey

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="h-5 w-5" />
          {/* 状态指示点 */}
          <span
            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
              hasKey ? "bg-green-500" : "bg-amber-500"
            }`}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            设置
          </DialogTitle>
          <DialogDescription>
            配置你的 API Key 和其他设置
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* API Key 设置 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
              </Label>
              <div className="flex items-center gap-2">
                {isLocalKey ? (
                  <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    已保存
                  </span>
                ) : hasKey ? (
                  <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    使用环境变量
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                    未设置
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  placeholder="输入你的火山引擎 API Key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="pr-20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                你的 API Key 将保存在浏览器本地存储中，不会上传到服务器。
                <a
                  href="https://console.volcengine.com/ark/region:ark+cn-beijing/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  获取 API Key →
                </a>
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={!inputKey.trim() || saved}
                className="flex-1"
              >
                {saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    已保存
                  </>
                ) : (
                  "保存"
                )}
              </Button>
              {isLocalKey && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* 说明信息 */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium">关于 API Key</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>API Key 用于访问火山引擎 Seedream 图片生成服务</li>
              <li>优先使用本地设置的 Key，如果没有则使用环境变量</li>
              <li>Key 仅存储在浏览器本地，请妥善保管</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
