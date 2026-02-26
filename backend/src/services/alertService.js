import { query } from '../db/index.js';

export async function getCriticalAccounts(limit = 5) {
  const result = await query(
    `SELECT c.id, c.service_description, c.amount, c.due_date, cl.name AS client_name,
            GREATEST(DATE_PART('day', NOW() - c.due_date), 0) AS days_overdue
     FROM contracts c
     JOIN clients cl ON cl.id = c.client_id
     WHERE c.status = 'Pendente' AND c.due_date < CURRENT_DATE
     ORDER BY days_overdue DESC, c.amount DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map((item) => ({
    ...item,
    actionSuggestion:
      Number(item.days_overdue) > 15
        ? 'Aplicar protocolo de cobrança formal e contato WhatsApp + e-mail'
        : 'Enviar lembrete amigável com novo prazo de negociação'
  }));
}
