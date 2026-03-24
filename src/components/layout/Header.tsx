import { Link, useLocation } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  Key,
  Layers3,
  Settings,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'

const pageMeta: Record<string, { title: string; description: string; chips: string[] }> = {
  '/': {
    title: '创作台',
    description: '输入提示词并直接开始生成图片',
    chips: ['统一工作流', '实时参数', '结果预览'],
  },
  '/text-to-image': {
    title: '文生图',
    description: '用自然语言快速生成高质量图片',
    chips: ['提示词创作', '高清输出', '灵感速用'],
  },
  '/image-to-image': {
    title: '图生图',
    description: '上传参考图并进行风格延展',
    chips: ['参考图上传', '风格延展', '细节重绘'],
  },
  '/series': {
    title: '组图生成',
    description: '保持主题一致，批量生成系列画面',
    chips: ['系列一致性', '批量出图', '角色延续'],
  },
  '/history': {
    title: '历史记录',
    description: '查看和复用最近的生成结果',
    chips: ['最近输出', '重复利用', '回溯记录'],
  },
  '/settings': {
    title: '设置',
    description: '管理 API Key 与默认生成参数',
    chips: ['密钥管理', '默认参数', '基础偏好'],
  },
}

export function Header() {
  const location = useLocation()
  const hasApiKey = useSettingsStore((state) => state.hasApiKey())
  const currentPage = pageMeta[location.pathname] ?? pageMeta['/']

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              <Layers3 className="h-3 w-3 text-sky-500" />
              火山方舟图片平台
            </span>
            <span className="rounded-full border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-3 py-1 text-xs font-medium text-sky-700">
              SeedDream Studio
            </span>
          </div>
          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{currentPage.title}</h2>
              <div className="hidden h-5 w-px bg-slate-200 md:block" />
              <div className="hidden flex-wrap items-center gap-2 md:flex">
                {currentPage.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{currentPage.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all',
              hasApiKey
                ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700'
                : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700'
            )}
          >
            <Key className="h-3.5 w-3.5" />
            {hasApiKey ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>API 已配置，可直接开始生成</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>未配置 API Key，当前仅可预览界面</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-slate-200 bg-white px-4 text-xs shadow-sm hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              <Link to="/settings">
                <Settings className="mr-1.5 h-3.5 w-3.5" />
                设置
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-9 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 text-xs text-white shadow-md shadow-sky-500/25 hover:from-sky-600 hover:to-cyan-600"
            >
              <Link to="/text-to-image">
                <Wand2 className="mr-1.5 h-3.5 w-3.5" />
                开始创作
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="h-9 rounded-full border-slate-200 bg-white px-4 text-xs text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Link to="/series">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                组图生成
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
