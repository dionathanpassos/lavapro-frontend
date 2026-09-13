export function formatDateTime(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  // Garante que a data passada é válida
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date).replace(', ', ' '); // Substitui a vírgula padrão por ' às '
}