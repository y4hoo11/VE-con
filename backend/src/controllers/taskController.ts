import { Request, Response } from 'express';
import { prisma } from '../config/database';

// 【参照】一覧取得
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// 【保存】タスク作成
export const createTask = async (req: Request, res: Response) => {
  const { name, quantity, priority, dueDate } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        code: `TSK-${Math.floor(10 + Math.random() * 90)}`,
        name,
        quantity: Number(quantity),
        priority: Number(priority),
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// 【削除】タスク削除
export const deleteTask = async (req: Request, res: Response) => {
  const id = req.params.id as string; // ★ string型へ明示的にキャスト
  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};