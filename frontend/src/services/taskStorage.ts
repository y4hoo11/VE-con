/**
 * @file taskStorage.ts
 * @description タスクデータの永続化とコンポーネント間同期サービス (PostgreSQL / バックエンド API 連携版)
 */

import type { Task } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/tasks';
const EVENT_NAME = 'vecom_tasks_updated';

/**
 * 変更通知を発行してローカル上の他コンポーネントに最新タスク一覧を配る内部ヘルパー
 */
const notifyUpdates = async () => {
  const tasks = await getStoredTasks();
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: tasks }));
  return tasks;
};

// 【参照】バックエンドDBからタスク一覧を取得
export const getStoredTasks = async (): Promise<Task[]> => {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch tasks from server');
    return await res.json();
  } catch (e) {
    console.error('Failed to get tasks:', e);
    return [];
  }
};

// 【保存（追加）】バックエンドDBへタスクを追加
export const addStoredTask = async (taskData: {
  name: string;
  quantity: number;
  priority: number;
  dueDate?: string;
}): Promise<Task[]> => {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to add task');

    // DB追加完了後、他コンポーネントへ最新一覧を通知
    return await notifyUpdates();
  } catch (e) {
    console.error('Failed to add task:', e);
    return await getStoredTasks();
  }
};

// 【削除】バックエンドDBからタスクを削除
export const deleteStoredTask = async (id: string): Promise<Task[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');

    // DB削除完了後、他コンポーネントへ最新一覧を通知
    return await notifyUpdates();
  } catch (e) {
    console.error('Failed to delete task:', e);
    return await getStoredTasks();
  }
};

// 【同期用フック用】変更の購読
export const subscribeTasks = (callback: (tasks: Task[]) => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<Task[]>;
    callback(customEvent.detail);
  };

  window.addEventListener(EVENT_NAME, handler);

  // 初回ロード時に最新データをDBから取得して反映
  getStoredTasks().then(callback);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
};