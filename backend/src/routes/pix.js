import { Router } from 'express';
import { z } from 'zod';
import { createPixCharge, reconcilePixPayment } from '../services/pixService.js';

const router = Router();

router.post('/create', async (req, res, next) => {
  try {
    const schema = z.object({ contractId: z.number().int() });
    const { contractId } = schema.parse(req.body);
    const charge = await createPixCharge(contractId);
    res.status(201).json(charge);
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', async (req, res, next) => {
  try {
    const schema = z.object({ txid: z.string(), paidAmount: z.number().positive() });
    const data = schema.parse(req.body);
    const outcome = await reconcilePixPayment(data);

    res.json({
      message: outcome.hasDiscrepancy ? 'Pagamento recebido com divergência' : 'Pagamento conciliado com sucesso',
      discrepancy: outcome.hasDiscrepancy
    });
  } catch (error) {
    next(error);
  }
});

export default router;
