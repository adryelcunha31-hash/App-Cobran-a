import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/index.js';

const router = Router();

const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  document: z.string().optional()
});

router.post('/', async (req, res, next) => {
  try {
    const data = clientSchema.parse(req.body);
    const result = await query(
      `INSERT INTO clients (name, email, whatsapp, document)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.email || null, data.whatsapp || null, data.document || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const result = await query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
