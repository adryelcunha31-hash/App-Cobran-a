import dotenv from 'dotenv';
import app from './app.js';
import { initDb } from './db/index.js';

dotenv.config();

const port = Number(process.env.PORT || 4000);

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API de cobrança rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao inicializar banco:', error);
    process.exit(1);
  });
