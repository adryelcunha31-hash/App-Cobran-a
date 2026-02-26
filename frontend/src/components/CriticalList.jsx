export default function CriticalList({ items = [] }) {
  return (
    <section className="critical-list">
      <h2>IA de Priorização de Cobranças</h2>
      {items.length === 0 ? <p>Sem contas críticas no momento.</p> : null}
      {items.map((item) => (
        <article key={item.id} className="critical-item">
          <h4>{item.client_name}</h4>
          <p>
            {item.service_description} - {item.days_overdue} dias em atraso - R$ {Number(item.amount).toFixed(2)}
          </p>
          <small>{item.actionSuggestion}</small>
        </article>
      ))}
    </section>
  );
}
