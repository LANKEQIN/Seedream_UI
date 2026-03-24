import { useState } from 'react'
import { 
  History as HistoryIcon, 
  Trash2, 
  Download, 
  Eye, 
  Image, 
  Images, 
  Layers,
  Search,
  Filter
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useHistoryStore, getHistoryStats } from '@/stores/historyStore'
import { ImagePreview } from '@/components/image/ImagePreview'
import { MODEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { GenerationResult, GenerationType } from '@/types/generation'

/**
 * 历史记录页面
 * 展示所有历史生成记录，支持筛选、搜索和详情查看
 */
export function History() {
  // 获取历史记录
  const { history, removeHistory, clearHistory } = useHistoryStore()
  
  // 统计信息
  const stats = getHistoryStats(history)
  
  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<GenerationType | 'all'>('all')
  
  // 详情弹窗
  const [selectedItem, setSelectedItem] = useState<GenerationResult | null>(null)
  
  // 删除确认
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  
  // 类型图标映射
  const typeIcons: Record<GenerationType, React.ReactNode> = {
    'text-to-image': <Image className="h-4 w-4" />,
    'image-to-image': <Images className="h-4 w-4" />,
    'series': <Layers className="h-4 w-4" />,
  }
  
  // 类型名称映射
  const typeNames: Record<GenerationType, string> = {
    'text-to-image': '文生图',
    'image-to-image': '图生图',
    'series': '组图生成',
  }
  
  // 类型颜色映射
  const typeColors: Record<GenerationType, string> = {
    'text-to-image': 'bg-blue-500',
    'image-to-image': 'bg-purple-500',
    'series': 'bg-green-500',
  }
  
  // 筛选历史记录
  const filteredHistory = history.filter((item) => {
    // 类型筛选
    if (filterType !== 'all' && item.type !== filterType) {
      return false
    }
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.prompt.toLowerCase().includes(query) ||
        MODEL_CONFIG[item.model as keyof typeof MODEL_CONFIG]?.name.toLowerCase().includes(query)
      )
    }
    return true
  })
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
  
  // 处理删除
  const handleDelete = (id: string) => {
    removeHistory(id)
  }
  
  // 处理清空
  const handleClearAll = () => {
    clearHistory()
    setShowClearConfirm(false)
  }
  
  // 处理下载
  const handleDownload = (item: GenerationResult) => {
    item.images.forEach((image, index) => {
      const link = document.createElement('a')
      link.href = image.url
      link.download = `seedream-${item.type}-${Date.now()}-${index + 1}.${image.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">历史记录</h1>
          <p className="text-muted-foreground mt-1">
            查看和管理您的生成历史
          </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清空历史
          </Button>
        )}
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">总记录数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalImages}</div>
            <div className="text-sm text-muted-foreground">生成图片数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.byType['text-to-image']}</div>
            <div className="text-sm text-muted-foreground">文生图</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.byType['image-to-image'] + stats.byType.series}</div>
            <div className="text-sm text-muted-foreground">图生图/组图</div>
          </CardContent>
        </Card>
      </div>
      
      {/* 筛选栏 */}
      {history.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索提示词或模型..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(v) => setFilterType(v as GenerationType | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="筛选类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="text-to-image">文生图</SelectItem>
                  <SelectItem value="image-to-image">图生图</SelectItem>
                  <SelectItem value="series">组图生成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 历史记录列表 */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* 图片预览 */}
                  <div className="md:w-48 lg:w-64 flex-shrink-0 bg-muted">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {item.images.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className={cn(
                            'aspect-square rounded overflow-hidden',
                            item.images.length === 1 && 'col-span-2'
                          )}
                        >
                          <img
                            src={image.url}
                            alt={`结果 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 信息区域 */}
                  <div className="flex-1 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1.5 rounded', typeColors[item.type])}>
                          {typeIcons[item.type]}
                        </div>
                        <div>
                          <Badge variant="secondary">{typeNames[item.type]}</Badge>
                          <span className="text-sm text-muted-foreground ml-2">
                            {MODEL_CONFIG[item.model as keyof typeof MODEL_CONFIG]?.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                    
                    <p className="text-sm line-clamp-2">{item.prompt}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.images.length} 张图片</span>
                      <span>{item.parameters.size}</span>
                      <span>{item.parameters.outputFormat.toUpperCase()}</span>
                      {item.parameters.watermark && <span>含水印</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : history.length > 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">未找到匹配记录</h3>
            <p className="text-muted-foreground">
              尝试更换搜索词或筛选条件
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无历史记录</h3>
            <p className="text-muted-foreground">
              开始生成图片后，记录将显示在这里
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* 详情弹窗 */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>生成详情</DialogTitle>
            <DialogDescription>
              {selectedItem && formatDate(selectedItem.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="flex flex-wrap gap-2">
                <Badge className={cn('gap-1', typeColors[selectedItem.type])}>
                  {typeIcons[selectedItem.type]}
                  {typeNames[selectedItem.type]}
                </Badge>
                <Badge variant="outline">
                  {MODEL_CONFIG[selectedItem.model as keyof typeof MODEL_CONFIG]?.name}
                </Badge>
                <Badge variant="secondary">{selectedItem.parameters.size}</Badge>
                <Badge variant="secondary">{selectedItem.parameters.outputFormat.toUpperCase()}</Badge>
              </div>
              
              {/* 提示词 */}
              <div>
                <h4 className="text-sm font-medium mb-2">提示词</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedItem.prompt}</p>
              </div>
              
              {/* 参考图片 */}
              {selectedItem.referenceImages && selectedItem.referenceImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">参考图片</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedItem.referenceImages.map((img, index) => (
                      <div key={index} className="aspect-square rounded overflow-hidden bg-muted">
                        <img
                          src={`data:image/png;base64,${img}`}
                          alt={`参考图 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 生成结果 */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  生成结果 ({selectedItem.images.length} 张)
                </h4>
                <div className={cn(
                  'grid gap-3',
                  selectedItem.images.length === 1 
                    ? 'grid-cols-1 max-w-md' 
                    : 'grid-cols-2 sm:grid-cols-3'
                )}>
                  {selectedItem.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <ImagePreview
                        src={image.url}
                        alt={`结果 ${index + 1}`}
                        className="aspect-square rounded-lg overflow-hidden"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = image.url
                            link.download = `seedream-${index + 1}.${image.format}`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                >
                  关闭
                </Button>
                <Button onClick={() => handleDownload(selectedItem)}>
                  <Download className="h-4 w-4 mr-2" />
                  下载全部
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 清空确认弹窗 */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认清空</DialogTitle>
            <DialogDescription>
              此操作将删除所有历史记录，且无法恢复。确定要继续吗？
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              确认清空
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
