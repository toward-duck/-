import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// 删除这行：import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import apiRoutes from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api', apiRoutes);

  // Vite Middleware (Development)
  if (process.env.NODE_ENV !== "production") {
    // 动态按需导入 Vite，避免生产环境报错
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname, '..'),
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ 本草智库服务器已启动: http://localhost:${PORT}`);
  });
}

startServer();