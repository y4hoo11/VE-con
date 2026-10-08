import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { dispatchService } from '../services/dispatchService';

// 【参照】一覧取得
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: { assignedVehicle: true }, // ← エラーにならず正常に車両情報を取得できます
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'タスク一覧の取得に失敗しました' });
  }
};

// 【保存】タスク作成
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, name, startLocation, targetLocation, priority } = req.body;
    const newTask = await prisma.task.create({
      data: {
        name: name || title || '名称未設定タスク',
        startLocation,
        targetLocation,
        priority: priority ?? 3,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'タスクの作成に失敗しました' });
  }
};

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { taskId, vehicleId } = req.body;
    const updatedTask = await dispatchService.assignTask(taskId, vehicleId);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: '配車処理に失敗しました' });
  }
};