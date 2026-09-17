/**
 * @file index.ts
 * @description アプリケーション全体で使用する共通の型定義（Task, Vehicle）を集約・エクスポートするファイル。
 * index.tsは参照時に指定しなくてもデフォルトで見つけられる名前
 */

// タスクの型定義
export interface Task {
  id: string;
  code: string;      // 例: 'A13-2'
  name: string;      // 例: '搬送タスク'
  progress: number;  // 進捗率 (例: 0 ~ 100)
  quantity: number;  // 個数 (例: 10)
  priority?: number; // 優先度
}

// 車両の型定義
export type Vehicle = {
  id: string;
  status: string;
  battery: string;
};