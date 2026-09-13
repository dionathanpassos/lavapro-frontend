import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { formatToBRL } from '../../utils/Formatted/FormatToBRL';


export function ChartBar({ data, title }) {
  // Validação: Garante que o array existe e possui pelo menos um faturamento registrado
  const isData = data && data.length > 0 && data.some(item => item.amount > 0);

  return (
    <div className="w-full h-90 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
      {/* Cabeçalho do Card (Fica fixo em ambos os estados) */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>

      {/* Renderização Condicional */}
      {isData ? (
        /* Área do Gráfico */
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 25, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }}
                dy={10}
              />
              
              <YAxis hide domain={[0, 'dataMax + 300']} />

              <Bar 
                dataKey="amount" 
                fill="#1D4ED8" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={48}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#1A73E8" />
                ))}

                <LabelList 
                  dataKey="amount" 
                  position="top" 
                  offset={10}
                  fill="#111827"
                  style={{ fontSize: '13px', fontWeight: 'bold' }}
                  formatter={formatToBRL}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Estado Vazio (Empty State) */
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
