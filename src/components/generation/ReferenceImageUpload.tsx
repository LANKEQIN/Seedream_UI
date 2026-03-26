/**
 * 参考图上传组件
 * 支持拖拽上传和点击上传参考图片
 * 支持多图上传（最多14张，根据官方文档）
 */

import { useState, useRef, useCallback } from "react"
import { Plus, X, ImagePlus } from "lucide-react"

// 最多支持14张参考图（官方文档限制）
const MAX_IMAGES = 14

interface ReferenceImageUploadProps {
  // 支持多图：字符串数组
  imageUrls: string[]
  onImageSelect: (imageUrls: string[]) => void
  // 最大图片数量，默认14张
  maxImages?: number
}

export function ReferenceImageUpload({
  imageUrls,
  onImageSelect,
  maxImages = MAX_IMAGES,
}: ReferenceImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 处理单个文件
  const processFile = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
          reject(new Error("不是有效的图片文件"))
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.onerror = () => reject(new Error("读取文件失败"))
        reader.readAsDataURL(file)
      })
    },
    []
  )

  // 处理多个文件
  const handleFilesChange = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      // 计算还能添加多少张图片
      const remainingSlots = maxImages - imageUrls.length
      const filesToProcess = fileArray.slice(0, remainingSlots)

      if (filesToProcess.length === 0) {
        return
      }

      try {
        const newImagePromises = filesToProcess.map((file) => processFile(file))
        const newImages = await Promise.all(newImagePromises)
        onImageSelect([...imageUrls, ...newImages])
      } catch (error) {
        console.error("处理图片失败:", error)
      }
    },
    [imageUrls, maxImages, onImageSelect, processFile]
  )

  // 拖拽处理
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFilesChange(e.dataTransfer.files)
    },
    [handleFilesChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // 点击上传
  const handleClick = () => {
    inputRef.current?.click()
  }

  // 删除单张图片
  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const newUrls = imageUrls.filter((_, i) => i !== index)
    onImageSelect(newUrls)
  }

  // 清空所有图片
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageSelect([])
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const canAddMore = imageUrls.length < maxImages

  return (
    <div className="flex flex-col gap-1">
      {/* 图片列表 */}
      <div className="flex flex-wrap gap-2">
        {/* 已上传的图片 */}
        {imageUrls.map((url, index) => (
          <div key={index} className="relative group">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <img
                src={url}
                alt={`参考图 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* 删除按钮 */}
            <button
              onClick={(e) => handleRemove(e, index)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
            {/* 序号标签 */}
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap">
              图{index + 1}
            </span>
          </div>
        ))}

        {/* 添加更多图片按钮 */}
        {canAddMore && (
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
            {imageUrls.length === 0 ? (
              <>
                <Plus className="h-5 w-5 text-slate-400" />
                <span className="text-[10px] text-slate-400 mt-0.5">参考图</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {imageUrls.length}/{maxImages}
                </span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  handleFilesChange(e.target.files)
                }
              }}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* 图片数量提示和清空按钮 */}
      {imageUrls.length > 0 && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-slate-400">
            已选 {imageUrls.length}/{maxImages} 张
          </span>
          {imageUrls.length > 1 && (
            <button
              onClick={handleClearAll}
              className="text-[10px] text-red-400 hover:text-red-500 transition-colors"
            >
              清空全部
            </button>
          )}
        </div>
      )}
    </div>
  )
}
