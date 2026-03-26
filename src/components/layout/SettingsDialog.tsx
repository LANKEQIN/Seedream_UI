import { useState } from "react"
import { Key, Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSettingsStore } from "@/stores/settings"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [inputKey, setInputKey] = useState("")
  const [saved, setSaved] = useState(false)

  const { apiKey, setApiKey, clearApiKey, useLocalApiKey } = useSettingsStore()

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (newOpen) {
      setInputKey(apiKey)
      setSaved(false)
    }
  }

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClearKey = () => {
    clearApiKey()
    setInputKey("")
    setSaved(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API 设置
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {useLocalApiKey && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Key</span>
                <div className="flex gap-2">
                  {saved && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      已保存
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKeyInput ? "text" : "password"}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="输入 API Key"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                  >
                    {showKeyInput ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveKey} className="flex-1">
                  保存
                </Button>
                {apiKey && (
                  <Button variant="destructive" onClick={handleClearKey}>
                    <X className="h-4 w-4 mr-2" />
                    清除
                  </Button>
                )}
              </div>
            </div>
          )}

          {!useLocalApiKey && (
            <div className="text-center py-8 text-slate-500">
              <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>API Key 已配置</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
