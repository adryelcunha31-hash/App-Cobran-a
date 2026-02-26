import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import clientsRouter from './routes/clients.js';
import contractsRouter from './routes/contracts.js';
import pixRouter from './routes/pix.js';
import cashRouter from './routes/cash.js';
import dashboardRouter from './routes/dashboard.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/clients', clientsRouter);
app.use('/contracts', contractsRouter);
app.use('/pix', pixRouter);
app.use('/cash', cashRouter);
app.use('/dashboard', dashboardRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
