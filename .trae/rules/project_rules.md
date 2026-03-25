# SeedDream_UI AI规则

## 基本
- 语言：中文 | 单文件≤2000行 | 组件单一职责

## 命名
- 组件/类型：PascalCase | Hooks：use+PascalCase | 常量：UPPER_SNAKE_CASE

## 注释
**必须**：复杂逻辑/API/类型 | **禁止**：简单getter/自解释代码

## 技术栈
React18 | TypeScript | Zustand | shadcn/ui | Tailwind | Vite | Lucide
## 目录
src/components/{ui,layout,image,generation}/, pages/, hooks/, services/, stores/, types/, lib/
**禁止**：Key硬编码或提交版本库
## 文件操作
创建前检查 → 编辑前读取 → 用SearchReplace → 删除用DeleteFile

## 命令
npm run dev/build/lint/typecheck | 完成后必须lint+typecheck

## 禁止
1. 不创建.md文档 | 2. 不生成测试 | 3. 不提交API Key | 4. 不删除未备份文件 | 5. 不添加计划外依赖

## 任务
复杂任务用TodoWrite规划 | 流程：需求→计划→执行→验证→lint/typecheck

## 特殊
约束冲突/需求变更：先告知用户再执行

## 模型
5.0-lite: doubao-seedream-5-0-lite-260128 | 4.5: doubao-seedream-4-5-251128 | 4.0: doubao-seedream-4-0-250828
记得使用两个技能，记得参考官方文档https://www.volcengine.com/docs/82379/1824121?lang=zh，https://www.volcengine.com/docs/82379/1541523?lang=zh
