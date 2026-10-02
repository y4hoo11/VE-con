// src/types/index.ts

// タスクの型定義
export interface Task {
  id: string;
  code: string;       // 例: 'TASK-01'
  name: string;       // 例: '搬送タスク'
  progress: number;   // 進捗率 (0 ~ 100)
  quantity: number;   // 個数
  priority?: number;  // 優先度
}

// 車両（AGV）の型定義
export interface Vehicle {
  id: string;
  name: string;                   // 車両名
  status?: string;                // 状態
  battery: number | null;         // バッテリー残量
  task: string | string[] | null; // しているタスク
  emergency: string | null;       // 緊急通知
}

// 通知・ログの型定義
export interface LogEntry {
  id: number;
  message: string;
  level: 'info' | 'emergency';
  time: string;
}