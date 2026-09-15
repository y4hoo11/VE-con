/**
 * @file TaskPanel.tsx
 * @description タスクの追加・削除・一覧表示を行うコンポーネント。
 * サイドパネルとして機能し、タスク状態の変更イベントを親コンポーネントへ通知します。
 */

import React from 'react';
import type { Task } from '../../types';

type TaskPanelProps = {
  tasks: Task[];
  onAddTask: (name: string) => void;
  onDeleteTask: (id: number) => void;
};

export const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, onAddTask, onDeleteTask }) => (
  <div style={{ width: '260px', borderRight: '2px solid #ccc', padding: '15px', background: '#fff' }}>
    <h3>📋 タスク管理 (仮)</h3>
    <button onClick={() => onAddTask('新規テストタスク')}>+ タスク追加テスト</button>
    <ul>
      {tasks.map(t => (
        <li key={t.id}>
          {t.name} <button onClick={() => onDeleteTask(t.id)}>✕</button>
        </li>
      ))}
    </ul>
  </div>
);