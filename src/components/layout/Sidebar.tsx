import { Link, useLocation } from 'react-router-dom'
import { Home, Image, Images, History, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: '首页', icon: Home, description: '工作台概览' },
  { path: '/text-to-image', label: '文生图', icon: Image, description: '文字描述生成图片' },
  { path: '/image-to-image', label: '图生图', icon: Images, description: '参考图生成新图' },
  { path: '/series', label: '组图生成', icon: Sparkles, description: '生成系列关联图片' },
  { path: '/history', label: '历史记录', icon: History, description: '查看生成历史' },
  { path: '/settings', label: '设置', icon: Settings, description: 'API配置与偏好' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-5 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Seedream Studio</h1>
            <p className="text-xs text-muted-foreground">火山方舟图片生成平台</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                'hover:shadow-sm',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              title={item.description}
            >
              <Icon className={cn('h-4 w-4', isActive && 'animate-pulse')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          <p>Powered by</p>
          <p className="font-medium text-foreground">火山方舟 Seedream</p>
        </div>
      </div>
    </aside>
  )
}
