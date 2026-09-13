export function countCurrentMonthDates (customers) {
  const now = new Date();
  const currentMonth = now.getMonth(); // Janeiro é 0, Fevereiro é 1, etc.
  const currentYear = now.getFullYear();

  const currentMonthDates = customers.filter((customer) => {
    if (!customer?.createdAt) return false;
    
    const date = new Date(customer.createdAt);
    
    // Verifica se a data é válida e se corresponde ao mês e ano atuais
    return (
      !isNaN(date.getTime()) && 
      date.getMonth() === currentMonth && 
      date.getFullYear() === currentYear
    );
  });

  return currentMonthDates.length;
};