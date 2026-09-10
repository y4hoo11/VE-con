import React, { useState } from 'react';

export default function App() {
  // タスク状態管理
  const [tasks, setTasks] = useState([
    { id: 1, name: 'A-01エリアへ搬送', status: '進行中' },
    { id: 2, name: 'B-03ピッキング', status: '待機中' },
  ]);
  const [taskInput, setTaskInput] = useState('');
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  // 車両データ（カード形式）
  const [vehicles] = useState([
    { id: 'AGV-01', status: '稼働中', battery: '85%' },
    { id: 'AGV-02', status: '充電中', battery: '42%' },
    { id: 'AGV-03', status: 'サボりなう', battery: '99%' },
  ]);

  // 通知・ログデータ
  const [logs] = useState([
    '・車両Aタスク完了',
    '・車両B緊急停止',
    '・車両Cサボりなう',
    '・車両A次タスク開始',
  ]);

  // タスク追加
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), name: taskInput, status: '待機中' }]);
    setTaskInput('');
  };

  // タスク削除
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif', boxSizing: 'border-box', padding: '10px', gap: '10px', backgroundColor: '#f0f2f5' }}>
      
      {/* 上部：マップ ＆ 左端サイドボタン */}
      <div style={{ display: 'flex', flex: 1, border: '2px solid #333', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        
        {/* 左端サイドバーボタン */}
        <div style={{ width: '32px',height: '90px', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px', cursor: 'pointer', zIndex: 10 }}
             onClick={() => setIsTaskPanelOpen(!isTaskPanelOpen)}>
          <span style={{ writingMode: 'vertical-rl', letterSpacing: '4px', fontWeight: 'bold' }}>サイド</span>
        </div>

        {/* 開閉式タスク管理パネル */}
        {isTaskPanelOpen && (
          <div style={{ width: '250px', borderRight: '2px solid #ccc', background: '#fafafa', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 5 }}>
            <h4 style={{ margin: 0 }}>📋 タスク管理</h4>
            
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '5px' }}>
              <input
                type="text"
                placeholder="タスクを入力"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                style={{ flex: 1, padding: '5px' }}
              />
              <button type="submit">追加</button>
            </form>

            {/* タスクカードリスト */}
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.map((task) => (
                <div key={task.id} style={{ border: '1px solid #ddd', background: '#fff', borderRadius: '4px', padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{task.name}</div>
                    <small style={{ color: task.status === '進行中' ? 'green' : '#666' }}>{task.status}</small>
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* マップ表示エリア（広々スペース） */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eaeaea', position: 'relative' }}>
          <p style={{ color: '#666', fontWeight: 'bold' }}>🗺️ ここに工場マップが表示されます</p>
        </div>
      </div>

      {/* 下部：車両カード ＆ 通知ログ */}
      <div style={{ height: '180px', display: 'flex', gap: '10px' }}>
        
        {/* 車両カード一覧エリア */}
        <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {vehicles.map((v) => (
            <div key={v.id} style={{ border: '2px solid #333', background: '#fff', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{v.id}</h3>
              <p style={{ margin: '5px 0' }}>ステータス: <strong>{v.status}</strong></p>
              <p style={{ margin: '5px 0' }}>バッテリー: {v.battery}</p>
            </div>
          ))}
        </div>

        {/* 右下：通知・ログエリア */}
        <div style={{ flex: 1, border: '2px solid #333', background: '#fff', padding: '10px', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>🔔 通知・ログ</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}