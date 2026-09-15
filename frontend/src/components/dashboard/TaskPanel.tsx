/**
 * @file TaskPanel.tsx
 * @description タスク表示・管理パネルコンポーネント。
 * 設定（⚙️）により、アイコンバーの上下配置切り替えおよび操作モード（通常/追加/削除）の切替が可能です。
 */

import React, { useState } from 'react';
import type { Task } from '../../types';
import styles from '../../styles/TaskPanel.module.css';

type TaskPanelProps = {
  tasks: Task[];
  onAddTask: (name: string, quantity: number) => void;
  onDeleteTask: (id: string) => void;
};

// 操作モードの定義 ('normal': 閲覧のみ, 'add': 追加可能, 'delete': 削除可能)
type PanelMode = 'normal' | 'add' | 'delete';

export const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, onAddTask, onDeleteTask }) => {
  // アイコンバーの位置設定 ('top' | 'bottom')
  const [iconPosition, setIconPosition] = useState<'top' | 'bottom'>('top');
  
  // 操作モードの状態 ('normal': 通常, 'add': 追加モード, 'delete': 削除モード)
  const [mode, setMode] = useState<PanelMode>('normal');

  // 設定メニュー（簡易モーダル/ドロップダウン風）の開閉
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // 新規タスク入力用
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskQuantity, setNewTaskQuantity] = useState<number>(1);

  const handleCreateTask = () => {
    if (!newTaskName.trim()) return;
    onAddTask(newTaskName, newTaskQuantity);
    setNewTaskName('');
    setNewTaskQuantity(1); // デフォルト値に戻す
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
        {/* 設定ボタン（クリックで設定パネル開閉） */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          title="設定"
          className={styles.iconButton}
        >
          ⚙️
        </button>

        {/* メガホン */}
        <span title="アナウンス" className={styles.iconButton}>📢</span>

        {/* ベル */}
        <span title="通知" className={styles.iconButton}>🔔</span>

        {/* その他機能 */}
        <span className={styles.iconText}>その他</span>

        {/* 現在のモードバッジ表示 */}
        {mode === 'add' && (
          <span className={`${styles.modeBadge} ${styles.badgeAdd}`}>追加モード</span>
        )}
        {mode === 'delete' && (
          <span className={`${styles.modeBadge} ${styles.badgeDelete}`}>削除モード</span>
        )}
      </div>

      {/* ==================== 設定ポップアップUI ==================== */}
      {showSettings && (
        <div
          className={`${styles.settingsModal} ${
            iconPosition === 'top' ? styles.settingsModalTop : styles.settingsModalBottom
          }`}
        >
          <div className={styles.settingsHeader}>⚙️ パネル設定</div>

          {/* アイコン位置切り替え */}
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

          {/* 操作モード選択（通常 / 追加 / 削除） */}
          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>操作モード選択:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="panelMode"
                  value="normal"
                  checked={mode === 'normal'}
                  onChange={() => setMode('normal')}
                />
                通常（閲覧のみ）
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="panelMode"
                  value="add"
                  checked={mode === 'add'}
                  onChange={() => setMode('add')}
                />
                ➕ 追加モード
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="panelMode"
                  value="delete"
                  checked={mode === 'delete'}
                  onChange={() => setMode('delete')}
                />
                🗑️ 削除モード
              </label>
            </div>
          </div>

          <button onClick={() => setShowSettings(false)} className={styles.closeButton}>
            閉じる
          </button>
        </div>
      )}

      {/* ==================== メイン表示エリア（タスク表示） ==================== */}
      <div className={styles.mainContent}>
        <h3 className={styles.title}>タスク表示</h3>

        {/* 追加モード時のみ：新規タスク追加フォーム（名前・個数）を表示 */}
        {mode === 'add' && (
          <div className={styles.addForm}>
            <input
              type="text"
              placeholder="タスク名"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
              className={styles.inputTask}
            />
            <input
              type="number"
              min="1"
              placeholder="個数"
              value={newTaskQuantity}
              onChange={(e) => setNewTaskQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
              className={styles.inputQuantity}
            />
            <button onClick={handleCreateTask} className={styles.addButton}>
              追加
            </button>
          </div>
        )}

        {/* タスク一覧 */}
        <div className={styles.taskList}>
          {tasks.map((t) => (
            <div key={t.id} className={styles.taskItem}>
              <div>
                <strong>{t.code}</strong> {t.name}{' '}
                <span className={styles.quantity}>×{t.quantity}</span>
              </div>

              {/* 削除モード時のみ：削除ボタンを表示 */}
              {mode === 'delete' && (
                <button
                  onClick={() => onDeleteTask(t.id)}
                  className={styles.deleteButton}
                  title="タスクを削除"
                >
                  ✕ 削除
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};