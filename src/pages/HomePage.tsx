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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Seedream UI</h1>
              <p className="text-xs text-muted-foreground">AI 图片生成</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              文生图
            </Badge>
            <div className="text-sm text-muted-foreground hidden sm:block">
              火山引擎 Seedream
            </div>
            <SettingsDialog />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 标题区 */}
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            体验图片生成，让创意涌动
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            输入文字描述，AI 将为你生成精美的图片。支持多种风格和尺寸，释放你的想象力。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 左侧：输入区 */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
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

                <Separator />

                {/* 提示词输入 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">描述你的创意</label>
                  <PromptInput
                    value={params.prompt}
                    onChange={handlePromptChange}
                    disabled={isGenerating}
                  />
                </div>

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

                {/* 生成按钮 */}
                <GenerateButton
                  onClick={handleGenerate}
                  loading={isGenerating}
                  disabled={!canGenerate}
                />
              </CardContent>
            </Card>

            {/* 历史记录 */}
            {history.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    最近生成
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group"
                        onClick={() => setCurrentTask(task)}
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm truncate">{task.params.prompt}</p>
                          <p className="text-xs text-muted-foreground">
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
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ImageResult
              task={currentTask}
              onRegenerate={
                currentTask?.status === "error" ? handleRegenerate : undefined
              }
            />
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="border-t mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by 火山引擎 Seedream</p>
          <p className="mt-1">
            点击右上角设置按钮配置 API Key
          </p>
        </div>
      </footer>
    </div>
  )
}
