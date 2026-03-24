import { useState } from 'react'
import { ZoomIn, Download, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImagePreviewProps {
  src: string
  alt?: string
  className?: string
  onDownload?: () => void
  onRegenerate?: () => void
}

export function ImagePreview({
  src,
  alt = '生成的图片',
  className,
  onDownload,
  onRegenerate,
}: ImagePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleDownload = () => {
    if (onDownload) {
      onDownload()
      return
    }

    const link = document.createElement('a')
    link.href = src
    link.download = `seedream-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className={cn('relative group rounded-lg overflow-hidden border bg-muted', className)}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsZoomed(true)}
              title="放大查看"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            {onDownload !== null && (
              <Button
                variant="secondary"
                size="icon"
                onClick={handleDownload}
                title="下载图片"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {onRegenerate && (
              <Button
                variant="secondary"
                size="icon"
                onClick={onRegenerate}
                title="重新生成"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
