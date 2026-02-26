import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/index.js';
import { computeStatus } from '../utils/status.js';

const router = Router();

const contractSchema = z.object({
  clientId: z.number().int(),
  serviceDescription: z.string().min(2),
  amount: z.number().positive(),
  issueDate: z.string(),
  dueDate: z.string(),
  notes: z.string().optional()
});

router.post('/', async (req, res, next) => {
  try {
    const data = contractSchema.parse(req.body);
    const status = computeStatus({ status: 'Pendente', dueDate: data.dueDate });

    const result = await query(
      `INSERT INTO contracts (client_id, service_description, amount, issue_date, due_date, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.clientId, data.serviceDescription, data.amount, data.issueDate, data.dueDate, status, data.notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/invoices', async (req, res, next) => {
  try {
    const status = req.query.status;
    const clauses = [];
    const params = [];
    if (status) {
      clauses.push(`c.status = $${params.length + 1}`);
      params.push(status);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await query(
      `SELECT c.*, cl.name as client_name
       FROM contracts c
       JOIN clients cl ON cl.id = c.client_id
       ${where}
       ORDER BY c.due_date ASC`,
      params
    );

    res.json(result.rows.map((row) => ({ ...row, status: computeStatus({ status: row.status, dueDate: row.due_date }) })));
  } catch (error) {
    next(error);
  }
});

export default router;
