import { Link } from 'react-router-dom'
import { Image, Images, Globe, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const quickActions = [
  {
    title: '文生图',
    description: '输入文本提示词，生成单张高质量图片',
    icon: Image,
    path: '/text-to-image',
    color: 'bg-blue-500',
  },
  {
    title: '图生图',
    description: '基于参考图片，生成新的创作内容',
    icon: Images,
    path: '/image-to-image',
    color: 'bg-purple-500',
  },
  {
    title: '组图生成',
    description: '基于参考图生成一组关联图片',
    icon: Images,
    path: '/series',
    color: 'bg-green-500',
  },
  {
    title: '联网搜索',
    description: '融合实时网络信息进行生成（仅5.0-lite）',
    icon: Globe,
    path: '/text-to-image',
    color: 'bg-orange-500',
  },
]

export function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">欢迎使用 Seedream Studio</h1>
        <p className="text-muted-foreground mt-2">
          火山方舟 Seedream 图片生成平台，轻松创作高质量图片
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} to={action.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-primary">
                      开始使用 <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">支持的功能</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-semibold">文生图</div>
                <div className="text-sm text-muted-foreground">文本 → 图片</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-semibold">图生图</div>
                <div className="text-sm text-muted-foreground">图片 → 新图片</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-semibold">组图生成</div>
                <div className="text-sm text-muted-foreground">1-15张关联图</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-semibold">联网搜索</div>
                <div className="text-sm text-muted-foreground">实时信息融合</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">模型版本</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-semibold">Seedream 5.0-lite</div>
                  <div className="text-sm text-muted-foreground">最新模型，支持联网搜索</div>
                </div>
                <div className="text-sm text-muted-foreground">260128</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-semibold">Seedream 4.5</div>
                  <div className="text-sm text-muted-foreground">高品质输出</div>
                </div>
                <div className="text-sm text-muted-foreground">251128</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-semibold">Seedream 4.0</div>
                  <div className="text-sm text-muted-foreground">基础版本</div>
                </div>
                <div className="text-sm text-muted-foreground">250828</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}