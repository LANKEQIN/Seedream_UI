import { useEffect, useState } from 'react'
import { AlertCircle, Settings, Layers } from 'lucide-react'
import { ModelSelector } from '@/components/generation/ModelSelector'
import { PromptInput } from '@/components/generation/PromptInput'
import { ParameterPanel } from '@/components/generation/ParameterPanel'
import { GenerationButton } from '@/components/generation/GenerationButton'
import { ResultViewer } from '@/components/result/ResultViewer'
import { ImageUploader, type ImageFile } from '@/components/image/ImageUploader'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useImageGeneration, useAvailableSizes } from '@/hooks/useImageGeneration'
import { useGenerationStore } from '@/stores/generationStore'
import type { ModelId } from '@/types/generation'

/**
 * 图生图页面
 * 支持单图生图和多图融合两种模式
 */
export function ImageToImage() {
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
    setModel,
    setPrompt,
    setSize,
    setOutputFormat,
    setWatermark,
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
  
  // 当前模式：单图或多图
  const [mode, setMode] = useState<'single' | 'multi'>('single')
  
  // 初始化生成类型
  useEffect(() => {
    setGenerationType('image-to-image')
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
      link.download = `seedream-i2i-${Date.now()}-${index + 1}.${outputFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
  
  // 模式切换
  const handleModeChange = (value: string) => {
    setMode(value as 'single' | 'multi')
    setImageFiles([])
    clearReferenceImages()
  }
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">图生图</h1>
        <p className="text-muted-foreground mt-1">
          基于参考图片生成新的创作内容
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
          
          {/* 模式选择 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  生成模式
                </label>
                <Tabs value={mode} onValueChange={handleModeChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">
                      单图生图
                    </TabsTrigger>
                    <TabsTrigger value="multi">
                      多图融合
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="single" className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      上传一张参考图片，基于该图片生成新内容。适用于风格迁移、内容替换等场景。
                    </p>
                  </TabsContent>
                  <TabsContent value="multi" className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      上传多张参考图片，融合多图特征生成新内容。适用于服装换装、风格融合等场景。
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          {/* 图片上传 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">参考图片</label>
                  {mode === 'multi' && (
                    <Badge variant="secondary">
                      {referenceImages.length} / 4 张
                    </Badge>
                  )}
                </div>
                <ImageUploader
                  value={imageFiles}
                  onChange={handleImageChange}
                  maxFiles={mode === 'single' ? 1 : 4}
                />
                {referenceImages.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    请上传参考图片以开始生成
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
                placeholder={
                  mode === 'single'
                    ? '描述你想要的变化，例如：将背景换成海滩...'
                    : '描述融合效果，例如：将图1的服装换成图2的服装...'
                }
              />
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
            loadingText="正在生成..."
            text="开始生成"
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
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">准备就绪</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  上传参考图片，输入提示词，点击"开始生成"即可创作。
                  {mode === 'single' 
                    ? ' 单图模式适合风格迁移和内容替换。'
                    : ' 多图模式适合服装换装和风格融合。'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
