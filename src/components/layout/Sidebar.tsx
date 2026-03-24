import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  History,
  Home,
  Image,
  Images,
  Settings,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: '创作台', description: '快速进入主工作区', icon: Home },
  { path: '/text-to-image', label: '文生图', description: '从提示词直接出图', icon: Image },
  { path: '/image-to-image', label: '图生图', description: '参考图延展与重绘', icon: Images },
  { path: '/series', label: '组图生成', description: '保持主体一致批量出图', icon: Sparkles },
  { path: '/history', label: '历史记录', description: '回看最近生成结果', icon: History },
  { path: '/settings', label: '设置', description: '配置 API Key 与默认参数', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-slate-200/80 bg-gradient-to-b from-slate-50 to-white lg:block">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-b border-slate-200/60 px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold text-slate-900">SeedDream Studio</h1>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">火山方舟图片平台</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="group rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all hover:border-sky-200 hover:shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Studio</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">视觉模型</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">文生图、图生图与组图生成</p>
            </div>
            <div className="group rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-3 shadow-sm transition-all hover:shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-500">Flow</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">快速创作</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">轻量布局，快速出图</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <span>模型体验</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">6</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200',
                  isActive
                    ? 'border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 text-slate-900 shadow-sm'
                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{item.label}</span>
                    <ArrowRight
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
                        isActive ? 'text-sky-500' : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-400'
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      'mt-0.5 truncate text-xs',
                      isActive ? 'text-slate-600' : 'text-slate-500 group-hover:text-slate-600'
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="space-y-3 border-t border-slate-200/60 p-4">
          <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20">
                <Wand2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">快速开始</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  先到设置页配置 API Key，再回到文生图页面输入提示词即可开始生成。
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                使用节奏
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">先快速出一版，再微调构图、镜头和光影关键词。</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
