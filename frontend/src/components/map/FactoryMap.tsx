/**
 * @file FactoryMap.tsx
 * @description 工場内の2Dマップおよび稼働中の車両数・配置を表示するコンポーネント。
 * 受け取った車両データ（vehicles）をもとに、マップ上の稼働ステータスを更新します。
 * 確認
 */

import React from 'react';
import type { Vehicle } from '../../types';

type FactoryMapProps = {
  vehicles: Vehicle[];
};

export const FactoryMap: React.FC<FactoryMapProps> = ({ vehicles }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eaeaea' }}>
    <p>🗺️ 2Dマップエリア (仮) - 稼働車両数: {vehicles.length}台</p>
  </div>
);