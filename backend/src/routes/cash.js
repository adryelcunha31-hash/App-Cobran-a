import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/index.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const schema = z.object({
      contractId: z.number().int().optional(),
      description: z.string().min(2),
      amount: z.number().positive(),
      paidAt: z.string()
    });

    const data = schema.parse(req.body);

    const entryRes = await query(
      `INSERT INTO cash_entries (contract_id, description, amount, paid_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.contractId || null, data.description, data.amount, data.paidAt]
    );

    if (data.contractId) {
      await query(
        `UPDATE contracts
         SET status = 'Pago', paid_at = $2, payment_source = 'MANUAL', payment_amount = $3
         WHERE id = $1`,
        [data.contractId, data.paidAt, data.amount]
      );
    }

    res.status(201).json(entryRes.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
