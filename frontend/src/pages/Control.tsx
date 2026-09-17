/**
 * @file Control.tsx
 * @description AGV（無人搬送車）の操作・監視を行うメインコントロール画面。
 * タスク管理パネル、2Dマップ表示、車両ステータスカード、通知・ログパネルを統括し、
 * 各コンポーネント間で共有する状態（tasks, vehicles, logs）を管理します。
 */

import React, { useState } from 'react';
import type { Task, Vehicle, LogEntry } from '../types';
import { TaskPanel } from '../components/dashboard/TaskPanel';
import { FactoryMap } from '../components/map/FactoryMap';
import { VehicleCards } from '../components/dashboard/VehicleCards';
import { LogPanel } from '../components/dashboard/LogPanel';

export const Control: React.FC = () => {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  // 全体で共有する状態データ
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', code: 'A13-2', name: '搬送タスク', progress: 50, quantity: 10 },
  ]);

  const [vehicles] = useState<Vehicle[]>([
    { id: 'AGV-01', name: '1号機', status: '稼働中', battery: 85, task: 'A13-2', emergency: null },
    { id: 'AGV-02', name: '2号機', status: '充電中', battery: 42, task: null, emergency: null },
    { id: 'AGV-03', name: '3号機', status: '停止中', battery: 99, task: null, emergency: '障害物検知' },
  ]);

  const [logs] = useState<LogEntry[]>([
    { id: 1, message: '車両Aタスク完了', level: 'info', time: '10:00' },
    { id: 2, message: '車両B緊急停止', level: 'emergency', time: '10:05' },
  ]);

  // ハンドラー関数群
  const handleAddTask = (name: string) => {
    setTasks(prev => [...prev, {
      id: String(Date.now()),
      code: 'A13-99',
      name,
      progress: 0,
      quantity: 1,
    }]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleSelectVehicle = (vehicleId: string) => {
    console.log(`車両 ${vehicleId} がクリックされました`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px', gap: '10px', boxSizing: 'border-box', backgroundColor: '#f0f2f5' }}>
      {/* 上部エリア（サイドボタン + パネル + マップ） */}
      <div style={{ display: 'flex', flex: 1, border: '2px solid #333', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        
        {/* 開閉ボタン */}
        <div
          onClick={() => setIsTaskPanelOpen(!isTaskPanelOpen)}
          style={{ width: '32px', height: '90px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px', cursor: 'pointer', zIndex: 10, userSelect: 'none' }}
        >
          <span style={{ writingMode: 'vertical-rl', letterSpacing: '2px', fontWeight: 'bold', fontSize: '12px' }}>サイド</span>
        </div>

        {/* 担当者A：タスク管理パネル */}
        {isTaskPanelOpen && (
          <TaskPanel
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {/* 担当者B：マップ表示エリア */}
        <FactoryMap vehicles={vehicles} />
      </div>

      {/* 下部エリア（車両情報 + ログ） */}
      <div style={{ height: '180px', display: 'flex', gap: '10px' }}>
        
        {/* 担当者C：車両カード */}
        <VehicleCards
          vehicles={vehicles}
          onSelectVehicle={handleSelectVehicle}
        />

        {/* 担当者D：通知・ログ */}
        <LogPanel logs={logs} />
      </div>
    </div>
  );
};