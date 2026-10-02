// src/services/dispatchService.ts
import { Task, LogEntry } from '../types';
import { mqttService } from './mqttService';
import { socketService } from './socketService';

class DispatchService {
  // Task型のタスクを車両に割り当てる
  assignTask(task: Task, vehicleId: string) {
    console.log(`タスク [${task.code}: ${task.name}] を ${vehicleId} に配車します`);

    // 1. 実機（Jetson/Pi）に向けてMQTTで走行タスクを指示
    mqttService.sendVehicleCommand(vehicleId, {
      type: 'TASK_ASSIGN',
      taskId: task.id,
      taskCode: task.code,
      taskName: task.name,
      quantity: task.quantity,
    });

    // 2. 車両カードの状態を更新（タスク名をセットし、緊急状態を解除）
    socketService.broadcastVehicleUpdate({
      id: vehicleId,
      status: 'タスク実行中',
      task: task.name,
      emergency: null,
    });

    // 3. 正常ログ（LogEntry）を発行
    const log: LogEntry = {
      id: Date.now(),
      message: `${vehicleId} に [${task.code}] ${task.name} (数量: ${task.quantity}) を割り当てました`,
      level: 'info',
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };
    socketService.broadcastLog(log);
  }
}

export const dispatchService = new DispatchService();