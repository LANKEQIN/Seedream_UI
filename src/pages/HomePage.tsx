/**
 * 首页 - 仿制即梦AI设计风格
 * 功能：图片生成
 * 参考文档: https://www.volcengine.com/docs/82379/1824121
 */

import { useState, useCallback } from "react"
import {
  Sparkles,
  Settings,
  History,
  Trash2,
  Search,
  Palette,
  X,
  Wand2,
  Key,
  Eye,
  EyeOff,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FeatureSelector, type FeatureType } from "@/components/generation/FeatureSelector"
import { useSettingsStore, hasValidApiKey } from "@/stores/settings"
import { ReferenceImageUpload } from "@/components/generation/ReferenceImageUpload"
import { FeatureCards } from "@/components/generation/FeatureCards"
import { GenerationParamsPopover } from "@/components/generation/GenerationParamsPopover"
import { ImageResult } from "@/components/image/ImageResult"
import {
  generateImage,
  getDefaultParams,
  getSupportedFormats,
  generateSizeString,
} from "@/services/api"
import type {
  GenerationParams,
  GenerationTask,
  ImageFormat,
  ImageSizeConfig,
  ModelId,
} from "@/types"

// 提示词示例
const PROMPT_EXAMPLES = [
  "一只可爱的橘猫在樱花树下打盹，阳光透过花瓣洒下，温馨治愈风格",
  "未来城市夜景，霓虹灯闪烁，赛博朋克风格，高楼林立，飞行器穿梭",
  "古风少女在竹林中抚琴，水墨画风格，意境悠远，淡雅清新",
  "海底世界，五彩斑斓的珊瑚礁，热带鱼群游弋，写实风格，光影柔和",
]

