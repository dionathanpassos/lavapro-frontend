import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FaturamentoChart({ data, title }) {
  const formatYAxis = (value) => {
    if (value === 0) return "R$ 0";
    return `R$ ${value / 1000}k`;
  };
  const temDados = data && data.length > 0;

  return (
    <div className="w-full h-90 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">

      <div className="flex justify-between items-center mb-5">
        <h3 className="m-0 text-md font-bold text-foreground">
          {title}
        </h3>
      </div>

      {temDados ? (
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >

            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
    
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                return `${day}/${month}`;
              }}
            />

            <YAxis
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
              stroke="#9ca3af"
              fontSize={12}
              domain={[0, 'auto']}
              ticks={[0, 1000, 2000, 3000]}
            />

            <Tooltip
              formatter={(value) => [
                `R$ ${value.toLocaleString("pt-BR")}`,
                "Receita",
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                borderColor: "#e5e7eb",
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                return `${day}/${month}`;
              }}
            />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorReceita)"
              dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#2563eb" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
  
        <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-gray-500 font-medium text-sm">
            Nenhum faturamento registrado no período
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Novos dados aparecerão aqui assim que houverem vendas.
          </p>
        </div>
      )}
    </div>
  );
}
