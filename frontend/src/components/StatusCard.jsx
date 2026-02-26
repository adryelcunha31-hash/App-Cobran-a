export default function StatusCard({ title, value, tone }) {
  return (
    <article className={`card ${tone}`}>
      <h3>{title}</h3>
      <strong>{value}</strong>
    </article>
  );
}
