/**
 * @file Task.tsx
 * @description タスクパネルのみを画面いっぱいに表示する専用ページコンポーネント。
 */

import React, { useState } from 'react';
import type { Task } from '../types';
import { TaskPanel } from '../components/dashboard/TaskPanel';

export const TaskOnly: React.FC = () => {
  // タスクの状態管理
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', code: 'A13-2', name: '搬送タスク', progress: 50, quantity: 10 },
    { id: '2', code: 'B23-4', name: '部品回収', progress: 0, quantity: 8 },
  ]);

  // タスク追加ハンドラー
  const handleAddTask = (name: string) => {
    setTasks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        code: 'NEW-01',
        name,
        progress: 0,
        quantity: 1,
      },
    ]);
  };

  // タスク削除ハンドラー
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#f0f2f5',
        boxSizing: 'border-box',
      }}
    >
      {/* 画面左上（または中央など）にタスクパネルのみを配置 */}
      <TaskPanel
        tasks={tasks}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};