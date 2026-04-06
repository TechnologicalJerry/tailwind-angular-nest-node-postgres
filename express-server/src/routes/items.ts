import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET all items
router.get('/', async (_req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
  res.json(result.rows);
});

// GET one item by id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    res.status(404).json({ message: 'Item not found' });
    return;
  }
  res.json(result.rows[0]);
});

// POST create item
router.post('/', async (req: Request, res: Response) => {
  const { name, description } = req.body as { name: string; description?: string };
  const result = await pool.query(
    'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
    [name, description ?? null],
  );
  res.status(201).json(result.rows[0]);
});

// PUT update item
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body as { name: string; description?: string };
  const result = await pool.query(
    'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description ?? null, id],
  );
  if (result.rowCount === 0) {
    res.status(404).json({ message: 'Item not found' });
    return;
  }
  res.json(result.rows[0]);
});

// DELETE item
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
  if (result.rowCount === 0) {
    res.status(404).json({ message: 'Item not found' });
    return;
  }
  res.json({ message: 'Item deleted' });
});

export default router;
