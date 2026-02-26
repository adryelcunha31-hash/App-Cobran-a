export function computeStatus({ status, dueDate }) {
  if (status === 'Pago') return 'Pago';
  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  if (due < today) return 'Atrasado';
  return 'Pendente';
}
