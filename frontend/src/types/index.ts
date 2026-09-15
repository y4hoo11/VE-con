/**
 * @file index.ts
 * @description アプリケーション全体で使用する共通の型定義（Task, Vehicle）を集約・エクスポートするファイル。
 * index.tsは参照時に指定しなくてもデフォルトで見つけられる名前
 */

// タスクの型定義
export type Task = {
  id: number;
  name: string;
  status: string;
};

// 車両の型定義
export type Vehicle = {
  id: string;
  status: string;
  battery: string;
};