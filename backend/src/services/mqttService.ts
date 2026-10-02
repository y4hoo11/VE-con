// src/services/mqttService.ts
import { mqttClient } from '../config/mqtt';
import { socketService } from './socketService';
import { LogEntry } from '../types';

class MqttService {
  init() {
    // 全AGVからのテレメトリと緊急信号を購読
    mqttClient.subscribe(['agv/+/telemetry', 'agv/+/emergency'], (err) => {
      if (!err) {
        console.log('[MQTT] 購読開始: agv/+/telemetry, agv/+/emergency');
      }
    });

    mqttClient.on('message', (topic, payload) => {
      try {
        const message = JSON.parse(payload.toString());
        const topicParts = topic.split('/');
        const agvId = topicParts[1]; // 例: "agv/AGV-01/telemetry" -> "AGV-01"

        if (topic.endsWith('/telemetry')) {
          // テレメトリ（バッテリー残量・状態・タスク等）の更新
          socketService.broadcastVehicleUpdate({
            id: agvId,
            battery: typeof message.battery === 'number' ? message.battery : null,
            status: message.status,
            task: message.task,
          });
        } else if (topic.endsWith('/emergency')) {
          // 実機側マイコン・LiDARからの緊急信号を受信
          const reason = message.reason || '障害物接近による緊急制動';
          console.error(`[MQTT緊急検知] ${agvId}: ${reason}`);

          // 車両カードの emergency プロパティを更新
          socketService.broadcastVehicleUpdate({
            id: agvId,
            status: '緊急停止中',
            emergency: reason,
          });

          // ログパネル用の LogEntry を発行
          const log: LogEntry = {
            id: Date.now(),
            message: `${agvId} 緊急停止: ${reason}`,
            level: 'emergency',
            time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          };
          socketService.broadcastLog(log);
        }
      } catch (e) {
        console.error('MQTTメッセージのパースエラー:', e);
      }
    });
  }

  // 実機へコマンド送信
  sendVehicleCommand(agvId: string, command: object) {
    const topic = `agv/${agvId}/command`;
    mqttClient.publish(topic, JSON.stringify(command));
    console.log(`[MQTT送信] ${topic}:`, command);
  }

  // 実機へ個別緊急停止
  sendEmergencyStop(agvId: string) {
    const topic = `agv/${agvId}/command`;
    mqttClient.publish(topic, JSON.stringify({ action: 'EMERGENCY_STOP' }));
    console.warn(`[MQTT送信] ${agvId} に緊急停止コマンドを発行しました`);
  }
}

export const mqttService = new MqttService();