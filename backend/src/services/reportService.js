import { query } from '../db/index.js';

export async function getDashboardSummary() {
  const statusSummary = await query(
    `SELECT status, COUNT(*)::int AS total, COALESCE(SUM(amount), 0)::numeric(12,2) AS amount
     FROM contracts
     GROUP BY status`
  );

  const upcoming = await query(
    `SELECT COUNT(*)::int AS total
     FROM contracts
     WHERE status = 'Pendente' AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'`
  );

  const overdue = await query(
    `SELECT COALESCE(SUM(amount), 0)::numeric(12,2) AS overdue_amount
     FROM contracts
     WHERE status = 'Pendente' AND due_date < CURRENT_DATE`
  );

  const revenues = await query(
    `SELECT DATE_TRUNC('month', paid_at) AS month, COALESCE(SUM(payment_amount), 0)::numeric(12,2) AS total
     FROM contracts
     WHERE status = 'Pago' AND paid_at IS NOT NULL
     GROUP BY 1
     ORDER BY 1 DESC
     LIMIT 6`
  );

  return {
    statusSummary: statusSummary.rows,
    upcomingDue: upcoming.rows[0]?.total || 0,
    overdueAmount: overdue.rows[0]?.overdue_amount || 0,
    revenues: revenues.rows
  };
}
