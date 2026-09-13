export function formatPlate(plateRaw) {
  if (!plateRaw) return "—";
  const placaLimpa = plateRaw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    return `${placaLimpa.substring(0, 3)}-${placaLimpa.substring(3, 7)}`;

}