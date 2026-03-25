/**
 * 参考图上传组件
 * 支持拖拽上传和点击上传参考图片
 */

import { useState, useRef, useCallback } from "react"
import { Plus, X } from "lucide-react"

interface ReferenceImageUploadProps {
  imageUrl: string | null
  onImageSelect: (imageUrl: string | null) => void
}

export function ReferenceImageUpload({
  imageUrl,
  onImageSelect,
}: ReferenceImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          onImageSelect(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      handleFileChange(file)
    },
    [handleFileChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  // 已上传状态
  if (imageUrl) {
    return (
      <div className="relative group">
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <img
            src={imageUrl}
            alt="参考图"
            className="w-full h-full object-cover"
          />
        </div>
        {/* 删除按钮 */}
        <button
          onClick={handleRemove}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>
        {/* 标签 */}
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap">
          参考图
        </span>
      </div>
    )
  }

  // 未上传状态
  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative w-16 h-16 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
        isDragging
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
          : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <Plus className="h-5 w-5 text-slate-400" />
      <span className="text-[10px] text-slate-400 mt-0.5">参考图</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  )
}
