import { useState } from 'react';

//タスクの型定義(仮)
export type Task = {
  id: number;
  name: string;
  status: string;
};

// 車両の型定義
// ▼ここから大國(車両情報)が変更
// 元は { id, status, battery: string } だったが、
// タスク・緊急情報を持てるようにするため以下の形に変更した。
export type Vehicle = {
  id: string;
  name: string;                    // 車両名(表示用)
  battery: number | null;          // 0〜100の数値。まだ受信していない場合は null
  task: string | string[] | null;
  emergency: string | null;  // 緊急事態に関する情報。null=緊急事態なし
};
// ▲ここまで大國(車両情報)が変更

// 通知・ログの型定義
// ▼ここから大國(通知・ログ)が変更
// 元は文字列だけの配列だったが、種別(通常/緊急)と時刻を持たせて
// 車両情報パネルと近い配色で色分け表示できるようにした。
export type LogEntry = {
  id: number;
  message: string;
  level: 'info' | 'emergency'; // 表示色の切り替えに使うだけ。判定ロジックはここでは持たない
  time: string;                // 表示用の時刻文字列(例: "14:32")。渡された値をそのまま表示
};
// ▲ここまで大國(通知・ログ)が変更

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

// ▼ここから大國(車両情報)が変更: VehicleCards本体
//
// - タスクの中身(task)は自分で割り当てない。渡された値をそのまま表示するだけ。
// - バッテリー残量(battery)も車両側から届いた値をそのまま表示するだけ。
// - 緊急ステータスは平常時グレー/緊急時に赤く変わる。カードの高さが変わらないよう常時表示。
// - 「車両詳細」ボタンは vehicle-control 相当の詳細表示に繋げたいので、
//   既存の onSelectVehicle をそのまま呼ぶ形にしてある(ページ遷移ではなくSPA内コールバック)。
// - onAcknowledgeEmergency は今回追加したオプション props。渡さなくても動作する
//   (渡すと「確認」ボタンでその車両の緊急表示を消せるようになる)。

const renderTask = (task: Vehicle['task']): string => {
  if (task === null || task === undefined || task === '') return '未割り当て';
  if (Array.isArray(task)) return task.length > 0 ? task.join(' / ') : '未割り当て';
  return task;
};

const getBatteryColor = (battery: number | null): string => {
  if (battery === null) return '#a1a1aa';
  if (battery <= 20) return '#ff6b6b';
  if (battery <= 40) return '#facc15';
  return '#ffffff';
};

const VehicleCards = ({ vehicles, onSelectVehicle, onAcknowledgeEmergency }: {
  vehicles: Vehicle[];
  onSelectVehicle: (id: string) => void;
  onAcknowledgeEmergency?: (id: string) => void;
}) => (
  <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', overflowY: 'auto' }}>
    {vehicles.map(v => {
      const hasEmergency = !!v.emergency;

      return (
        <div
          key={v.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px',
            columnGap: '10px',
            rowGap: '8px',
            padding: '12px',
            borderRadius: '8px',
            background: '#3a3a3a',
            color: '#fff',
          }}
        >
          {/* 行1: 車両名+バッテリー(左、常に縦並び) / 異常検知信号(右) */}
          <div style={{ gridRow: '1', gridColumn: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, paddingBottom: '4px', borderBottom: '3px solid #2f6fed', width: 'fit-content' }}>
              {v.name}
            </span>
            <span style={{ fontSize: '12px', color: getBatteryColor(v.battery), fontWeight: v.battery !== null && v.battery <= 20 ? 700 : 400 }}>
              バッテリー残量: {v.battery !== null ? `${v.battery}%` : '--'}
            </span>
          </div>

          <div style={{
            gridRow: '1', gridColumn: '2',
            padding: '10px 8px', textAlign: 'center',
            borderRadius: '8px', fontSize: '11px', fontWeight: 700,
            background: hasEmergency ? '#ff3b3b' : '#55555a',
            color: hasEmergency ? '#fff' : '#cfcfcf',
          }}>
            {hasEmergency ? '緊急事態発生' : '異常なし'}
          </div>

          {/* 行2: 車両詳細ボタン(左) / 緊急詳細(右、異常検知信号の真下) */}
          <button
            onClick={() => onSelectVehicle(v.id)}
            style={{
              gridRow: '2', gridColumn: '1',
              justifySelf: 'start',
              padding: '6px 10px',
              background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px',
              fontSize: '11px', fontWeight: 600, textAlign: 'center', cursor: 'pointer', lineHeight: 1.4,
            }}
          >
            車両詳細
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 400, opacity: 0.85 }}>
              (詳細画面へ)
            </span>
          </button>

          <div style={{ gridRow: '2', gridColumn: '2', fontSize: '11px' }}>
            <div style={{ color: '#b5b5b5', marginBottom: '2px' }}>緊急詳細</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span>{hasEmergency ? v.emergency : '〜'}</span>
              {hasEmergency && onAcknowledgeEmergency && (
                <button
                  onClick={() => onAcknowledgeEmergency(v.id)}
                  style={{ border: '1px solid #fff', background: 'transparent', color: '#fff', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', cursor: 'pointer' }}
                >
                  確認
                </button>
              )}
            </div>
          </div>

          {/* 行3: タスク(全幅) */}
          <div style={{ gridRow: '3', gridColumn: '1 / span 2', fontSize: '13px' }}>
            {renderTask(v.task)}
          </div>
        </div>
      );
    })}
  </div>
);
// ▲ここまで大國(車両情報)が変更

