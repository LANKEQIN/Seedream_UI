import { Loader2, Sparkles } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GenerationButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
  text?: string
}

export function GenerationButton({
  isLoading = false,
  loadingText = '生成中...',
  text = '开始生成',
  className,
  disabled,
  ...props
}: GenerationButtonProps) {
  return (
    <Button
      className={cn('w-full gap-2', className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {text}
        </>
      )}
    </Button>
  )
}
