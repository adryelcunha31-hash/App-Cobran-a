import { Router } from 'express';
import { getDashboardSummary } from '../services/reportService.js';
import { getCriticalAccounts } from '../services/alertService.js';
import { sendBillingNotification } from '../services/notificationService.js';

const router = Router();

router.get('/summary', async (_req, res, next) => {
  try {
    const summary = await getDashboardSummary();
    const critical = await getCriticalAccounts();
    res.json({ ...summary, critical });
  } catch (error) {
    next(error);
  }
});

router.post('/notify', async (req, res, next) => {
  try {
    const notification = await sendBillingNotification(req.body);
    res.status(202).json(notification);
  } catch (error) {
    next(error);
  }
});

export default router;
