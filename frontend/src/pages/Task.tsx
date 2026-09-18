/**
 * @file Task.tsx
 * @description VE-com システムのタスク管理画面。
 */

import React, { useState } from 'react';
import type { Task } from '../types';
import { TaskPanel } from '../components/dashboard/TaskPanel';
import styles from '../styles/Task.module.css';

export const TaskOnly: React.FC = () => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      code: 'A13-2', 
      name: '搬送タスク', 
      progress: 50, 
      quantity: 10, 
      priority: 1, 
      createdAt: '2026-06-01', 
      dueDate: '2026-06-05' 
    },
  ]);

  const handleAddTask = (newTaskData: { name: string; quantity: number; priority: number; dueDate?: string }) => {
    const newTask: Task = {
      id: String(Date.now()),
      code: `TSK-${Math.floor(10 + Math.random() * 90)}`,
      name: newTaskData.name,
      progress: 0,
      quantity: newTaskData.quantity,
      priority: newTaskData.priority,
      createdAt: getTodayString(),
      dueDate: newTaskData.dueDate,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className={styles.pageWrapper}>
      <TaskPanel
        tasks={tasks}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};