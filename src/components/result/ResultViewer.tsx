import { useState } from 'react'
import { Download, RotateCw, Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImagePreview } from '@/components/image/ImagePreview'
import { cn } from '@/lib/utils'

export interface GeneratedResult {
  url: string
  width?: number
  height?: number
  format?: 'png' | 'jpeg'
}

interface ResultViewerProps {
  results: GeneratedResult[]
  onRegenerate?: () => void
  onDownloadAll?: () => void
  className?: string
}

export function ResultViewer({
  results,
  onRegenerate,
  onDownloadAll,
  className,
}: ResultViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopyUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `seedream-${Date.now()}-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (results.length === 0) {
    return null
  }

  const isMultiple = results.length > 1

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          生成结果
          {isMultiple && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({results.length} 张)
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RotateCw className="h-4 w-4 mr-2" />
              重新生成
            </Button>
          )}
          {isMultiple && onDownloadAll && (
            <Button variant="outline" size="sm" onClick={onDownloadAll}>
              <Download className="h-4 w-4 mr-2" />
              下载全部
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          'grid gap-4',
          isMultiple
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
            : 'grid-cols-1 max-w-2xl'
        )}
      >
        {results.map((result, index) => (
          <Card key={index} className="overflow-hidden group">
            <CardContent className="p-0">
              <div
                className={cn(
                  'relative',
                  isMultiple ? 'aspect-square' : 'aspect-[4/3]'
                )}
              >
                <ImagePreview
                  src={result.url}
                  alt={`生成结果 ${index + 1}`}
                  className="w-full h-full"
                />
              </div>
              <div className="p-3 flex items-center justify-between bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  {isMultiple ? `图片 ${index + 1}` : '生成图片'}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopyUrl(result.url, index)}
                    title="复制链接"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(result.url, index)}
                    title="下载图片"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => window.open(result.url, '_blank')}
                    title="新窗口打开"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
