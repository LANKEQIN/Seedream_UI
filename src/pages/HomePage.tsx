/**
 * 首页 - 仿制即梦AI设计风格
 * 功能：图片生成
 * 参考文档: https://www.volcengine.com/docs/82379/1824121
 */

import { useState, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { SettingsDialog } from "@/components/layout/SettingsDialog"
import { GenerationInput } from "@/components/generation/GenerationInput"
import { PromptExamples } from "@/components/generation/PromptExamples"
import { ImageResult } from "@/components/image/ImageResult"
import { HistoryList } from "@/components/image/HistoryList"
import { useHistoryStore } from "@/stores/history"
import {
  generateImage,
  generateImageStream,
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
  SequentialImageGeneration,
  FeatureType,
} from "@/types"

export function HomePage() {
  // 当前功能模式 - 只保留图片和视频生成
  const [featureMode, setFeatureMode] = useState<FeatureType>("image")

  // 当前选择的模型
  const [selectedModel, setSelectedModel] = useState<ModelId>("doubao-seedream-5-0-lite-260128")

  // 参考图片（支持多图，最多14张）
  const [referenceImages, setReferenceImages] = useState<string[]>([])

  // 生成参数状态
  const [params, setParams] = useState<GenerationParams>(getDefaultParams())

  // 从持久化存储获取当前任务和历史记录
  const { currentTask, history, setCurrentTask, addHistory, deleteHistory } = useHistoryStore()

  // 设置对话框状态
  const [showSettings, setShowSettings] = useState(false)

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

  // 处理参考图选择（支持多图）
  const handleReferenceImagesSelect = useCallback((imageUrls: string[]) => {
    setReferenceImages(imageUrls)
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
  // 根据官方文档：generationCount > 1 时必须启用组图模式
  const handleGenerationCountChange = useCallback((generationCount: number) => {
    setParams((prev) => ({ 
      ...prev, 
      generationCount,
      // 当生成数量 > 1 时，自动切换到组图模式
      sequentialImageGeneration: generationCount > 1 ? "auto" : prev.sequentialImageGeneration
    }))
  }, [])

  // 处理格式变化
  const handleFormatChange = useCallback((outputFormat: ImageFormat) => {
    setParams((prev) => ({ ...prev, outputFormat }))
  }, [])

  // 处理组图生成模式变化
  // 根据官方文档：单图模式只返回1张图片，组图模式才支持多张
  const handleSequentialImageGenerationChange = useCallback(
    (mode: SequentialImageGeneration) => {
      setParams((prev) => ({ 
        ...prev, 
        sequentialImageGeneration: mode,
        // 切换到单图模式时，自动将生成数量设为1
        generationCount: mode === "disabled" ? 1 : prev.generationCount
      }))
    },
    []
  )

  // 处理联网搜索变化
  const handleWebSearchChange = useCallback((enabled: boolean) => {
    setParams((prev) => ({ ...prev, webSearch: enabled }))
  }, [])

  // 处理生成
  const handleGenerate = useCallback(async () => {
    if (!params.prompt.trim()) return

    // 构建完整的生成参数，包含参考图片、组图模式和联网搜索
    // 根据官方文档：image 参数支持单张或多张（最多14张）
    const fullParams = {
      ...params,
      image: referenceImages.length > 0 ? referenceImages : undefined,
    }

    console.log("handleGenerate - 完整参数:", fullParams)

    const task: GenerationTask = {
      id: Date.now().toString(),
      status: "loading",
      params: fullParams,
      createdAt: Date.now(),
    }

    setCurrentTask(task)

    // 判断是否使用流式模式：多图生成时启用流式输出
    const useStreaming = fullParams.generationCount > 1 && fullParams.sequentialImageGeneration === "auto"

    if (useStreaming) {
      // 流式模式：多图生成时逐张显示
      try {
        // 先切换到 streaming 状态显示骨架屏
        setCurrentTask({
          ...task,
          status: "streaming",
          partialImages: [],
          completedCount: 0,
        })

        console.log("开始流式生成，参数:", fullParams)
        
        // 使用流式API
        const result = await generateImageStream(fullParams, (image, index) => {
          console.log("收到第", index + 1, "张图片:", image)
          // 每张图片生成时更新UI
          setCurrentTask((prev) => {
            if (!prev) return prev
            const newPartialImages = [...(prev.partialImages || []), image]
            console.log("当前已收集图片:", newPartialImages.length)
            return {
              ...prev,
              partialImages: newPartialImages,
              completedCount: index + 1,
            }
          })
        })

        console.log("流式生成完成，最终结果:", result)

        // 生成完成 - 保留 partialImages 以确保图片能正确显示
        setCurrentTask((prev) => {
          const finalImages = [...(prev?.partialImages || []), ...result.data].filter(
            (img, index, arr) => arr.findIndex(i => i.url === img.url && i.b64_json === img.b64_json) === index
          )
          console.log("最终要显示的图片:", finalImages)
          
          const completedTask: GenerationTask = {
            ...task,
            status: "success",
            result: { ...result, data: finalImages },
            completedAt: Date.now(),
            // 保留流式过程中收集的图片
            partialImages: finalImages,
            completedCount: finalImages.length,
          }
          addHistory(completedTask)
          return completedTask
        })
      } catch (error) {
        const failedTask: GenerationTask = {
          ...task,
          status: "error",
          error: error instanceof Error ? error.message : "生成失败",
          completedAt: Date.now(),
        }
        setCurrentTask(failedTask)
      }
    } else {
      // 非流式模式：单图或普通模式
      try {
        const result = await generateImage(fullParams)
        const completedTask: GenerationTask = {
          ...task,
          status: "success",
          result,
          completedAt: Date.now(),
        }
        setCurrentTask(completedTask)
        addHistory(completedTask)
      } catch (error) {
        const failedTask: GenerationTask = {
          ...task,
          status: "error",
          error: error instanceof Error ? error.message : "生成失败",
          completedAt: Date.now(),
        }
        setCurrentTask(failedTask)
      }
    }
  }, [params, referenceImages, setCurrentTask, addHistory])

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
    deleteHistory(taskId)
  }, [deleteHistory])

  // 处理历史任务点击
  const handleHistoryTaskClick = useCallback((task: GenerationTask) => {
    setCurrentTask(task)
    setParams(task.params)
  }, [setCurrentTask])

  // 处理示例点击
  const handleExampleClick = useCallback((example: string) => {
    setParams((prev) => ({ ...prev, prompt: example }))
  }, [])

  // 清空提示词
  const handleClearPrompt = useCallback(() => {
    setParams((prev) => ({ ...prev, prompt: "" }))
  }, [])

  const canGenerate = params.prompt.trim().length > 0
  const isGenerating = currentTask?.status === "loading" || currentTask?.status === "streaming"

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
      <Header onOpenSettings={() => setShowSettings(true)} />

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 pt-12 pb-20">
        {/* 标题区 */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            浮生如
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              梦
            </span>
            ，即刻造
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              梦
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            输入描述，让 AI 为你创造无限可能
          </p>
        </div>

        {/* 中央输入区 */}
        <GenerationInput
          featureMode={featureMode}
          selectedModel={selectedModel}
          referenceImages={referenceImages}
          params={params}
          isGenerating={isGenerating}
          canGenerate={canGenerate}
          onFeatureChange={handleFeatureChange}
          onModelChange={handleModelChange}
          onReferenceImagesSelect={handleReferenceImagesSelect}
          onPromptChange={handlePromptChange}
          onSizeConfigChange={handleSizeConfigChange}
          onGenerationCountChange={handleGenerationCountChange}
          onFormatChange={handleFormatChange}
          onSequentialImageGenerationChange={handleSequentialImageGenerationChange}
          onWebSearchChange={handleWebSearchChange}
          onClearPrompt={handleClearPrompt}
          onGenerate={handleGenerate}
        />

        {/* 提示词示例 */}
        <PromptExamples
          disabled={isGenerating}
          onExampleClick={handleExampleClick}
        />

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
        <HistoryList
          history={history}
          onTaskClick={handleHistoryTaskClick}
          onDeleteHistory={handleDeleteHistory}
        />
      </main>

      {/* 设置对话框 */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  )
}
