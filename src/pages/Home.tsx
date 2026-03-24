import { Link } from 'react-router-dom'
import { Image, Sparkles } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// 模型信息
const models = [
  {
    id: 'doubao-seedream-4-5-251208',
    name: 'Doubao-Seedream-4.5',
    version: '251208',
    isLatest: true,
  },
]

// 示例图片
const examples = [
  'https://via.placeholder.com/200x200/e2e8f0/64748b?text=示例1',
  'https://via.placeholder.com/200x200/e2e8f0/64748b?text=示例2',
  'https://via.placeholder.com/200x200/e2e8f0/64748b?text=示例3',
  'https://via.placeholder.com/200x200/e2e8f0/64748b?text=示例4',
  'https://via.placeholder.com/200x200/e2e8f0/64748b?text=示例5',
]

export function Home() {
  return (
    <div className="min-h-full">
      {/* 顶部模型选择区域 */}
      <div className="bg-white border-b">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs defaultValue="vision" className="w-auto">
                <TabsList className="bg-slate-100 h-8">
                  <TabsTrigger value="vision" className="text-xs h-7 px-3">
                    视觉模型
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="text-xs h-7 px-3">
                    语音分类
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  视频生成
                </span>
                <span className="text-xs text-slate-500">智能影像，视界无限</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Card className="border-violet-400 bg-violet-50">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                  <div className="text-xs">
                    <div className="font-medium text-slate-800">图片生成</div>
                    <div className="text-slate-500">Doubao图片生成</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="px-8 py-6">
        {/* 模型信息栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border">
              {models.map((model) => (
                <div key={model.id} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{model.name}</span>
                  <span className="text-xs text-slate-400">{model.version}</span>
                  {model.isLatest && (
                    <Badge variant="secondary" className="h-5 text-[10px]">
                      251208
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            <button className="text-xs text-slate-500 hover:text-slate-700">
              模型参数
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" className="rounded" />
              仅看收藏
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" className="rounded" checked />
              图片模型
            </label>
            <select className="text-xs border rounded px-2 py-1 bg-white">
              <option>全部</option>
            </select>
            <select className="text-xs border rounded px-2 py-1 bg-white">
              <option>生活应用</option>
            </select>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="bg-white rounded-2xl p-8">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              体验图片生成，让创意摇动
            </h1>
          </div>

          {/* 生成卡片 */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Image className="h-5 w-5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">高分辨率图片</span>
              </div>
              
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    生成成图
                  </button>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <button className="text-xs text-slate-500">4K</button>
                  <button className="text-xs text-slate-500">智能比例</button>
                  <button className="text-xs text-slate-500">2张</button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">2 / 217 张</span>
                  <button className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <span className="text-xs">↑</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 示例图片 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button className="text-sm text-slate-500 flex items-center gap-1">
                试试以下示例
                <span className="text-lg">↑</span>
              </button>
              <button className="text-xs text-slate-400 flex items-center gap-1">
                展示训练魔箱
                <span className="text-sm">↑</span>
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {examples.map((src, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                  <img src={src} alt={`示例${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <p>提示模型内容均由人工智能模型生成，不代表平台立场</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="#" className="hover:text-slate-600">免责声明</Link>
            <Link to="#" className="hover:text-slate-600">测试协议</Link>
            <Link to="#" className="hover:text-slate-600">隐私政策</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