export function HomePage() {
  // 当前功能模式 - 只保留图片和视频生成
  const [featureMode, setFeatureMode] = useState<FeatureType>("image")

  // 当前选择的模型
  const [selectedModel, setSelectedModel] = useState<ModelId>("doubao-seedream-5-0-lite-260128")

  // 参考图片
  const [referenceImage, setReferenceImage] = useState<string | null>(null)

  // 生成参数状态
  const [params, setParams] = useState<GenerationParams>(getDefaultParams())

  // 当前任务状态
  const [currentTask, setCurrentTask] = useState<GenerationTask | null>(null)

  // 历史记录
  const [history, setHistory] = useState<GenerationTask[]>([])

  // 设置对话框状态
  const [showSettings, setShowSettings] = useState(false)
  // API Key 输入状态
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [inputKey, setInputKey] = useState("")
  const [saved, setSaved] = useState(false)

  // 获取 settings store
  const { apiKey, setApiKey, clearApiKey, useLocalApiKey } = useSettingsStore()

  // 处理功能模式切换
  const handleFeatureChange = useCallback((mode: FeatureType) => {
    setFeatureMode(mode)
  }, [])

  // 处理模型切换
  const handleModelChange = useCallback((model: ModelId) => {
    setSelectedModel(model)
    // 同步更新生成参数中的模型，并根据新模型支持的格式调整输出格式
    setParams((prev) => {
      const supportedFormats = getSupportedFormats(model)
      const isCurrentFormatSupported = supportedFormats.some(
        (f) => f.value === prev.outputFormat
      )
      const newFormat: ImageFormat = isCurrentFormatSupported
        ? prev.outputFormat
        : (supportedFormats[0]?.value as ImageFormat ?? "jpeg")
      return { ...prev, model, outputFormat: newFormat }
    })
  }, [])

  // 处理参考图选择
  const handleReferenceImageSelect = useCallback((imageUrl: string | null) => {
    setReferenceImage(imageUrl)
  }, [])

  // 处理提示词变化
  const handlePromptChange = useCallback((prompt: string) => {
    setParams((prev) => ({ ...prev, prompt }))
  }, [])

  // 处理尺寸配置变化
  const handleSizeConfigChange = useCallback((sizeConfig: ImageSizeConfig) => {
    setParams((prev) => ({
      ...prev,
      sizeConfig,
      size: generateSizeString(sizeConfig),
    }))
  }, [])

  // 处理生成数量变化
  const handleGenerationCountChange = useCallback((generationCount: number) => {
    setParams((prev) => ({ ...prev, generationCount }))
  }, [])

  // 处理格式变化
  const handleFormatChange = useCallback((outputFormat: ImageFormat) => {
    setParams((prev) => ({ ...prev, outputFormat }))
  }, [])

  // 处理生成
  const handleGenerate = useCallback(async () => {
    if (!params.prompt.trim()) return

    const task: GenerationTask = {
      id: Date.now().toString(),
      status: "loading",
      params: { ...params },
      createdAt: Date.now(),
    }

    setCurrentTask(task)

    try {
      const result = await generateImage(params)
      const completedTask: GenerationTask = {
        ...task,
        status: "success",
        result,
        completedAt: Date.now(),
      }
      setCurrentTask(completedTask)
      setHistory((prev) => [completedTask, ...prev])
    } catch (error) {
      const failedTask: GenerationTask = {
        ...task,
        status: "error",
        error: error instanceof Error ? error.message : "生成失败",
        completedAt: Date.now(),
      }
      setCurrentTask(failedTask)
    }
  }, [params])

  // 重新生成
  const handleRegenerate = useCallback(() => {
    if (currentTask) {
      setParams(currentTask.params)
      handleGenerate()
    }
  }, [currentTask, handleGenerate])

  // 删除历史记录
  const handleDeleteHistory = useCallback((taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHistory((prev) => prev.filter((task) => task.id !== taskId))
    if (currentTask?.id === taskId) {
      setCurrentTask(null)
    }
  }, [currentTask])

  // 处理示例点击
  const handleExampleClick = useCallback((example: string) => {
    setParams((prev) => ({ ...prev, prompt: example }))
  }, [])

  // 清空提示词
  const handleClearPrompt = useCallback(() => {
    setParams((prev) => ({ ...prev, prompt: "" }))
  }, [])

  const canGenerate = params.prompt.trim().length > 0
  const isGenerating = currentTask?.status === "loading"
  const hasKey = hasValidApiKey()
  const isLocalKey = useLocalApiKey && apiKey

  // 处理保存 API Key
  const handleSaveKey = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  // 处理清除 API Key
  const handleClearKey = () => {
    clearApiKey()
    setInputKey("")
    setSaved(false)
  }

  // 处理对话框打开
  const handleSettingsOpen = (open: boolean) => {
    setShowSettings(open)
    if (open) {
      setInputKey(apiKey)
      setSaved(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* 背景装饰层 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-500/5 via-purple-500/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-indigo-400/30" />
        <div className="absolute top-40 left-32 w-1.5 h-1.5 rounded-full bg-purple-400/30" />
        <div className="absolute top-60 right-40 w-1 h-1 rounded-full bg-pink-400/30" />
      </div>

      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 w-full">
        <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Seedream
              </span>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Settings className="h-4 w-4 mr-1.5" />
                设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 pt-12 pb-20">
        {/* 标题区 */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            开启你的{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Agent 模式
            </span>
            ，即刻造梦！
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            输入描述，让 AI 为你创造无限可能
          </p>
        </div>

        {/* 中央输入区 - 仿制即梦风格 */}
        <div className="relative mb-8 animate-fade-in-up">
          <div className="relative group">
            {/* 输入框外发光效果 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

            <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
              {/* 输入区域 - 包含参考图和文本框 */}
              <div className="p-4">
                <div className="flex gap-4">
                  {/* 左侧参考图上传 */}
                  <div className="shrink-0 pt-1">
                    <ReferenceImageUpload
                      imageUrl={referenceImage}
                      onImageSelect={handleReferenceImageSelect}
                    />
                  </div>

                  {/* 右侧文本输入 */}
                  <div className="flex-1">
                    <Textarea
                      placeholder="Seedance 2.0全能参考，上传参考，输入文字，创意无限可能..."
                      value={params.prompt}
                      onChange={(e) => handlePromptChange(e.target.value)}
                      disabled={isGenerating}
                      className="min-h-[100px] resize-none border-0 bg-transparent text-base leading-relaxed placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* 底部工具栏 */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                {/* 左侧：功能选择和其他选项 */}
                <div className="flex items-center gap-2">
                  {/* 功能选择下拉 - 集成模型选择 */}
                  <FeatureSelector
                    feature={featureMode}
                    model={selectedModel}
                    onFeatureChange={handleFeatureChange}
                    onModelChange={handleModelChange}
                  />

                  {/* 生成参数选择弹窗 */}
                  <GenerationParamsPopover
                    sizeConfig={params.sizeConfig}
                    onSizeConfigChange={handleSizeConfigChange}
                    generationCount={params.generationCount}
                    onGenerationCountChange={handleGenerationCountChange}
                    outputFormat={params.outputFormat}
                    onOutputFormatChange={handleFormatChange}
                    modelId={params.model}
                    disabled={isGenerating}
                  />

                  {/* 灵感搜索 */}
                  <Badge
                    variant="secondary"
                    className="h-7 text-xs font-normal bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer rounded-full px-3"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    灵感搜索
                  </Badge>

                  {/* 创意设计 */}
                  <Badge
                    variant="secondary"
                    className="h-7 text-xs font-normal bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer rounded-full px-3"
                  >
                    <Palette className="h-3 w-3 mr-1" />
                    创意设计
                  </Badge>
                </div>

                {/* 右侧：清空和生成 */}
                <div className="flex items-center gap-2">
                  {params.prompt && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      onClick={handleClearPrompt}
                      disabled={isGenerating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="h-9 px-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full font-medium shadow-md shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        生成中
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        生成
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 提示词示例 */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              试试这些示例
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => !isGenerating && handleExampleClick(example)}
                disabled={isGenerating}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
              >
                {example.slice(0, 16)}...
              </button>
            ))}
          </div>
        </div>

        {/* 功能卡片区域 */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <FeatureCards
            activeFeature={featureMode}
            onFeatureSelect={handleFeatureChange}
          />
        </div>

        {/* 生成结果展示区 */}
        {(currentTask || history.length > 0) && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <ImageResult
              task={currentTask}
              onRegenerate={
                currentTask?.status === "error" ? handleRegenerate : undefined
              }
            />
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="mt-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                最近生成
              </h3>
              <Badge variant="secondary" className="text-xs">
                {history.length} 条
              </Badge>
            </div>
            <div className="space-y-2">
              {history.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all duration-200 group"
                  onClick={() => setCurrentTask(task)}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm truncate text-slate-700 dark:text-slate-300">
                      {task.params.prompt}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        task.status === "success"
                          ? "default"
                          : task.status === "error"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.status === "success"
                        ? "成功"
                        : task.status === "error"
                          ? "失败"
                          : "生成中"}
                    </Badge>
                    <button
                      onClick={(e) => handleDeleteHistory(task.id, e)}
                      className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all"
                      title="删除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 底部 */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            Powered by 火山引擎 Seedream · 点击右上角设置配置 API Key
          </p>
        </div>
      </footer>

      {/* 设置对话框 */}
      <Dialog open={showSettings} onOpenChange={handleSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-500" />
              设置
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* API Key 设置区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">API Key</span>
                </div>
                <div className="flex items-center gap-2">
                  {isLocalKey ? (
                    <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      已保存
                    </span>
                  ) : hasKey ? (
                    <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                      环境变量
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                      未设置
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type={showKeyInput ? "text" : "password"}
                  placeholder="输入火山引擎 API Key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full h-9 px-3 pr-20 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                >
                  {showKeyInput ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                API Key 用于访问火山引擎 Seedream 服务，
                <a
                  href="https://console.volcengine.com/ark/region:ark+cn-beijing/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  获取 API Key →
                </a>
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveKey}
                  disabled={!inputKey.trim() || saved}
                  size="sm"
                  className="flex-1"
                >
                  {saved ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      已保存
                    </>
                  ) : (
                    "保存"
                  )}
                </Button>
                {isLocalKey && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearKey}
                    className="text-red-500 hover:text-red-600"
                  >
                    清除
                  </Button>
                )}
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
