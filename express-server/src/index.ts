import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db';
import itemsRouter from './routes/items';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/items', itemsRouter);

// Start server
async function bootstrap(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
