const toneByStatus = {
  Pago: 'green',
  Atrasado: 'red',
  Pendente: 'yellow'
};

export default function InvoicesTable({ invoices = [] }) {
  return (
    <section className="table-wrapper">
      <h2>Ordens de Serviço / Contratos</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((item) => (
            <tr key={item.id}>
              <td>{item.client_name}</td>
              <td>{item.service_description}</td>
              <td>R$ {Number(item.amount).toFixed(2)}</td>
              <td>{new Date(item.due_date).toLocaleDateString('pt-BR')}</td>
              <td>
                <span className={`badge ${toneByStatus[item.status] || 'yellow'}`}>{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
