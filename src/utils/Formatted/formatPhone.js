export function formatPhone(value) {
  if (!value) return "";
  
  // 1. Remove tudo o que não for número primeiro
  const numbers = value.replace(/\D/g, "");
  
  // 2. Limita estritamente em 11 dígitos (DDD + 9 dígitos)
  const truncated = numbers.substring(0, 11);

  // 3. Aplica a máscara usando a variável 'truncated' (com tamanho máximo garantido de 11)
  if (truncated.length <= 2) {
    return truncated.length > 0 ? `(${truncated}` : "";
  }
  if (truncated.length <= 6) {
    return `(${truncated.substring(0, 2)}) ${truncated.substring(2)}`;
  }
  if (truncated.length <= 10) {
    // Formato Fixo: (11) 4444-4444
    return `(${truncated.substring(0, 2)}) ${truncated.substring(2, 6)}-${truncated.substring(6)}`;
  }
  // Formato Celular: (11) 99999-9999
  return `(${truncated.substring(0, 2)}) ${truncated.substring(2, 7)}-${truncated.substring(7)}`;
}
