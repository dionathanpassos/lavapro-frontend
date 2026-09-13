export function formaInputCurrency(value) {
  // Se o valor for vazio, null ou undefined, retorna string vazia para o input controlado
  if (value === undefined || value === null || value === "") {
    return "";
  }

  // 1. Remove absolutamente tudo que NÃO for número (letras, símbolos, espaços)
  const cleanValue = String(value).replace(/\D/g, "");

  // Se após a limpeza não sobrar nenhum número, retorna string vazia
  if (!cleanValue) return "";

  // 2. Transforma em centavos (ex: se digitar "5", vira 0.05. Se digitar "500", vira 5.00)
  const numberValue = Number(cleanValue) / 100;

  // 3. Formata usando o seu Intl.NumberFormat original
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
}
