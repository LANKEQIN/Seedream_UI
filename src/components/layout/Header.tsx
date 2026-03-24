import { Key, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'

export function Header() {
  const hasApiKey = useSettingsStore((state) => state.hasApiKey())

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-slate-500">
            火山方舟图片生成平台
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs',
              hasApiKey
                ? 'bg-green-50 text-green-700'
                : 'bg-amber-50 text-amber-700'
            )}
          >
            <Key className="h-3.5 w-3.5" />
            {hasApiKey ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>API已配置</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>未配置API</span>
              </>
            )}
          </div>
          
          <Button variant="secondary" size="sm" className="text-xs h-8">
            体验文档
          </Button>
          <Button size="sm" className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700">
            API 接入
          </Button>
        </div>
      </div>
    </header>
  )
}
