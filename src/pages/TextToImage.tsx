import { useEffect, useState, useCallback } from 'react'
import { Image, Sparkles, Settings, Download, RefreshCw, X } from 'lucide-react'
import { useImageGeneration, useCanUseWebSearch, useAvailableSizes } from '@/hooks/useImageGeneration'
import { Button } from '@/components/ui/button'
import type { ModelId, Resolution, OutputFormat } from '@/types/generation'

/**
 * 文生图页面 - 仿照火山方舟官方风格
 */
export function TextToImage() {
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
  
  const canUseWebSearch = useCanUseWebSearch(model)
  const availableSizes = useAvailableSizes(model)
  const [showParams, setShowParams] = useState(false)
  
  useEffect(() => {
    if (!availableSizes.includes(size)) {
      setSize(availableSizes[0])
    }
  }, [model, availableSizes, size, setSize])
  
  useEffect(() => {
    if (!canUseWebSearch && webSearch) {
      setWebSearch(false)
    }
  }, [canUseWebSearch, webSearch, setWebSearch])
  
  const handleGenerate = async () => {
    if (!hasApiKey) {
      return
    }
    await generate()
  }
  
  const handleRegenerate = () => {
    handleGenerate()
  }
  
  const handleDownload = useCallback((url: string, index: number) => {
    const timestamp = Date.now()
    const link = document.createElement('a')
    link.href = url
    link.download = `seedream-${timestamp}-${index + 1}.${outputFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [outputFormat])
  
  return (
    <div className="min-h-full bg-slate-50">
      {/* 顶部模型选择区域 */}
      <div className="bg-white border-b">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  图片生成
                </span>
                <span className="text-xs text-slate-500">智能影像，视界无限</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="px-8 py-6">
        {/* 模型信息栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value as ModelId)}
                className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="doubao-seedream-5-0-lite-260128">Doubao-Seedream-5.0-lite</option>
                <option value="doubao-seedream-4-5-251128">Doubao-Seedream-4.5</option>
                <option value="doubao-seedream-4-0-250828">Doubao-Seedream-4.0</option>
              </select>
            </div>
            
            <button 
              onClick={() => setShowParams(!showParams)}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <Settings className="h-3.5 w-3.5" />
              模型参数
            </button>
          </div>
        </div>

        {/* 参数面板 */}
        {showParams && (
          <div className="bg-white rounded-xl p-4 mb-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">生成参数</h3>
              <button 
                onClick={() => setShowParams(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">分辨率</label>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value as Resolution)}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-white"
                  disabled={isLoading}
                >
                  {availableSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">输出格式</label>
                <select 
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-white"
                  disabled={isLoading}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">水印</label>
                <select 
                  value={watermark ? 'true' : 'false'}
                  onChange={(e) => setWatermark(e.target.value === 'true')}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-white"
                  disabled={isLoading}
                >
                  <option value="false">关闭</option>
                  <option value="true">开启</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              体验图片生成，让创意摇动
            </h1>
          </div>

          {/* 生成卡片 */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Image className="h-5 w-5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">高分辨率图片</span>
              </div>
              
              {/* 提示词输入 */}
              <div className="mb-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要生成的图片，例如：一只可爱的猫咪在阳光下打盹..."
                  className="w-full text-sm border rounded-lg px-4 py-3 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              
              {/* 操作栏 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {canUseWebSearch && (
                    <button
                      onClick={() => setWebSearch(!webSearch)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                        webSearch 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      disabled={isLoading}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      联网搜索
                    </button>
                  )}
                  <div className="h-6 w-px bg-slate-200"></div>
                  <span className="text-xs text-slate-500">{size}</span>
                  <span className="text-xs text-slate-500">{outputFormat.toUpperCase()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading || !hasApiKey || !prompt.trim()}
                    className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        生成中...
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

          {/* 错误提示 */}
          {error && (
            <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* 生成结果 */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">生成结果</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className="text-xs h-8"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    重新生成
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img 
                        src={result.url} 
                        alt={`生成结果 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(result.url, index)}
                        className="text-xs bg-white text-slate-800 hover:bg-slate-100"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 示例图片（无结果时显示） */}
          {results.length === 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button className="text-sm text-slate-500 flex items-center gap-1">
                  试试以下示例
                  <span className="text-lg">↑</span>
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                    <img 
                      src={`https://via.placeholder.com/200x200/e2e8f0/64748b?text=示例${i}`}
                      alt={`示例${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部链接 */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <p>提示模型内容均由人工智能模型生成，不代表平台立场</p>
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-slate-600">免责声明</a>
            <a href="#" className="hover:text-slate-600">测试协议</a>
            <a href="#" className="hover:text-slate-600">隐私政策</a>
          </div>
        </div>
      </div>
    </div>
  )
}
