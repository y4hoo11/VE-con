import { useState } from 'react';

//　タスクの型定義(仮)
export type Task = {
  id: number;
  name: string;
  status: string;
};

//車両のIDやバッテリーのステータスの定義　（型とかは自由に変更して）

export type Vehicle = {
  id: string;
  status: string;
  battery: string;
};

// 届いたら別ファイルから import して置き換えて～

//タスク管理の模擬コンポーネント
const TaskPanel = ({ tasks, onAddTask, onDeleteTask }: { 
  tasks: Task[]; 
  onAddTask: (name: string) => void; 
  onDeleteTask: (id: number) => void; 
}) => (
  <div style={{ width: '260px', borderRight: '2px solid #ccc', padding: '15px', background: '#fff' }}>
    <h3>📋 タスク管理 (仮)</h3>
    <button onClick={() => onAddTask('新規テストタスク')}>+ タスク追加テスト</button>
    <ul>
      {tasks.map(t => (
        <li key={t.id}>{t.name} <button onClick={() => onDeleteTask(t.id)}>✕</button></li>
      ))}
    </ul>
  </div>
);
//マップ（岡西）
const FactoryMap = ({ vehicles }: { vehicles: Vehicle[] }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eaeaea' }}>
    <p>🗺️ 2Dマップエリア (仮) - 稼働車両数: {vehicles.length}台</p>
  </div>
);

const VehicleCards = ({ vehicles, onSelectVehicle }: { 
  vehicles: Vehicle[]; 
  onSelectVehicle: (id: string) => void; 
}) => (
  <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
    {vehicles.map(v => (
      <div 
        key={v.id} 
        onClick={() => onSelectVehicle(v.id)}
        style={{ border: '2px solid #333', background: '#fff', padding: '10px', cursor: 'pointer' }}
      >
        <h3>{v.id}</h3>
        <p>ステータス: {v.status}</p>
        <p>バッテリー: {v.battery}</p>
      </div>
    ))}
  </div>
);

//通知(誰か忘れた)
const LogPanel = ({ logs }: { logs: string[] }) => (
  <div style={{ flex: 1, border: '2px solid #333', background: '#fff', padding: '10px', overflowY: 'auto' }}>
    <h4>🔔 通知・ログ (仮)</h4>
    {logs.map((log, i) => <div key={i}>{log}</div>)}
  </div>
);



// --- メイン枠組み（App） ---
export default function App() {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  // 全体で共有する状態データ
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'A13-2搬送 ×10', status: '進行中' },
  ]);
  const [vehicles] = useState<Vehicle[]>([
    { id: 'AGV-01', status: '稼働中', battery: '85%' },
    { id: 'AGV-02', status: '充電中', battery: '42%' },
    { id: 'AGV-03', status: 'サボりなう', battery: '99%' },
  ]);
  const [logs] = useState<string[]>([
    '・車両Aタスク完了',
    '・車両B緊急停止',
  ]);

  // 他メンバーの機能と連携するためのハンドラー関数群
  const handleAddTask = (name: string) => {
    setTasks(prev => [...prev, { id: Date.now(), name, status: '待機中' }]);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleSelectVehicle = (vehicleId: string) => {
    console.log(`車両 ${vehicleId} がクリックされました`);
    // 他メンバーが作成した詳細表示関数などをここで呼び出す
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px', gap: '10px', boxSizing: 'border-box', backgroundColor: '#f0f2f5' }}>
      
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
}