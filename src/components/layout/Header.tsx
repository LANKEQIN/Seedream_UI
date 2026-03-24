import { Sun, Moon, Monitor, Key, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Theme } from '@/stores/settingsStore'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
}

const themeIcons: Record<Theme, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
}

const themeLabels: Record<Theme, string> = {
  light: '浅色模式',
  dark: '深色模式',
  system: '跟随系统',
}

export function Header({ title }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const hasApiKey = useSettingsStore((state) => state.hasApiKey())

  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold">{title || 'Seedream Studio'}</h2>
        
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
              hasApiKey
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
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

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={themeLabels[theme]}
            className="h-9 w-9"
          >
            {themeIcons[theme]}
          </Button>
        </div>
      </div>
    </header>
  )
}
