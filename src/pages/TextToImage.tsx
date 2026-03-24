import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Image,
  Sparkles,
  Settings,
  Download,
  RefreshCw,
  X,
  CheckCircle2,
  Palette,
  Clock3,
  ShieldCheck,
  Zap,
  Wand2,
  ArrowRight,
} from 'lucide-react'
import { useImageGeneration, useCanUseWebSearch, useAvailableSizes } from '@/hooks/useImageGeneration'
import { Button } from '@/components/ui/button'
import type { ModelId, Resolution, OutputFormat } from '@/types/generation'

const modelOptions: Array<{ value: ModelId; label: string; tagline: string }> = [
  {
    value: 'doubao-seedream-5-0-lite-260128',
    label: 'Doubao-Seedream-5.0-lite',
    tagline: '速度更快，适合高频创作',
  },
  {
    value: 'doubao-seedream-4-5-251128',
    label: 'Doubao-Seedream-4.5',
    tagline: '质量均衡，适合常规出图',
  },
  {
    value: 'doubao-seedream-4-0-250828',
    label: 'Doubao-Seedream-4.0',
    tagline: '兼容性更稳，支持更多规格',
  },
]

const inspirationPrompts = [
  {
    title: '电影感城市夜景',
    prompt: '赛博朋克城市夜景，霓虹灯倒映在雨后街道，电影级光影，广角镜头，超高细节',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
  },
  {
    title: '产品广告海报',
    prompt: '高级感护肤品广告海报，玻璃台面倒影，柔光布景，简洁背景，商业摄影质感',
    gradient: 'from-sky-500 via-cyan-500 to-teal-500',
  },
  {
    title: '国风人物插画',
    prompt: '古风少女站在桃花树下，轻纱长裙，微风吹拂花瓣，唯美插画风格，细节丰富',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    title: '治愈系动物写真',
    prompt: '一只慵懒的橘猫趴在阳光洒落的窗台上，毛发细节清晰，暖色调，真实摄影',
    gradient: 'from-lime-500 via-emerald-500 to-teal-500',
  },
]

