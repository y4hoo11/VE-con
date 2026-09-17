/**
 * @file LogPanel.tsx
 * @description システムの通知メッセージや動作ログをリアルタイムでリスト表示するコンポーネント。
 * 親コンポーネントから渡された文字列配列（logs）を順にレンダリングします。
 */

import React from 'react';
import styles from '../../styles/LogPanel.module.css';

type LogPanelProps = {
  logs: string[];
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => (
  <div className={styles.container}>
    <h4>🔔 通知・ログ (仮)</h4>
    {logs.map((log, i) => <div key={i}>{log}</div>)}
  </div>
);