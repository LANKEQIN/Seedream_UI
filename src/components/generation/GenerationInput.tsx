import { Wand2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FeatureSelector, type FeatureType } from "@/components/generation/FeatureSelector"
import { ReferenceImageUpload } from "@/components/generation/ReferenceImageUpload"
import { GenerationParamsPopover } from "@/components/generation/GenerationParamsPopover"
import type { GenerationParams, ImageFormat, ImageSizeConfig, ModelId, SequentialImageGeneration } from "@/types"

interface GenerationInputProps {
  featureMode: FeatureType
  selectedModel: ModelId
  referenceImages: string[]
  params: GenerationParams
  isGenerating: boolean
  canGenerate: boolean
  onFeatureChange: (mode: FeatureType) => void
  onModelChange: (model: ModelId) => void
  onReferenceImagesSelect: (urls: string[]) => void
  onPromptChange: (prompt: string) => void
  onSizeConfigChange: (config: ImageSizeConfig) => void
  onGenerationCountChange: (count: number) => void
  onFormatChange: (format: ImageFormat) => void
  onSequentialImageGenerationChange: (mode: SequentialImageGeneration) => void
  onWebSearchChange: (enabled: boolean) => void
  onClearPrompt: () => void
  onGenerate: () => void
}

export function GenerationInput({
  featureMode,
  selectedModel,
  referenceImages,
  params,
  isGenerating,
  canGenerate,
  onFeatureChange,
  onModelChange,
  onReferenceImagesSelect,
  onPromptChange,
  onSizeConfigChange,
  onGenerationCountChange,
  onFormatChange,
  onSequentialImageGenerationChange,
  onWebSearchChange,
  onClearPrompt,
  onGenerate,
}: GenerationInputProps) {
  return (
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
                  imageUrls={referenceImages}
                  onImageSelect={onReferenceImagesSelect}
                />
              </div>

              {/* 右侧文本输入 */}
              <div className="flex-1">
                <Textarea
                  placeholder="Seedance 2.0全能参考，上传参考，输入文字，创意无限可能..."
                  value={params.prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
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
                onFeatureChange={onFeatureChange}
                onModelChange={onModelChange}
              />

              {/* 生成参数选择弹窗 */}
              <GenerationParamsPopover
                sizeConfig={params.sizeConfig}
                onSizeConfigChange={onSizeConfigChange}
                generationCount={params.generationCount}
                onGenerationCountChange={onGenerationCountChange}
                outputFormat={params.outputFormat}
                onOutputFormatChange={onFormatChange}
                modelId={params.model}
                disabled={isGenerating}
                sequentialImageGeneration={params.sequentialImageGeneration || "disabled"}
                onSequentialImageGenerationChange={onSequentialImageGenerationChange}
                webSearch={params.webSearch || false}
                onWebSearchChange={onWebSearchChange}
              />
            </div>

            {/* 右侧：清空和生成 */}
            <div className="flex items-center gap-2">
              {params.prompt && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={onClearPrompt}
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={onGenerate}
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
  )
}
