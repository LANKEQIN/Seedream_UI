import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Key, 
  Palette, 
  Monitor, 
  FileImage,
  Droplet,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ExternalLink,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettingsStore } from '@/stores/settingsStore'
import { MODEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Settings() {
  const {
    apiKey,
    theme,
    defaultModel,
    defaultSize,
    defaultFormat,
    watermark,
    setApiKey,
    setTheme,
    setDefaultModel,
    setDefaultSize,
    setDefaultFormat,
    setWatermark,
    hasApiKey,
  } = useSettingsStore()
  
  const [showApiKey, setShowApiKey] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(apiKey)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const handleSaveApiKey = () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    setTimeout(() => {
      setApiKey(tempApiKey)
      setIsSaving(false)
      setSaveSuccess(true)
      
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 500)
  }
  
  const themeOptions = [
    { value: 'light', label: '浅色', icon: '☀️' },
    { value: 'dark', label: '深色', icon: '🌙' },
    { value: 'system', label: '跟随系统', icon: '💻' },
  ]
  
  const availableSizes = MODEL_CONFIG[defaultModel as keyof typeof MODEL_CONFIG]?.sizes || ['2K']
  
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/50 via-white to-cyan-50/30 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">设置</h1>
            <p className="mt-1 text-sm text-slate-500">管理您的API配置和偏好设置</p>
          </div>
        </div>
      </div>
      
      <Card className="rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sm">
              <Key className="h-4 w-4" />
            </div>
            API Key 配置
          </CardTitle>
          <CardDescription>
            配置火山方舟 API Key 以使用图片生成功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {hasApiKey() ? (
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
                <Check className="h-3 w-3 mr-1" />
                已配置
              </Badge>
            ) : (
              <Badge variant="destructive" className="shadow-sm">
                <AlertCircle className="h-3 w-3 mr-1" />
                未配置
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-semibold text-slate-700">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="输入您的火山方舟 API Key"
                  className="h-11 rounded-xl border-slate-200/80 pr-10 focus:border-sky-500 focus:ring-sky-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button
                onClick={handleSaveApiKey}
                disabled={isSaving || !tempApiKey.trim()}
                className="h-11 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 text-white shadow-md shadow-sky-500/25 hover:from-sky-600 hover:to-cyan-600"
              >
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </div>
            {saveSuccess && (
              <p className="text-sm text-emerald-600 flex items-center gap-1.5 font-medium">
                <Check className="h-4 w-4" />
                API Key 已保存
              </p>
            )}
          </div>
          
          <Alert className="rounded-xl border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50">
            <Info className="h-4 w-4 text-sky-600" />
            <AlertTitle className="text-sky-800">如何获取 API Key？</AlertTitle>
            <AlertDescription className="space-y-2 text-sky-700">
              <p>1. 访问火山方舟控制台</p>
              <p>2. 进入「API Key 管理」页面</p>
              <p>3. 创建新的 API Key 或使用已有的</p>
              <Button
                variant="link"
                className="px-0 h-auto text-sky-600 hover:text-sky-700"
                onClick={() => window.open('https://console.volcengine.com/ark/region:ark+cn-beijing/apikey', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                打开火山方舟控制台
              </Button>
            </AlertDescription>
          </Alert>
          
          <Alert variant="destructive" className="rounded-xl border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">安全提示</AlertTitle>
            <AlertDescription className="text-red-700">
              API Key 仅存储在本地浏览器中，不会上传到任何服务器。请勿将 API Key 分享给他人。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Card className="rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-sm">
              <FileImage className="h-4 w-4" />
            </div>
            默认生成参数
          </CardTitle>
          <CardDescription>
            设置生成图片时的默认参数值
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Monitor className="h-4 w-4 text-slate-400" />
              默认模型
            </Label>
            <Select value={defaultModel} onValueChange={setDefaultModel}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200/80 focus:border-sky-500 focus:ring-sky-500/20">
                <SelectValue placeholder="选择默认模型" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {Object.entries(MODEL_CONFIG).map(([modelId, config]) => (
                  <SelectItem key={modelId} value={modelId} className="rounded-lg">
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              每次打开生成页面时默认使用的模型
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Monitor className="h-4 w-4 text-slate-400" />
              默认分辨率
            </Label>
            <Select value={defaultSize} onValueChange={setDefaultSize}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200/80 focus:border-sky-500 focus:ring-sky-500/20">
                <SelectValue placeholder="选择默认分辨率" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableSizes.map((size) => (
                  <SelectItem key={size} value={size} className="rounded-lg">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              根据所选模型，可用的分辨率可能不同
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileImage className="h-4 w-4 text-slate-400" />
              默认输出格式
            </Label>
            <Select 
              value={defaultFormat} 
              onValueChange={(v) => setDefaultFormat(v as 'png' | 'jpeg')}
            >
              <SelectTrigger className="h-11 rounded-xl border-slate-200/80 focus:border-sky-500 focus:ring-sky-500/20">
                <SelectValue placeholder="选择默认格式" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="png" className="rounded-lg">PNG（无损）</SelectItem>
                <SelectItem value="jpeg" className="rounded-lg">JPEG（较小文件）</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              PNG适合需要透明背景的图片，JPEG文件更小
            </p>
          </div>
          
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-4">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Droplet className="h-4 w-4 text-slate-400" />
                默认添加水印
              </Label>
              <p className="text-xs text-slate-500">
                生成图片时默认添加水印标识
              </p>
            </div>
            <Switch
              checked={watermark}
              onCheckedChange={setWatermark}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
              <Palette className="h-4 w-4" />
            </div>
            界面偏好
          </CardTitle>
          <CardDescription>
            自定义应用的外观和主题
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">主题模式</Label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                    theme === option.value
                      ? 'border-sky-500 bg-gradient-to-br from-sky-50 to-cyan-50 shadow-sm'
                      : 'border-slate-200/80 bg-white hover:border-sky-200 hover:shadow-sm'
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            关于
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">版本</span>
              <p className="mt-1 font-semibold text-slate-900">1.0.0</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">构建时间</span>
              <p className="mt-1 font-semibold text-slate-900">2026-01-16</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">技术栈</span>
              <p className="mt-1 font-semibold text-slate-900">React + TypeScript + Vite</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">UI框架</span>
              <p className="mt-1 font-semibold text-slate-900">shadcn/ui + Tailwind CSS</p>
            </div>
          </div>
          
          <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">SeedDream Studio</span> 是一个基于火山方舟 Seedream 模型的图片生成平台，
              为个人用户提供简单易用的可视化创作工具。
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.volcengine.com/docs/82379/1824121', '_blank')}
              className="h-9 rounded-xl border-slate-200 hover:border-sky-200 hover:bg-sky-50"
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              API 文档
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.volcengine.com/docs/82379/入门指南', '_blank')}
              className="h-9 rounded-xl border-slate-200 hover:border-sky-200 hover:bg-sky-50"
            >
              <Zap className="h-4 w-4 mr-1.5" />
              快速入门
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
