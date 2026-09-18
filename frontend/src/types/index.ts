/**
 * @file index.ts
 * @description アプリケーション全体で使用する共通の型定義
 */

// タスクの型定義
export interface Task {
  id: string;
  code: string;        // 例: 'TASK-01'
  name: string;        // 例: '搬送タスク'
  progress: number;    // 進捗率 (0 ~ 100)
  quantity: number;    // 個数
  priority?: number;   // 優先度
  createdAt: string;   // 追加した日 (例: '2026-06-07')
  dueDate?: string;    // 期限 (例: '2026-06-10')
}

// 車両（AGV）の型定義
export interface Vehicle {
  id: string;
  name: string;
  status?: string;
  battery: number | null;
  task: string | string[] | null;
  emergency: string | null;
}

// 通知・ログの型定義
export interface LogEntry {
  id: number;
  message: string;
  level: 'info' | 'emergency';
  time: string;
}