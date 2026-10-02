// src/services/socketService.ts
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Vehicle, LogEntry } from '../types';

class SocketService {
  private io: Server | null = null;

  init(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(` [WebSocket] フロントエンド接続: ${socket.id}`);

      // フロントからの緊急停止指示
      socket.on('manual_emergency_stop', (data: { vehicleId: string }) => {
        console.warn(` [緊急] Webからの停止命令を受信: ${data.vehicleId}`);
        // mqttService.sendEmergencyStop(data.vehicleId) などを呼び出す
      });

      // フロントの「確認」ボタン等による緊急解除
      socket.on('acknowledge_emergency', (data: { vehicleId: string }) => {
        this.broadcastVehicleUpdate({
          id: data.vehicleId,
          emergency: null,
        });
      });

      socket.on('disconnect', () => {
        console.log(` [WebSocket] クライアント切断: ${socket.id}`);
      });
    });
  }

  // 車両情報の更新をフロントエンドへブロードキャスト
  // ※部分更新できるように Partial<Vehicle> & { id: string } を採用
  broadcastVehicleUpdate(vehicleUpdate: Partial<Vehicle> & { id: string }) {
    if (this.io) {
      this.io.emit('vehicle:update', vehicleUpdate);
    }
  }

  // 通知・ログをフロントエンドへブロードキャスト
  broadcastLog(logEntry: LogEntry) {
    if (this.io) {
      this.io.emit('log:new', logEntry);
    }
  }
}

export const socketService = new SocketService();