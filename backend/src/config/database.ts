// src/config/database.ts
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'agv_admin',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'agv_warehouse',
};