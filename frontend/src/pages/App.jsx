import { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatusCard from '../components/StatusCard';
import InvoicesTable from '../components/InvoicesTable';
import CriticalList from '../components/CriticalList';

function toMap(summary = []) {
  return summary.reduce((acc, item) => {
    acc[item.status] = item;
    return acc;
  }, {});
}

export default function App() {
  const [summary, setSummary] = useState({ statusSummary: [], critical: [], overdueAmount: 0, upcomingDue: 0 });
  const [invoices, setInvoices] = useState([]);

  async function load() {
    const [summaryRes, invoicesRes] = await Promise.all([
      api.get('/dashboard/summary'),
      api.get('/contracts/invoices')
    ]);
    setSummary(summaryRes.data);
    setInvoices(invoicesRes.data);
  }

  useEffect(() => {
    load();
  }, []);

  const status = toMap(summary.statusSummary);

  return (
    <main className="container">
      <h1>Painel Administrativo de Cobrança</h1>
      <section className="grid">
        <StatusCard title="✅ Pagos" value={`R$ ${Number(status.Pago?.amount || 0).toFixed(2)}`} tone="green" />
        <StatusCard title="⚠️ Pendentes" value={status.Pendente?.total || 0} tone="yellow" />
        <StatusCard title="❗ Vencidos" value={`R$ ${Number(summary.overdueAmount || 0).toFixed(2)}`} tone="red" />
      </section>

      <section className="meta">
        <p>Contas próximas do vencimento (3 dias): {summary.upcomingDue}</p>
      </section>

      <InvoicesTable invoices={invoices} />
      <CriticalList items={summary.critical} />
    </main>
  );
}