//通知(大國)
// ▼ここから大國(通知・ログ)が変更
const LogPanel = ({ logs }: { logs: LogEntry[] }) => (
  <div style={{
    flex: 1,
    borderRadius: '8px',
    background: '#3a3a3a',
    color: '#fff',
    padding: '12px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }}>
    <h4 style={{
      margin: '0 0 6px',
      paddingBottom: '6px',
      borderBottom: '3px solid #2f6fed',
      width: 'fit-content',
      fontSize: '14px',
    }}>
      🔔 通知・ログ
    </h4>

    {logs.length === 0 && (
      <p style={{ fontSize: '12px', color: '#a1a1aa', margin: 0 }}>まだ通知はありません</p>
    )}

    {logs.map(log => (
      <div
        key={log.id}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '6px 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span style={{
          flexShrink: 0,
          marginTop: '5px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: log.level === 'emergency' ? '#ff3b3b' : '#2f6fed',
        }} />
        <div>
          <div style={{ fontSize: '10px', color: '#a1a1aa' }}>{log.time}</div>
          <div style={{
            fontSize: '13px',
            color: log.level === 'emergency' ? '#ff6b6b' : '#fff',
            fontWeight: log.level === 'emergency' ? 700 : 400,
          }}>
            {log.message}
          </div>
        </div>
      </div>
    ))}
  </div>
);
// ▲ここまで大國(通知・ログ)が変更



// --- メイン枠組み（App） ---
export default function App() {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  // 全体で共有する状態データ
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'A13-2搬送 ×10', status: '進行中' },
  ]);

  // ▼大國(車両情報): 新しいVehicle型に合わせて模擬データを更新
  // (setVehiclesも使えるようにして、緊急確認ボタンで状態を書き換えられるようにした)
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'AGV-01', name: '車両1', battery: 85, task: 'A13-2搬送 ×10', emergency: null },
    { id: 'AGV-02', name: '車両2', battery: 42, task: '充電中', emergency: null },
    { id: 'AGV-03', name: '車両3', battery: 99, task: null, emergency: '衝突を検知しました' },
  ]);
  // ▲

  // ▼大國(通知・ログ): 新しいLogEntry型に合わせて模擬データを更新
  // 車両の呼び方を車両カード側(車両1/車両2/車両3)に合わせて数字表記に統一
  const [logs] = useState<LogEntry[]>([
    { id: 1, message: '車両1タスク完了', level: 'info', time: '14:32' },
    { id: 2, message: '車両2緊急停止', level: 'emergency', time: '14:35' },
  ]);
  // ▲

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

  // ▼大國(車両情報)が追加: 緊急表示の「確認」ボタン用ハンドラー
  const handleAcknowledgeEmergency = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, emergency: null } : v));
  };
  // ▲

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
        
        {/* 大國：車両カード */}
        <VehicleCards 
          vehicles={vehicles} 
          onSelectVehicle={handleSelectVehicle} 
          onAcknowledgeEmergency={handleAcknowledgeEmergency}
        />

        {/* 大國：通知・ログ */}
        <LogPanel logs={logs} />
      </div>

    </div>
  );
}