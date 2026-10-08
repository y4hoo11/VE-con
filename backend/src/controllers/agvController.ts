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
  const { id } = req.params;
  const vehicleId = Array.isArray(id) ? id[0] : id;

  if (!vehicleId) {
    return res.status(400).json({ error: '無効な車両IDです' });
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        tasks: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ error: '車両が見つかりません' });
    }

    const safeVehicle = JSON.parse(
      JSON.stringify(vehicle, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    res.json(safeVehicle);
  } catch (error) {
    try {
      // 修正箇所: req.params.id ではなく型安全な vehicleId を使用
      const fallbackVehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });
      if (!fallbackVehicle) return res.status(404).json({ error: '車両が見つかりません' });
      return res.json(fallbackVehicle);
    } catch (fallbackError) {
      console.error('getVehicleById エラー:', error);
      return res.status(500).json({ error: '車両詳細の取得に失敗しました' });
    }
  }
};