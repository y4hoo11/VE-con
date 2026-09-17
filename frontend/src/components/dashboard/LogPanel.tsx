/**
 * @file LogPanel.tsx
 * @description システムの通知メッセージや動作ログをリアルタイムでリスト表示するコンポーネント。
 */

import React from 'react';
import type { LogEntry } from '../../types';
import styles from '../../styles/LogPanel.module.css';

type LogPanelProps = {
  logs: LogEntry[];
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => (
  <div className={styles.container}>
    <h4 className={styles.title}>🔔 通知・ログ</h4>

    {logs.length === 0 && (
      <p className={styles.emptyText}>まだ通知はありません</p>
    )}

    {logs.map((log) => (
      <div key={log.id} className={styles.logItem}>
        <span
          className={`${styles.badge} ${
            log.level === 'emergency' ? styles.badgeEmergency : styles.badgeInfo
          }`}
        />
        <div>
          <div className={styles.time}>{log.time}</div>
          <div
            className={`${styles.message} ${
              log.level === 'emergency' ? styles.messageEmergency : ''
            }`}
          >
            {log.message}
          </div>
        </div>
      </div>
    ))}
  </div>
);