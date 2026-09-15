/**
 * @file VehicleCards.tsx
 * @description 稼働中の車両（AGV）一覧をカード形式でグリッド表示するコンポーネント。
 * 各カードには車両ID、ステータス、バッテリー残量を表示し、クリック時に選択ハンドラーを呼び出します。
 */

import React from 'react';
import type { Vehicle } from '../../types';

type VehicleCardsProps = {
  vehicles: Vehicle[];
  onSelectVehicle: (id: string) => void;
};

export const VehicleCards: React.FC<VehicleCardsProps> = ({ vehicles, onSelectVehicle }) => (
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