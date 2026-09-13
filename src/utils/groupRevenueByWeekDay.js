const WEEK_DAYS = [
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
  "domingo",
];

export function groupRevenueByWeekDay(revenueGroupedByDate = []) {
  const result = WEEK_DAYS.reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});

  revenueGroupedByDate.forEach(({ date, amount }) => {
    const [year, month, day] = date.split("-").map(Number);

    const dateObject = new Date(year, month - 1, day);

    const weekDayIndex = dateObject.getDay();

    const weekDay =
      WEEK_DAYS[weekDayIndex === 0 ? 6 : weekDayIndex - 1];

    result[weekDay] += amount;
  });



  return Object.entries(result).map(
  ([day, amount]) => ({
    day,
    amount,
  })
);
}