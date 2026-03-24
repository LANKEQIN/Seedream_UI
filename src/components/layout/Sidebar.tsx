import { Link, useLocation } from 'react-router-dom'
import { Home, Image, Images, History, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// 导航项配置
const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/text-to-image', label: '文生图', icon: Image },
  { path: '/image-to-image', label: '图生图', icon: Images },
  { path: '/series', label: '组图生成', icon: Sparkles },
  { path: '/history', label: '历史记录', icon: History },
  { path: '/settings', label: '设置', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-56 bg-white border-r h-full flex flex-col">
      {/* Logo 区域 */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Seedream Studio</h1>
          </div>
        </div>
      </div>
      
      {/* 导航菜单 */}
      <nav className="flex-1 p-3 space-y-0.5">
        <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          体验中心
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
