// agvController.ts
import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: '車両一覧の取得に失敗しました' });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 1. id が string であることを明確化（配列や未定義をガード）
    const vehicleId = Array.isArray(id) ? id[0] : id;

    if (!vehicleId) {
      return res.status(400).json({ error: '無効な車両IDです' });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      // 2. tasks への参照を一時的に除外（または schema.prisma への定義追加後に include 復活）
      include: {
        logs: { take: 10, orderBy: { timestamp: 'desc' } },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ error: '車両が見つかりません' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: '車両詳細の取得に失敗しました' });
  }
};