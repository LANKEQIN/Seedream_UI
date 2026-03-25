/**
 * 生成按钮组件
 * 精致的渐变效果和动效设计
 */

import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GenerateButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function GenerateButton({
  onClick,
  loading = false,
  disabled = false,
}: GenerateButtonProps) {
  return (
    <div className="relative group">
      {/* 按钮外发光效果 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-300" />

      {/* 按钮 */}
      <Button
        size="lg"
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full h-14 text-base font-semibold relative overflow-hidden rounded-xl border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"

        style={{
          background: disabled || loading
            ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          boxShadow: disabled || loading
            ? '0 4px 15px -3px rgba(100, 116, 139, 0.3)'
            : '0 4px 20px -5px rgba(99, 102, 241, 0.4), 0 8px 40px -10px rgba(139, 92, 246, 0.3)',
        }}
      >
        {/* 背景动画效果 */}
        {!disabled && !loading && (
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
            <div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient"
              style={{ backgroundSize: '200% 200%' }}
            />
            {/* 光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* 按钮内容 */}
        {loading ? (
          <>
            <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
            <span className="relative z-10">生成中...</span>
          </>
        ) : (
          <>
            <div className="relative z-10 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>开始生成</span>
            </div>
          </>
        )}
      </Button>

      {/* 禁用状态的微妙动画 */}
      {disabled && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground/50">输入提示词以开始</span>
        </div>
      )}
    </div>
  )
}
