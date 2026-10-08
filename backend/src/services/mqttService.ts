// src/services/mqttService.ts
import { mqttClient } from '../config/mqtt';
import { socketService } from './socketService';
import { prisma } from '../config/database';
import { VehicleStatus, LogLevel } from '@prisma/client';

class MqttService {
  init() {
    // 全AGVからのテレメトリと緊急信号を購読
    mqttClient.subscribe(['agv/+/telemetry', 'agv/+/emergency'], (err) => {
      if (!err) {
        console.log('[MQTT] 購読開始: agv/+/telemetry, agv/+/emergency');
      }
    });

    mqttClient.on('message', async (topic, payload) => {
      try {
        const message = JSON.parse(payload.toString());
        const topicParts = topic.split('/');
        const agvId = topicParts[1]; // 例: "agv/AGV-01/telemetry" -> "AGV-01"

        if (topic.endsWith('/telemetry')) {
          // 1. テレメトリ受信: DBのVehicle状態を更新 (upsert)
          const updatedVehicle = await prisma.vehicle.upsert({
            where: { id: agvId },
            update: {
              batteryLevel: typeof message.battery === 'number' ? message.battery : undefined,
              status: message.status ? (message.status as VehicleStatus) : undefined,
              currentX: typeof message.x === 'number' ? message.x : undefined,
              currentY: typeof message.y === 'number' ? message.y : undefined,
              currentTheta: typeof message.theta === 'number' ? message.theta : undefined,
              lastHeartbeat: new Date(),
            },
            create: {
              id: agvId,
              name: message.name || agvId,
              batteryLevel: typeof message.battery === 'number' ? message.battery : 0,
              status: (message.status as VehicleStatus) || VehicleStatus.IDLE,
              currentX: message.x || 0,
              currentY: message.y || 0,
              lastHeartbeat: new Date(),
            },
          });

          // 2. フロントエンドへ最新車両状態をブロードキャスト
          socketService.broadcastVehicleUpdate({
            id: updatedVehicle.id,
            status: updatedVehicle.status,
            batteryLevel: updatedVehicle.batteryLevel,
            currentX: updatedVehicle.currentX,
            currentY: updatedVehicle.currentY,
            currentTheta: updatedVehicle.currentTheta,
          });

        } else if (topic.endsWith('/emergency')) {
          const reason = message.reason || '障害物接近による緊急制動';
          console.error(`[MQTT緊急検知] ${agvId}: ${reason}`);

          // 1. 車両ステータスを ERROR に更新
          await prisma.vehicle.update({
            where: { id: agvId },
            data: { status: VehicleStatus.ERROR },
          });

          // 2. 緊急ログを vehicle_logs テーブルに書き込み
          const createdLog = await prisma.vehicleLog.create({
            data: {
              vehicleId: agvId,
              logLevel: LogLevel.ERROR,
              message: `緊急停止: ${reason}`,
              details: message,
            },
          });

          // 3. フロントへ緊急状態とログを通知
          socketService.broadcastVehicleUpdate({
            id: agvId,
            status: VehicleStatus.ERROR,
            emergencyReason: reason,
          });

          socketService.broadcastLog({
            id: createdLog.id.toString(),
            vehicleId: agvId,
            level: LogLevel.ERROR,
            message: `${agvId} 緊急停止: ${reason}`,
            details: message,
            timestamp: createdLog.timestamp.toISOString(),
          });
        }
      } catch (e) {
        console.error('MQTTメッセージの処理エラー:', e);
      }
    });
  }

  // 実機へコマンド送信
  sendVehicleCommand(agvId: string, command: object) {
    const topic = `agv/${agvId}/command`;
    mqttClient.publish(topic, JSON.stringify(command));
    console.log(`[MQTT送信] ${topic}:`, command);
  }

  // 実機へ緊急停止コマンド発行
  sendEmergencyStop(agvId: string) {
    const topic = `agv/${agvId}/command`;
    mqttClient.publish(topic, JSON.stringify({ action: 'EMERGENCY_STOP' }));
    console.warn(`[MQTT送信] ${agvId} に緊急停止コマンドを発行しました`);
  }
}

export const mqttService = new MqttService();