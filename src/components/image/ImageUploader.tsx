import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IMAGE_FILE_EXTENSIONS, MAX_IMAGE_SIZE } from '@/lib/constants'

export interface ImageFile {
  id: string
  file: File
  preview: string
}

interface ImageUploaderProps {
  value?: ImageFile[]
  onChange: (files: ImageFile[]) => void
  maxFiles?: number
  className?: string
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 1,
  className,
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)

      if (value.length + acceptedFiles.length > maxFiles) {
        setError(`最多只能上传 ${maxFiles} 张图片`)
        return
      }

      const newFiles: ImageFile[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }))

      onChange([...value, ...newFiles])
    },
    [value, onChange, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': IMAGE_FILE_EXTENSIONS.map((ext) => `.${ext}`),
    },
    maxSize: MAX_IMAGE_SIZE,
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles,
  })

  const handleRemove = (id: string) => {
    const fileToRemove = value.find((f) => f.id === id)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    onChange(value.filter((f) => f.id !== id))
    setError(null)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-accent/50',
          isDragActive && 'border-primary bg-accent',
          value.length >= maxFiles && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div
            className={cn(
              'p-3 rounded-full transition-colors',
              isDragActive ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <Upload
              className={cn(
                'h-6 w-6',
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? '松开以上传图片' : '拖拽图片到此处或点击上传'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              支持 {IMAGE_FILE_EXTENSIONS.join(', ').toUpperCase()} 格式，最大 10MB
              {maxFiles > 1 && `，最多 ${maxFiles} 张`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((imageFile) => (
            <div
              key={imageFile.id}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <img
                src={imageFile.preview}
                alt="预览"
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(imageFile.preview)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(imageFile.id)}
                  className="p-1.5 rounded-full bg-white/90 text-destructive hover:bg-white transition-colors"
                  title="移除图片"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-xs text-white truncate">
                  {imageFile.file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && maxFiles > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>暂无图片</span>
        </div>
      )}
    </div>
  )
}
