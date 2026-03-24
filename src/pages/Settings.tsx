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
  Info
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

/**
 * 设置页面
 * 管理API Key、默认参数和界面偏好
 */
export function Settings() {
  // 获取设置状态
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
  
  // 本地状态
  const [showApiKey, setShowApiKey] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(apiKey)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // 保存API Key
  const handleSaveApiKey = () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    // 模拟保存延迟
    setTimeout(() => {
      setApiKey(tempApiKey)
      setIsSaving(false)
      setSaveSuccess(true)
      
      // 3秒后隐藏成功提示
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 500)
  }
  
  // 主题选项
  const themeOptions = [
    { value: 'light', label: '浅色', icon: '☀️' },
    { value: 'dark', label: '深色', icon: '🌙' },
    { value: 'system', label: '跟随系统', icon: '💻' },
  ]
  
  // 获取当前模型的可用分辨率
  const availableSizes = MODEL_CONFIG[defaultModel as keyof typeof MODEL_CONFIG]?.sizes || ['2K']
  
  return (
    <div className="space-y-6 max-w-3xl">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-muted-foreground mt-1">
          管理您的API配置和偏好设置
        </p>
      </div>
      
      {/* API Key 配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key 配置
          </CardTitle>
          <CardDescription>
            配置火山方舟 API Key 以使用图片生成功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key 状态 */}
          <div className="flex items-center gap-2">
            {hasApiKey() ? (
              <Badge variant="default" className="bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                已配置
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                未配置
              </Badge>
            )}
          </div>
          
          {/* API Key 输入 */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="输入您的火山方舟 API Key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              >
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </div>
            {saveSuccess && (
              <p className="text-sm text-green-500 flex items-center gap-1">
                <Check className="h-4 w-4" />
                API Key 已保存
              </p>
            )}
          </div>
          
          {/* 获取 API Key 指引 */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>如何获取 API Key？</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>1. 访问火山方舟控制台</p>
              <p>2. 进入「API Key 管理」页面</p>
              <p>3. 创建新的 API Key 或使用已有的</p>
              <Button
                variant="link"
                className="px-0 h-auto"
                onClick={() => window.open('https://console.volcengine.com/ark/region:ark+cn-beijing/apikey', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                打开火山方舟控制台
              </Button>
            </AlertDescription>
          </Alert>
          
          {/* 安全提示 */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>安全提示</AlertTitle>
            <AlertDescription>
              API Key 仅存储在本地浏览器中，不会上传到任何服务器。请勿将 API Key 分享给他人。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      {/* 默认参数设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            默认生成参数
          </CardTitle>
          <CardDescription>
            设置生成图片时的默认参数值
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 默认模型 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              默认模型
            </Label>
            <Select value={defaultModel} onValueChange={setDefaultModel}>
              <SelectTrigger>
                <SelectValue placeholder="选择默认模型" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MODEL_CONFIG).map(([modelId, config]) => (
                  <SelectItem key={modelId} value={modelId}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              每次打开生成页面时默认使用的模型
            </p>
          </div>
          
          {/* 默认分辨率 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              默认分辨率
            </Label>
            <Select value={defaultSize} onValueChange={setDefaultSize}>
              <SelectTrigger>
                <SelectValue placeholder="选择默认分辨率" />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              根据所选模型，可用的分辨率可能不同
            </p>
          </div>
          
          {/* 默认输出格式 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileImage className="h-4 w-4 text-muted-foreground" />
              默认输出格式
            </Label>
            <Select 
              value={defaultFormat} 
              onValueChange={(v) => setDefaultFormat(v as 'png' | 'jpeg')}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择默认格式" />
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
          
          {/* 默认水印设置 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-muted-foreground" />
                默认添加水印
              </Label>
              <p className="text-xs text-muted-foreground">
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
      
      {/* 界面偏好 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            界面偏好
          </CardTitle>
          <CardDescription>
            自定义应用的外观和主题
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 主题选择 */}
          <div className="space-y-2">
            <Label>主题模式</Label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    theme === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-muted hover:border-muted-foreground/20'
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 关于信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            关于
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">版本</span>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <span className="text-muted-foreground">构建时间</span>
              <p className="font-medium">2026-01-16</p>
            </div>
            <div>
              <span className="text-muted-foreground">技术栈</span>
              <p className="font-medium">React + TypeScript + Vite</p>
            </div>
            <div>
              <span className="text-muted-foreground">UI框架</span>
              <p className="font-medium">shadcn/ui + Tailwind CSS</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Seedream Studio 是一个基于火山方舟 Seedream 模型的图片生成平台，
              为个人用户提供简单易用的可视化创作工具。
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.volcengine.com/docs/82379/1824121', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              API 文档
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.volcengine.com/docs/82379/入门指南', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              快速入门
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
