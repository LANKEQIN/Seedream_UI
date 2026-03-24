import { useEffect } from 'react'
import { AlertCircle, Settings } from 'lucide-react'
import { ModelSelector } from '@/components/generation/ModelSelector'
import { PromptInput } from '@/components/generation/PromptInput'
import { ParameterPanel } from '@/components/generation/ParameterPanel'
import { GenerationButton } from '@/components/generation/GenerationButton'
import { ResultViewer } from '@/components/result/ResultViewer'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useImageGeneration, useCanUseWebSearch, useAvailableSizes } from '@/hooks/useImageGeneration'

/**
 * 文生图页面
 * 支持纯文本提示词生成图片，5.0-lite模型支持联网搜索
 */
export function TextToImage() {
  // 获取图片生成功能
  const {
    error,
    isLoading,
    model,
    prompt,
    size,
    outputFormat,
    watermark,
    webSearch,
    results,
    setModel,
    setPrompt,
    setSize,
    setOutputFormat,
    setWatermark,
    setWebSearch,
    generate,
    hasApiKey,
  } = useImageGeneration()
  
  // 检查是否可以使用联网搜索
  const canUseWebSearch = useCanUseWebSearch(model)
  
  // 获取可用分辨率
  const availableSizes = useAvailableSizes(model)
  
  // 当模型切换时，检查分辨率是否在可用范围内
  useEffect(() => {
    if (!availableSizes.includes(size)) {
      setSize(availableSizes[0])
    }
  }, [model, availableSizes, size, setSize])
  
  // 当模型切换时，关闭联网搜索（如果不是5.0-lite）
  useEffect(() => {
    if (!canUseWebSearch && webSearch) {
      setWebSearch(false)
    }
  }, [canUseWebSearch, webSearch, setWebSearch])
  
  // 处理生成
  const handleGenerate = async () => {
    if (!hasApiKey) {
      return
    }
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
      link.download = `seedream-${Date.now()}-${index + 1}.${outputFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">文生图</h1>
        <p className="text-muted-foreground mt-1">
          输入文本提示词，生成高质量图片
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
                onChange={(value) => setModel(value as typeof model)}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
          
          {/* 提示词输入 */}
          <Card>
            <CardContent className="pt-6">
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                showWebSearch={canUseWebSearch}
                webSearchEnabled={webSearch}
                onWebSearchToggle={setWebSearch}
                disabled={isLoading}
                placeholder="描述你想要生成的图片，例如：一只可爱的猫咪在阳光下打盹..."
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
            disabled={!hasApiKey || !prompt.trim()}
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
                  输入提示词并点击"开始生成"按钮，即可创建图片。
                  {canUseWebSearch && ' 当前模型支持联网搜索功能。'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
