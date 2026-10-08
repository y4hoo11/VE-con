// mqtt.ts
import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

// MQTTブローカーのURL（環境変数、またはローカルのデフォルト）
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

export const mqttClient = mqtt.connect(MQTT_BROKER_URL, {
  clientId: `dispatch_server_${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 2000, // 切断時の再接続間隔(ms)
});

mqttClient.on('connect', () => {
  console.log(' [MQTT] ブローカーに接続しました:', MQTT_BROKER_URL);
});

mqttClient.on('error', (err) => {
  console.error(' [MQTT] 接続エラー:', err.message);
});