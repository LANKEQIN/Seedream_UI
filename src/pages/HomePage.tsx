/**
 * 首页 - 文生图主界面
 * 参考官方体验中心设计风格
 * 参考文档: https://www.volcengine.com/docs/82379/1824121
 */

import { useState, useCallback } from "react"
import { Sparkles, Settings, History, ImageIcon, Trash2 } from "lucide-react"
import { SettingsDialog } from "@/components/settings/SettingsDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PromptInput } from "@/components/generation/PromptInput"
import { ModelSelector } from "@/components/generation/ModelSelector"
import { ImageSizeSelector } from "@/components/generation/ImageSizeSelector"
import { GenerationCountSelector } from "@/components/generation/GenerationCountSelector"
import { FormatSelector } from "@/components/generation/FormatSelector"
import { GenerateButton } from "@/components/generation/GenerateButton"
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

export function HomePage() {
  // 生成参数状态
  const [params, setParams] = useState<GenerationParams>(getDefaultParams())

  // 当前任务状态
  const [currentTask, setCurrentTask] = useState<GenerationTask | null>(null)

  // 历史记录
  const [history, setHistory] = useState<GenerationTask[]>([])

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

  const canGenerate = params.prompt.trim().length > 0
  const isGenerating = currentTask?.status === "loading"

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰层 */}
      <div className="fixed inset-0 -z-10">
        {/* 主渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50" />

        {/* 装饰性渐变光晕 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* 点状装饰 */}
        <div className="absolute inset-0 bg-dots opacity-50" />
      </div>

      {/* 顶部导航 - 玻璃态效果 */}
      <header className="sticky top-0 z-50 w-full">
        <div className="glass border-b border-white/20 dark:border-slate-800/50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Seedream UI</h1>
                <p className="text-xs text-muted-foreground">AI 图片生成</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <ImageIcon className="h-3 w-3 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400">文生图</span>
              </Badge>
              <div className="text-sm text-muted-foreground hidden sm:block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                火山引擎 Seedream
              </div>
              <SettingsDialog />
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 标题区 - 更有视觉冲击力 */}
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">AI 驱动的创意工具</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-gradient-primary">体验图片生成</span>
            <br />
            <span className="text-foreground">让创意涌动</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            输入文字描述，AI 将为你生成精美的图片。支持多种风格和尺寸，释放你的想象力。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 左侧：输入区 */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Card className="shadow-elegant border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-shadow duration-300 hover:shadow-card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  创作设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 模型选择 */}
                <ModelSelector
                  value={params.model}
                  onChange={handleModelChange}
                  disabled={isGenerating}
                />

                <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

                {/* 提示词输入 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    描述你的创意
                  </label>
                  <PromptInput
                    value={params.prompt}
                    onChange={handlePromptChange}
                    disabled={isGenerating}
                  />
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

                {/* 图片尺寸设置 */}
                <ImageSizeSelector
                  value={params.sizeConfig}
                  onChange={handleSizeConfigChange}
                  modelId={params.model}
                  disabled={isGenerating}
                />

                <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

                {/* 生成数量设置 */}
                <GenerationCountSelector
                  value={params.generationCount}
                  onChange={handleGenerationCountChange}
                  disabled={isGenerating}
                />

                <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

                {/* 输出格式设置 */}
                <FormatSelector
                  value={params.outputFormat}
                  onChange={handleFormatChange}
                  disabled={isGenerating}
                  modelId={params.model}
                />

                {/* 生成按钮 */}
                <div className="pt-2">
                  <GenerateButton
                    onClick={handleGenerate}
                    loading={isGenerating}
                    disabled={!canGenerate}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 历史记录 - 精致卡片 */}
            {history.length > 0 && (
              <Card className="shadow-soft border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <History className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    最近生成
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {history.length} 条
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((task, index) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/30 cursor-pointer transition-all duration-200 group border border-transparent hover:border-indigo-500/20"
                        onClick={() => setCurrentTask(task)}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm truncate font-medium">{task.params.prompt}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
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
                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：结果展示区 */}
          <div className="lg:sticky lg:top-24 lg:self-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="animate-scale-in">
              <ImageResult
                task={currentTask}
                onRegenerate={
                  currentTask?.status === "error" ? handleRegenerate : undefined
                }
              />
            </div>
          </div>
        </div>
      </main>

      {/* 底部 - 简约设计 */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 mt-20 py-8 bg-white/50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>Powered by</span>
            <span className="font-medium text-foreground">火山引擎 Seedream</span>
          </div>
          <p className="text-xs text-muted-foreground">
            点击右上角设置按钮配置 API Key
          </p>
        </div>
      </footer>
    </div>
  )
}
