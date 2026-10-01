import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ルートパス用のレスポンスを追加
app.get('/', (req, res) => {
  res.send('Backend API Server is running!');
});

// ヘルスチェック用エンドポイント
app.get('/api/health', async (req, res) => {
  try {
    // DBへの生クエリで接続確認
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

