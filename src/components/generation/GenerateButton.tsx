/**
 * 生成按钮组件
 */

import { Wand2, Loader2 } from "lucide-react"
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
    <Button
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-12 text-base font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 animate-gradient transition-all duration-300"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          生成中...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" />
          开始生成
        </>
      )}
    </Button>
  )
}
