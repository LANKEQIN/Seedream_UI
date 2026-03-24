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
    accent: 'from-fuchsia-500 via-violet-500 to-indigo-500',
  },
  {
    title: '产品广告海报',
    prompt: '高级感护肤品广告海报，玻璃台面倒影，柔光布景，简洁背景，商业摄影质感',
    accent: 'from-sky-500 via-cyan-500 to-emerald-500',
  },
  {
    title: '国风人物插画',
    prompt: '古风少女站在桃花树下，轻纱长裙，微风吹拂花瓣，唯美插画风格，细节丰富',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    title: '治愈系动物写真',
    prompt: '一只慵懒的橘猫趴在阳光洒落的窗台上，毛发细节清晰，暖色调，真实摄影',
    accent: 'from-lime-500 via-emerald-500 to-teal-500',
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
    description: '例如“电影感海报”“日系插画”“写实商业摄影”，效果更稳定。',
    icon: CheckCircle2,
  },
  {
    title: '结果可反复迭代',
    description: '先快速生成一版，再逐步补充构图、灯光和色彩要求。',
    icon: Clock3,
  },
]

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
  const activeModel = modelOptions.find((option) => option.value === model) ?? modelOptions[0]
  const promptLength = prompt.trim().length
  const promptStatus =
    promptLength === 0
      ? { label: '等待输入', className: 'border-slate-200 bg-white text-slate-500' }
      : promptLength < 24
        ? { label: '建议补充细节', className: 'border-amber-200 bg-amber-50 text-amber-700' }
        : { label: '可以尝试生成', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' }
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
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#eef3ff_0%,#f8fbff_52%,#f4f7fb_100%)] p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">视觉模型</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">图片生成</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">体验图片生成，让创意摇动</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            参考火山方舟官方控制台的布局，把模型选择、提示词输入、参数控制和生成结果放到同一工作流里，整体改回浅色、轻边框、低干扰的控制台风格。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {workflowMetrics.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-200 bg-[linear-gradient(180deg,#f5f3ff_0%,#eff4ff_100%)] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-500">图片生成</p>
          <div className="mt-3 rounded-2xl border border-indigo-200 bg-white/80 p-4">
            <p className="text-sm font-semibold text-slate-900">{activeModel.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{activeModel.tagline}</p>
            <div className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${promptStatus.className}`}>
              {promptStatus.label}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">当前能力</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{canUseWebSearch ? '支持联网搜索与图片生成' : '支持标准图片生成'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">创作状态</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{hasApiKey ? 'API 已配置，可以直接开始生成' : '未配置 API Key，当前仅能预览界面'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200">
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              {showParams ? '收起参数' : '模型参数'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">提示词 {promptLength} 字</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">分辨率 {size}</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">格式 {outputFormat.toUpperCase()}</span>
          </div>
        </div>
      </section>

      {showParams && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">模型参数</h3>
              <p className="mt-1 text-xs text-slate-500">保持官网控制台一样的浅色面板结构，减少视觉噪音。</p>
            </div>
            <button
              onClick={() => setShowParams(false)}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-medium text-slate-500">分辨率</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as Resolution)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                disabled={isLoading}
              >
                {availableSizes.map((currentSize) => (
                  <option key={currentSize} value={currentSize}>
                    {currentSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-medium text-slate-500">输出格式</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                disabled={isLoading}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-medium text-slate-500">水印</label>
              <select
                value={watermark ? 'true' : 'false'}
                onChange={(e) => setWatermark(e.target.value === 'true')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                disabled={isLoading}
              >
                <option value="false">关闭</option>
                <option value="true">开启</option>
              </select>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-6 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">体验图片生成，让创意摇动</h2>
              <p className="mt-3 text-sm text-slate-500">描述你想看到的画面，系统会根据当前模型与参数直接生成图片。</p>
            </div>

            <div className="px-6 py-6">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-white px-2 py-1 ring-1 ring-slate-200">图片</span>
                  <span>结合图片、输入创意描述</span>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要生成的图片，例如：晨雾中的中式园林，青瓦飞檐，金色晨光穿过树叶，写实摄影风格，构图干净。"
                  className="mt-4 min-h-[220px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  rows={7}
                  disabled={isLoading}
                />

                <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">{activeModel.label}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">{size}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">{outputFormat.toUpperCase()}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">水印 {watermark ? '开启' : '关闭'}</span>
                    {canUseWebSearch && (
                      <button
                        onClick={() => setWebSearch(!webSearch)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                          webSearch
                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
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
                      <Button asChild variant="secondary" className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm hover:bg-slate-50">
                        <Link to="/settings">先配置 API Key</Link>
                      </Button>
                    )}
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !hasApiKey || !prompt.trim()}
                      className="h-10 rounded-full bg-indigo-600 px-5 text-sm text-white hover:bg-indigo-700"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
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
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">生成结果</h3>
                  <p className="mt-1 text-sm text-slate-500">保持简洁展示，悬停可直接下载当前图片。</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs hover:bg-slate-50"
                >
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  重新生成
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {results.map((result, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                    <div className="aspect-square">
                      <img
                        src={result.url}
                        alt={`生成结果 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(result.url, index)}
                        className="rounded-full bg-white px-4 text-xs text-slate-800 hover:bg-slate-100"
                      >
                        <Download className="mr-1 h-3.5 w-3.5" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">灵感示例</h3>
                <p className="mt-1 text-sm text-slate-500">保持官方控制台的简洁感，但把提示词模板保留下来方便快速套用。</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {inspirationPrompts.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleApplyPrompt(item.prompt)}
                    className="overflow-hidden rounded-3xl border border-slate-200 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                  >
                    <div className={`h-24 bg-gradient-to-br ${item.accent}`} />
                    <div className="space-y-3 p-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{item.prompt}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                        <Sparkles className="h-3.5 w-3.5" />
                        点击填入提示词
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {!hasApiKey && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-amber-900">先配置 API Key</h3>
                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    生成请求依赖你在设置页填写火山方舟 API Key，配置完成后当前页面即可直接生成。
                  </p>
                  <Button asChild className="mt-4 h-10 rounded-full bg-amber-600 px-4 text-xs hover:bg-amber-700">
                    <Link to="/settings">前往设置</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">创作建议</h3>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-500">Prompt Tips</span>
            </div>
            <div className="mt-4 space-y-3">
              {creationGuides.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 ring-1 ring-slate-200">
                        <Icon className="h-5 w-5" />
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

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">快速套用</h3>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] text-indigo-700">3 组灵感</span>
            </div>
            <div className="mt-4 space-y-3">
              {inspirationPrompts.slice(0, 3).map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleApplyPrompt(item.prompt)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
        <p>提示：模型内容由人工智能生成，结果仅供创作参考，请在正式使用前自行审核。</p>
      </section>
    </div>
  )
}
