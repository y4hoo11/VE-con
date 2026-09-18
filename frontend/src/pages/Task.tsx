import React, { useState } from 'react';
import type { Task } from '../types';
import styles from '../styles/TaskPanel.module.css';

export const TaskOnly: React.FC = () => {
  // 今日の日付を取得するヘルパー (YYYY-MM-DD)
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

  // 入力フォーム用のステート
  const [inputName, setInputName] = useState('');
  const [inputQuantity, setInputQuantity] = useState<number>(1);
  const [inputPriority, setInputPriority] = useState<number>(1);
  const [inputDueDate, setInputDueDate] = useState('');

  // タスク追加ハンドラー
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    const newTask: Task = {
      id: String(Date.now()),
      code: `TSK-${Math.floor(10 + Math.random() * 90)}`,
      name: inputName,
      progress: 0,
      quantity: inputQuantity,
      priority: inputPriority,
      createdAt: getTodayString(),
      dueDate: inputDueDate || undefined,
    };

    setTasks((prev) => [...prev, newTask]);
    
    // フォームをリセット
    setInputName('');
    setInputQuantity(1);
    setInputPriority(1);
    setInputDueDate('');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'stretch', backgroundColor: '#f0f2f5', boxSizing: 'border-box' }}>
      <div style={{ width: '320px', padding: '12px', background: '#fff', borderRight: '2px solid #ccc', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>タスク管理</h2>

        {/* 追加フォーム */}
        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              placeholder="タスク名"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className={styles.inputTask}
            />
            {/* 個数入力と「個」を横並びにするグループ */}
            <div className={styles.quantityInputGroup}>
              <input
                type="number"
                placeholder="個数"
                value={inputQuantity}
                min={1}
                onChange={(e) => setInputQuantity(Number(e.target.value))}
                className={styles.inputQuantity}
              />
              <span className={styles.unitText}>個</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', fontSize: '12px', alignItems: 'center' }}>
            <label style={{ fontSize: '11px' }}>優先度:</label>
            <input
              type="number"
              value={inputPriority}
              min={1}
              max={5}
              onChange={(e) => setInputPriority(Number(e.target.value))}
              style={{ width: '50px', padding: '4px' }}
            />
            <label style={{ fontSize: '11px', marginLeft: 'auto' }}>期限:</label>
            <input
              type="date"
              value={inputDueDate}
              onChange={(e) => setInputDueDate(e.target.value)}
              style={{ padding: '2px', fontSize: '11px' }}
            />
          </div>

          <button type="submit" style={{ padding: '6px', fontSize: '12px', cursor: 'pointer', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '3px' }}>
            タスクを追加
          </button>
        </form>

        {/* タスク一覧 */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', border: '1px solid #eee', borderRadius: '4px', background: '#f9f9f9', fontSize: '13px' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{task.name} <span style={{ fontSize: '10px', color: '#888' }}>({task.code})</span></div>
                <div style={{ fontSize: '11px', color: '#666', display: 'flex', gap: '8px', marginTop: '2px' }}>
                  <span>個数: {task.quantity}</span>
                  {task.priority && <span>優先度: {task.priority}</span>}
                  {task.dueDate && <span>期限: {task.dueDate}</span>}
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>追加日: {task.createdAt}</div>
              </div>
              <button onClick={() => handleDeleteTask(task.id)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontSize: '10px', height: 'fit-content' }}>
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};