const creationGuides = [
  {
    title: '主体说清楚',
    description: '先写主角、场景和动作，再补充材质、镜头、氛围等细节。',
    icon: Palette,
  },
  {
    title: '风格尽量具体',
    description: '例如"电影感海报""日系插画""写实商业摄影"，效果更稳定。',
    icon: CheckCircle2,
  },
  {
    title: '结果可反复迭代',
    description: '先快速生成一版，再逐步补充构图、灯光和色彩要求。',
    icon: Clock3,
  },
]

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
  const activeModel = modelOptions.find((option) => option.value === model) ?? modelOptions[0]
  const promptLength = prompt.trim().length
  const promptStatus =
    promptLength === 0
      ? { label: '等待输入', className: 'border-slate-200 bg-slate-50 text-slate-500' }
      : promptLength < 24
        ? { label: '建议补充细节', className: 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700' }
        : { label: '可以尝试生成', className: 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700' }
  const workflowMetrics = [
    { label: '提示词字数', value: `${promptLength} 字` },
    { label: '可用尺寸', value: availableSizes.join(' / ') },
    { label: '输出格式', value: outputFormat.toUpperCase() },
  ]
  
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

  const handleApplyPrompt = (value: string) => {
    setPrompt(value)
  }
  
  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/50 via-white to-cyan-50/30 p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-3 py-1 text-xs font-medium text-sky-700">视觉模型</span>
            <span className="rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-medium text-slate-600">图片生成</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">体验图片生成，让创意摇动</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            输入描述性提示词，选择合适的模型和参数，即可快速生成高质量图片。支持多种分辨率和输出格式。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {workflowMetrics.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-500">图片生成</p>
          <div className="mt-3 rounded-xl border border-sky-200 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{activeModel.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{activeModel.tagline}</p>
            <div className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${promptStatus.className}`}>
              {promptStatus.label}
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">当前能力</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{canUseWebSearch ? '支持联网搜索与图片生成' : '支持标准图片生成'}</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">创作状态</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{hasApiKey ? 'API 已配置，可以直接开始生成' : '未配置 API Key，当前仅能预览界面'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 transition-all hover:border-sky-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20">
                <Image className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">当前模型</p>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as ModelId)}
                  className="mt-1 w-full truncate bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  disabled={isLoading}
                >
                  {modelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowParams(!showParams)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              <Settings className="h-4 w-4" />
              {showParams ? '收起参数' : '模型参数'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 font-medium">提示词 {promptLength} 字</span>
            <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 font-medium">分辨率 {size}</span>
            <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 font-medium">格式 {outputFormat.toUpperCase()}</span>
          </div>
        </div>
      </section>

      {showParams && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">模型参数</h3>
              <p className="mt-1 text-xs text-slate-500">调整分辨率、输出格式和水印设置</p>
            </div>
            <button
              onClick={() => setShowParams(false)}
              className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-semibold text-slate-500">分辨率</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as Resolution)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                disabled={isLoading}
              >
                {availableSizes.map((currentSize) => (
                  <option key={currentSize} value={currentSize}>
                    {currentSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-semibold text-slate-500">输出格式</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                disabled={isLoading}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-semibold text-slate-500">水印</label>
              <select
                value={watermark ? 'true' : 'false'}
                onChange={(e) => setWatermark(e.target.value === 'true')}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                disabled={isLoading}
              >
                <option value="false">关闭</option>
                <option value="true">开启</option>
              </select>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-200/60 px-6 py-5 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">输入提示词，开始创作</h2>
              <p className="mt-2 text-sm text-slate-500">描述你想看到的画面，系统会根据当前模型与参数直接生成图片</p>
            </div>

            <div className="px-6 py-6">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-gradient-to-r from-sky-500 to-cyan-500 px-2 py-1 text-white">图片</span>
                  <span>结合图片、输入创意描述</span>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要生成的图片，例如：晨雾中的中式园林，青瓦飞檐，金色晨光穿过树叶，写实摄影风格，构图干净。"
                  className="mt-4 min-h-[200px] w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  rows={7}
                  disabled={isLoading}
                />

                <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{activeModel.label}</span>
                    <span className="rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{size}</span>
                    <span className="rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{outputFormat.toUpperCase()}</span>
                    <span className="rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">水印 {watermark ? '开启' : '关闭'}</span>
                    {canUseWebSearch && (
                      <button
                        onClick={() => setWebSearch(!webSearch)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          webSearch
                            ? 'border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-700'
                            : 'border-slate-200/80 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50'
                        }`}
                        disabled={isLoading}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        联网搜索
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!hasApiKey && (
                      <Button asChild variant="outline" className="h-10 rounded-full border-slate-200 bg-white px-4 text-sm hover:border-sky-200 hover:bg-sky-50">
                        <Link to="/settings">先配置 API Key</Link>
                      </Button>
                    )}
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !hasApiKey || !prompt.trim()}
                      className="h-10 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-5 text-sm text-white shadow-md shadow-sky-500/25 transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          生成图片
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>建议包含：主体、场景、风格、镜头、光线与材质关键词</span>
                  <span>{promptLength} / 800</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">生成结果</h3>
                  <p className="mt-1 text-sm text-slate-500">悬停图片可直接下载</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="h-9 rounded-full border-slate-200 bg-white px-4 text-xs hover:border-sky-200 hover:bg-sky-50"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  重新生成
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {results.map((result, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm transition-all hover:shadow-lg">
                    <div className="aspect-square">
                      <img
                        src={result.url}
                        alt={`生成结果 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(result.url, index)}
                        className="rounded-full bg-white px-4 text-xs text-slate-800 shadow-lg hover:bg-slate-100"
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">灵感示例</h3>
                <p className="mt-1 text-sm text-slate-500">点击下方卡片可快速填入提示词</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {inspirationPrompts.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleApplyPrompt(item.prompt)}
                    className="group overflow-hidden rounded-2xl border border-slate-200/80 text-left transition-all hover:border-sky-200 hover:shadow-lg"
                  >
                    <div className={`h-24 bg-gradient-to-br ${item.gradient}`} />
                    <div className="space-y-3 p-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{item.prompt}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors group-hover:bg-sky-100 group-hover:text-sky-700">
                        <ArrowRight className="h-3.5 w-3.5" />
                        点击填入提示词
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!hasApiKey && (
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-md">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-amber-900">先配置 API Key</h3>
                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    生成请求依赖你在设置页填写火山方舟 API Key，配置完成后当前页面即可直接生成。
                  </p>
                  <Button asChild className="mt-4 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-xs text-white shadow-md hover:from-amber-600 hover:to-orange-600">
                    <Link to="/settings">前往设置</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">创作建议</h3>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">Prompt Tips</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {creationGuides.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 transition-all hover:border-sky-200 hover:bg-sky-50/50">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">快速套用</h3>
              <span className="rounded-full border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-2.5 py-0.5 text-[10px] font-semibold text-sky-700">3 组灵感</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {inspirationPrompts.slice(0, 3).map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleApplyPrompt(item.prompt)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-left transition-all hover:border-sky-200 hover:bg-sky-50/50"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white px-6 py-4 text-center text-xs text-slate-500 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span>提示：模型内容由人工智能生成，结果仅供创作参考，请在正式使用前自行审核。</span>
        </div>
      </section>
    </div>
  )
}
