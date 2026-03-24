import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Clock3,
  History,
  Home,
  Image,
  Images,
  Settings,
  Sparkles,
  Wand2,
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
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-slate-200 bg-[#f3f5fb] lg:block">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-b border-slate-200 px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold text-slate-900">体验中心</h1>
              </div>
              <p className="mt-1 text-xs text-slate-500">火山方舟图片平台</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Studio</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">视觉模型</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">文生图、图生图与组图生成</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-400">Flow</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">快速创作</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">接近官网控制台的轻量布局</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          <div className="flex items-center justify-between px-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
            <span>模型体验</span>
            <span>6</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200',
                  isActive
                    ? 'border-slate-200 bg-white text-slate-950 shadow-sm'
                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/70 hover:text-slate-900'
                )}
              >
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors',
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-400 ring-1 ring-slate-200 group-hover:text-slate-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{item.label}</span>
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform',
                        isActive ? 'text-slate-400' : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500'
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      'mt-1 truncate text-xs',
                      isActive ? 'text-slate-500' : 'text-slate-500 group-hover:text-slate-600'
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="space-y-4 border-t border-slate-200 p-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Wand2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">快速开始</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  先到设置页配置 API Key，再回到文生图页面输入提示词即可开始生成。
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Clock3 className="h-3.5 w-3.5" />
                使用节奏
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">先快速出一版，再微调构图、镜头和光影关键词。</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Sparkles className="h-3.5 w-3.5" />
                产出方式
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">把高频操作集中到首屏，避免在多个卡片之间来回切换。</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
