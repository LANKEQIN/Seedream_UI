import { useEffect, useState } from 'react'
import { AlertCircle, Layers, Grid3X3 } from 'lucide-react'
import { ModelSelector } from '@/components/generation/ModelSelector'
import { PromptInput } from '@/components/generation/PromptInput'
import { ParameterPanel } from '@/components/generation/ParameterPanel'
import { GenerationButton } from '@/components/generation/GenerationButton'
import { ResultViewer } from '@/components/result/ResultViewer'
import { ImageUploader, type ImageFile } from '@/components/image/ImageUploader'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { useImageGeneration, useAvailableSizes } from '@/hooks/useImageGeneration'
import { useGenerationStore } from '@/stores/generationStore'
import type { ModelId } from '@/types/generation'

/**
 * 组图生成页面
 * 基于参考图生成一组关联图片，保持主体一致性
 */
export function SeriesGenerate() {
  // 获取图片生成功能
  const {
    error,
    isLoading,
    model,
    prompt,
    size,
    outputFormat,
    watermark,
    referenceImages,
    results,
    seriesCount,
    setModel,
    setPrompt,
    setSize,
    setOutputFormat,
    setWatermark,
    setSeriesCount,
    generate,
    clearResults,
    hasApiKey,
  } = useImageGeneration()
  
  // 获取生成类型设置
  const { setGenerationType, clearReferenceImages, addReferenceImage } = useGenerationStore()
  
  // 获取可用分辨率
  const availableSizes = useAvailableSizes(model)
  
  // 本地状态：上传的图片文件
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([])
  
  // 初始化生成类型
  useEffect(() => {
    setGenerationType('series')
    return () => {
      clearReferenceImages()
    }
  }, [setGenerationType, clearReferenceImages])
  
  // 当模型切换时，检查分辨率是否在可用范围内
  useEffect(() => {
    if (!availableSizes.includes(size)) {
      setSize(availableSizes[0])
    }
  }, [model, availableSizes, size, setSize])
  
  // 处理图片上传变化
  const handleImageChange = async (files: ImageFile[]) => {
    setImageFiles(files)
    
    // 清除旧的参考图片
    clearReferenceImages()
    
    // 将新图片转换为base64并添加到store
    for (const file of files) {
      try {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          const base64 = result.split(',')[1]
          addReferenceImage(base64)
        }
        reader.readAsDataURL(file.file)
      } catch (err) {
        console.error('Failed to read file:', err)
      }
    }
  }
  
  // 处理生成
  const handleGenerate = async () => {
    if (!hasApiKey || referenceImages.length === 0) {
      return
    }
    clearResults()
    await generate()
  }
  
  // 处理重新生成
  const handleRegenerate = () => {
    handleGenerate()
  }
  
  // 处理下载全部
  const handleDownloadAll = () => {
    results.forEach((result, index) => {
      const link = document.createElement('a')
      link.href = result.url
      link.download = `seedream-series-${Date.now()}-${index + 1}.${outputFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">组图生成</h1>
        <p className="text-muted-foreground mt-1">
          基于参考图生成一组关联图片，保持主体一致性
        </p>
      </div>
      
      {/* API Key未配置提示 */}
      {!hasApiKey && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key 未配置</AlertTitle>
          <AlertDescription>
            请先在设置页面配置火山方舟 API Key，才能使用图片生成功能。
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：参数配置 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 模型选择 */}
          <Card>
            <CardContent className="pt-6">
              <ModelSelector
                value={model}
                onChange={(value) => setModel(value as ModelId)}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
          
          {/* 参考图片上传 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">参考图片</label>
                  <Badge variant="secondary">
                    {referenceImages.length} / 1 张
                  </Badge>
                </div>
                <ImageUploader
                  value={imageFiles}
                  onChange={handleImageChange}
                  maxFiles={1}
                />
                {referenceImages.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    请上传参考图片作为组图的基础
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* 提示词输入 */}
          <Card>
            <CardContent className="pt-6">
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                disabled={isLoading}
                placeholder="描述组图内容，例如：参考图1，生成四张图片，图中人物分别带着墨镜、骑着摩托、带着帽子、拿着棒棒糖..."
                showWebSearch={false}
              />
            </CardContent>
          </Card>
          
          {/* 组图数量设置 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                  生成数量
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      选择要生成的图片数量
                    </span>
                    <Badge variant="outline" className="text-base font-semibold">
                      {seriesCount} 张
                    </Badge>
                  </div>
                  <Slider
                    value={[seriesCount]}
                    onValueChange={(value) => setSeriesCount(value[0])}
                    min={1}
                    max={15}
                    step={1}
                    disabled={isLoading}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1张</span>
                    <span>15张</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  生成数量越多，所需时间越长。建议从较小数量开始尝试。
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* 高级选项 */}
          <ParameterPanel
            model={model}
            size={size}
            format={outputFormat}
            watermark={watermark}
            onSizeChange={(s) => setSize(s as typeof size)}
            onFormatChange={setOutputFormat}
            onWatermarkChange={setWatermark}
            disabled={isLoading}
          />
          
          {/* 生成按钮 */}
          <GenerationButton
            isLoading={isLoading}
            loadingText={`正在生成 ${seriesCount} 张图片...`}
            text={`生成 ${seriesCount} 张图片`}
            onClick={handleGenerate}
            disabled={!hasApiKey || referenceImages.length === 0 || !prompt.trim()}
            className="h-12 text-base"
          />
          
          {/* 错误提示 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>生成失败</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* 右侧：生成结果 */}
        <div className="lg:col-span-2">
          {results.length > 0 ? (
            <ResultViewer
              results={results.map((r) => ({
                url: r.url,
                width: r.width,
                height: r.height,
                format: r.format,
              }))}
              onRegenerate={handleRegenerate}
              onDownloadAll={handleDownloadAll}
            />
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Layers className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">准备就绪</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  上传参考图片，描述组图内容，设置生成数量后点击生成。
                  组图生成会保持主体一致性，适合角色多姿态、连续剧情创作。
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
