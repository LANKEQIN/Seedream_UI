/**
 * 首页 - 文生图主界面
 * 参考即梦AI设计风格 - 居中大输入框+功能卡片布局
 * 参考文档: https://www.volcengine.com/docs/82379/1824121
 */

import { useState, useCallback } from "react"
import {
  Sparkles,
  Settings,
  History,
  Trash2,
  Wand2,
  Zap,
  Search,
  Palette,
  ChevronDown,
  X,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ModelSelector } from "@/components/generation/ModelSelector"
import { ImageSizeSelector } from "@/components/generation/ImageSizeSelector"
import { GenerationCountSelector } from "@/components/generation/GenerationCountSelector"
import { FormatSelector } from "@/components/generation/FormatSelector"
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
  ModelId,
  ImageFormat,
  ImageSizeConfig,
} from "@/types"

// 功能快捷入口数据
const FEATURE_CARDS = [
  {
    id: "text2img",
    title: "文生图",
    desc: "Seedream 2.0",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "img2img",
    title: "图生图",
    desc: "智能风格迁移",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    id: "smart",
    title: "智能画布",
    desc: "无限创意空间",
    icon: Wand2,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: "inspiration",
    title: "灵感搜索",
    desc: "探索创意世界",
    icon: Search,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
]

// 提示词示例
const PROMPT_EXAMPLES = [
  "一只可爱的橘猫在樱花树下打盹，阳光透过花瓣洒下，温馨治愈风格",
  "未来城市夜景，霓虹灯闪烁，赛博朋克风格，高楼林立，飞行器穿梭",
  "古风少女在竹林中抚琴，水墨画风格，意境悠远，淡雅清新",
  "海底世界，五彩斑斓的珊瑚礁，热带鱼群游弋，写实风格，光影柔和",
]

export function HomePage() {
  // 生成参数状态
  const [params, setParams] = useState<GenerationParams>(getDefaultParams())

  // 当前任务状态
  const [currentTask, setCurrentTask] = useState<GenerationTask | null>(null)

  // 历史记录
  const [history, setHistory] = useState<GenerationTask[]>([])

  // 设置对话框状态
  const [showSettings, setShowSettings] = useState(false)

  // 处理提示词变化
  const handlePromptChange = useCallback((prompt: string) => {
    setParams((prev) => ({ ...prev, prompt }))
  }, [])

  // 处理模型变化
  const handleModelChange = useCallback((model: ModelId) => {
    setParams((prev) => {
      // 检查当前格式是否被新模型支持
      const supportedFormats = getSupportedFormats(model)
      const isCurrentFormatSupported = supportedFormats.some(
        (f) => f.value === prev.outputFormat
      )

      // 如果不支持，自动切换到第一个支持的格式
      const newFormat: ImageFormat = isCurrentFormatSupported
        ? prev.outputFormat
        : (supportedFormats[0]?.value as ImageFormat ?? "jpeg")

      return { ...prev, model, outputFormat: newFormat }
    })
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
    if (!params.prompt.trim()) {
      return
    }

    // 创建新任务
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
    // 如果删除的是当前显示的任务，清空当前任务
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* 背景装饰层 - 更柔和的光晕 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* 顶部渐变光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-500/5 via-purple-500/3 to-transparent rounded-full blur-3xl" />
        {/* 装饰性光点 */}
        <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-indigo-400/30" />
        <div className="absolute top-40 left-32 w-1.5 h-1.5 rounded-full bg-purple-400/30" />
        <div className="absolute top-60 right-40 w-1 h-1 rounded-full bg-pink-400/30" />
      </div>

      {/* 顶部导航 - 极简风格 */}
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

      {/* 主内容区 - 居中布局 */}
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

        {/* 中央大输入框 - 核心交互区 */}
        <div className="relative mb-8 animate-fade-in-up">
          <div className="relative group">
            {/* 输入框外发光效果 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

            <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
              {/* 输入区域 */}
              <div className="p-4">
                <Textarea
                  placeholder="描述你想要生成的图片，例如：一只可爱的橘猫在樱花树下打盹..."
                  value={params.prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  disabled={isGenerating}
                  className="min-h-[100px] resize-none border-0 bg-transparent text-base leading-relaxed placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>

              {/* 底部工具栏 */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                {/* 左侧：模式选择 */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full px-3"
                  >
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Agent 模式
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                  <Badge
                    variant="secondary"
                    className="h-7 text-xs font-normal bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer rounded-full px-3"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    灵感搜索
                  </Badge>
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
                        <Sparkles className="h-4 w-4 mr-2" />
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

        {/* 功能快捷入口卡片 */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon
              return (
                <button
                  key={feature.id}
                  onClick={() => feature.id === "text2img" && setShowSettings(false)}
                  className="group relative p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 text-left"
                >
                  {/* 图标 */}
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {/* 文字 */}
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {feature.desc}
                  </p>
                </button>
              )
            })}
          </div>
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
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-500" />
              创作设置
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* 模型选择 */}
            <ModelSelector
              value={params.model}
              onChange={handleModelChange}
              disabled={isGenerating}
            />

            <Separator />

            {/* 图片尺寸设置 */}
            <ImageSizeSelector
              value={params.sizeConfig}
              onChange={handleSizeConfigChange}
              modelId={params.model}
              disabled={isGenerating}
            />

            <Separator />

            {/* 生成数量设置 */}
            <GenerationCountSelector
              value={params.generationCount}
              onChange={handleGenerationCountChange}
              disabled={isGenerating}
            />

            <Separator />

            {/* 输出格式设置 */}
            <FormatSelector
              value={params.outputFormat}
              onChange={handleFormatChange}
              disabled={isGenerating}
              modelId={params.model}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
