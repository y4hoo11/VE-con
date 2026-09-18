/**
 * @file Task.tsx
 * @description VE-com システムのタスク管理画面。
 */

import React from 'react';
import { TaskPanel } from '../components/dashboard/TaskPanel';
import styles from '../styles/Task.module.css';

export const TaskOnly: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <TaskPanel />
    </div>
  );
};