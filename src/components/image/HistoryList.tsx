import { History, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { GenerationTask } from "@/types"

interface HistoryListProps {
  history: GenerationTask[]
  onTaskClick: (task: GenerationTask) => void
  onDeleteHistory: (taskId: string, e: React.MouseEvent) => void
}

export function HistoryList({ history, onTaskClick, onDeleteHistory }: HistoryListProps) {
  if (history.length === 0) return null

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="h-4 w-4 text-slate-500" />
          最近生成
        </h3>
        <Badge variant="secondary" className="text-xs">
          {history.length} 条
        </Badge>
      </div>
      <div className="space-y-2">
        {history.slice(0, 5).map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 dark:text-slate-100 truncate">
                {task.params.prompt}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={(e) => onDeleteHistory(task.id, e)}
              className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
