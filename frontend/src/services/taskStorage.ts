/**
 * @file taskStorage.ts
 * @description タスクデータの永続化とコンポーネント間同期サービス
 */

import type { Task } from '../types';

const STORAGE_KEY = 'vecom_tasks_data';
const EVENT_NAME = 'vecom_tasks_updated';

// 初期化用デフォルトデータ
const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    code: 'A13-2',
    name: '搬送タスク',
    progress: 50,
    quantity: 10,
    priority: 1,
    createdAt: '2026-06-01',
    dueDate: '2026-06-05',
  },
];

// 【参照】タスク一覧取得
export const getStoredTasks = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse tasks', e);
    return DEFAULT_TASKS;
  }
};

// 【保存（追加）】タスク追加
export const addStoredTask = (taskData: { name: string; quantity: number; priority: number; dueDate?: string }): Task[] => {
  const current = getStoredTasks();
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const newTask: Task = {
    id: String(Date.now()),
    code: `TSK-${Math.floor(10 + Math.random() * 90)}`,
    name: taskData.name,
    progress: 0,
    quantity: taskData.quantity,
    priority: taskData.priority,
    createdAt: getTodayString(),
    dueDate: taskData.dueDate,
  };

  const updated = [...current, newTask];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // 他のコンポーネントへ同期通知を発行
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  return updated;
};

// 【削除】タスク削除
export const deleteStoredTask = (id: string): Task[] => {
  const current = getStoredTasks();
  const updated = current.filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 他のコンポーネントへ同期通知を発行
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  return updated;
};

// 【同期用フック用】変更の購読
export const subscribeTasks = (callback: (tasks: Task[]) => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<Task[]>;
    callback(customEvent.detail);
  };

  window.addEventListener(EVENT_NAME, handler);
  // 他のタブ/ウィンドウでの変更も検知
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredTasks());
    }
  });

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
};