/**
 * 历史记录状态管理
 * 用于持久化存储生成历史和当前任务
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GenerationTask } from "@/types"

interface HistoryState {
  // 当前任务
  currentTask: GenerationTask | null
  // 历史记录列表
  history: GenerationTask[]
  // 设置当前任务（支持函数式更新）
  setCurrentTask: (task: GenerationTask | null | ((prev: GenerationTask | null) => GenerationTask | null)) => void
  // 添加历史记录
  addHistory: (task: GenerationTask) => void
  // 删除历史记录
  deleteHistory: (taskId: string) => void
  // 清空所有历史记录
  clearHistory: () => void
}

const STORAGE_KEY = "seeddream-history"

// 最大保存的历史记录数量
const MAX_HISTORY_SIZE = 50

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      currentTask: null,
      history: [],
      setCurrentTask: (task) =>
        set((state) => ({
          currentTask:
            typeof task === "function"
              ? (task as (prev: GenerationTask | null) => GenerationTask | null)(state.currentTask)
              : task,
        })),
      addHistory: (task) =>
        set((state) => {
          // 将新任务添加到历史记录开头，并限制最大数量
          const newHistory = [task, ...state.history].slice(0, MAX_HISTORY_SIZE)
          return { history: newHistory }
        }),
      deleteHistory: (taskId) =>
        set((state) => ({
          history: state.history.filter((task) => task.id !== taskId),
          // 如果删除的是当前任务，清空当前任务
          currentTask:
            state.currentTask?.id === taskId ? null : state.currentTask,
        })),
      clearHistory: () => set({ history: [], currentTask: null }),
    }),
    {
      name: STORAGE_KEY,
      // 自定义序列化，处理 Date 对象等
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)
