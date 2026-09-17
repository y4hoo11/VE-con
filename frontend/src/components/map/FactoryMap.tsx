/**
 * @file FactoryMap.tsx
 * @description 工場内の2Dマップおよび稼働中の車両数・配置を表示するコンポーネント。
 */

import React from 'react';
import type { Vehicle } from '../../types';
import styles from '../../styles/FactoryMap.module.css';

type FactoryMapProps = {
  vehicles: Vehicle[];
};

export const FactoryMap: React.FC<FactoryMapProps> = ({ vehicles }) => (
  <div className={styles.mapContainer}>
    <p className={styles.mapText}>🗺️ 2Dマップエリア (仮) - 稼働車両数: {vehicles.length}台</p>
  </div>
);