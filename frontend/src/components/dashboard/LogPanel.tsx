/**
 * @file LogPanel.tsx
 * @description システムの通知メッセージや動作ログをリアルタイムでリスト表示するコンポーネント。
 * 親コンポーネントから渡された文字列配列（logs）を順にレンダリングします。
 */

import React from 'react';

type LogPanelProps = {
  logs: string[];
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => (
  <div style={{ flex: 1, border: '2px solid #333', background: '#fff', padding: '10px', overflowY: 'auto' }}>
    <h4>🔔 通知・ログ (仮)</h4>
    {logs.map((log, i) => <div key={i}>{log}</div>)}
  </div>
);