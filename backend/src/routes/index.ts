import { Router } from 'express';
import { getVehicles, getVehicleById } from '../controllers/agvController';
import { getTasks, createTask, assignTask } from '../controllers/taskController';

const router = Router();

// 車両API
router.get('/vehicles', getVehicles);
router.get('/vehicles/:id', getVehicleById);

// タスクAPI
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.post('/tasks/assign', assignTask);

export default router;