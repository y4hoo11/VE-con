import React, { useState } from 'react';
import type { Task } from '../../types';
import styles from '../../styles/TaskPanel.module.css';

type TaskPanelProps = {
  tasks: Task[];
  onAddTask: (name: string) => void;
  onDeleteTask: (id: string) => void;
};

export const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, onAddTask, onDeleteTask }) => {
  const [iconPosition, setIconPosition] = useState<'top' | 'bottom'>('top');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [newTaskName, setNewTaskName] = useState('');

  const handleCreateTask = () => {
    if (!newTaskName.trim()) return;
    onAddTask(newTaskName);
    setNewTaskName('');
  };

  return (
    <div
      className={`${styles.container} ${
        iconPosition === 'top' ? styles.positionTop : styles.positionBottom
      }`}
    >
      {/* ==================== アイコンバーエリア ==================== */}
      <div
        className={`${styles.iconBar} ${
          iconPosition === 'top' ? styles.iconBarTop : styles.iconBarBottom
        }`}
      >
        <button
          onClick={() => setShowSettings(!showSettings)}
          title="設定"
          className={styles.iconButton}
        >
          ⚙️
        </button>

        <span title="アナウンス" className={styles.iconButton}>📢</span>
        <span title="通知" className={styles.iconButton}>🔔</span>
        <span className={styles.iconText}>その他何か</span>

        {isEditMode && <span className={styles.editBadge}>編集中</span>}
      </div>

      {/* ==================== 設定ポップアップUI ==================== */}
      {showSettings && (
        <div
          className={`${styles.settingsModal} ${
            iconPosition === 'top' ? styles.settingsModalTop : styles.settingsModalBottom
          }`}
        >
          <div className={styles.settingsHeader}>⚙️ パネル設定</div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>アイコン配置位置:</label>
            <select
              value={iconPosition}
              onChange={(e) => setIconPosition(e.target.value as 'top' | 'bottom')}
              className={styles.settingSelect}
            >
              <option value="top">上部（デフォルト）</option>
              <option value="bottom">下部</option>
            </select>
          </div>

          <div className={styles.settingRow}>
            <span>編集モード:</span>
            <input
              type="checkbox"
              checked={isEditMode}
              onChange={(e) => setIsEditMode(e.target.checked)}
              className={styles.checkbox}
            />
          </div>

          <button onClick={() => setShowSettings(false)} className={styles.closeButton}>
            閉じる
          </button>
        </div>
      )}

      {/* ==================== メイン表示エリア ==================== */}
      <div className={styles.mainContent}>
        <h3 className={styles.title}>タスク表示</h3>

        {isEditMode && (
          <div className={styles.addForm}>
            <input
              type="text"
              placeholder="新規タスク名"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className={styles.inputTask}
            />
            <button onClick={handleCreateTask} className={styles.addButton}>
              追加
            </button>
          </div>
        )}

        <div className={styles.taskList}>
          {tasks.map((t) => (
            <div key={t.id} className={styles.taskItem}>
              <div>
                <strong>{t.code}</strong> {t.name} <span className={styles.quantity}>×{t.quantity}</span>
              </div>

              {isEditMode && (
                <button onClick={() => onDeleteTask(t.id)} className={styles.deleteButton}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};