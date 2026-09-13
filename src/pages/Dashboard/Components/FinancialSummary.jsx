
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { date: '01/2026', Receitas: 4000, Despesas: 1200 },
  { date: '02/2026', Receitas: 4200, Despesas: 1500 },
  { date: '03/2026', Receitas: 4800, Despesas: 1800 },
  { date: '04/2026', Receitas: 4100, Despesas: 1100 },
  { date: '05/2026', Receitas: 5200, Despesas: 1600 },
  { date: '06/2026', Receitas: 5200, Despesas: 1600 },
  { date: '07/2026', Receitas: 5200, Despesas: 1600 },
  { date: '08/2026', Receitas: 5200, Despesas: 1600 },
  { date: '09/2026', Receitas: 5200, Despesas: 1600 },
  { date: '10/2026', Receitas: 5200, Despesas: 1600 },
  { date: '11/2026', Receitas: 5200, Despesas: 1600 },
  { date: '12/2026', Receitas: 5200, Despesas: 1600 },
];

export default function FinancialSummary({ cashFlow }) {
  const receitasTotal = cashFlow.income;
  const despesasTotal = cashFlow.expense;
  const lucroLiquido = cashFlow.balance;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-border/30">
      {/* Título e Filtro */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="m-0 text-base font-bold text-gray-900">
          Receitas x Despesas
        </h3>
        <select className="px-3 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-700 cursor-pointer outline-none focus:border-gray-300">
          <option>Este ano</option>
        </select>
      </div>

      {/* Blocos de Valores (Receitas e Despesas) */}
      <div className="flex justify-between mb-5 border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs text-emerald-500 font-semibold block mb-1">Receitas</span>
          <strong className="text-xl text-gray-900">{formatCurrency(receitasTotal)}</strong>
        </div>
        <div className="text-right">
          <span className="text-xs text-red-500 font-semibold block mb-1">Despesas</span>
          <strong className="text-xl text-gray-900">{formatCurrency(despesasTotal)}</strong>
        </div>
      </div>

      {/* Lucro Líquido */}
      <div className="mb-6">
        <span className="text-sm text-gray-600 block mb-1">Lucro líquido</span>
        <strong className="text-2xl text-emerald-500 font-bold">{formatCurrency(lucroLiquido)}</strong>
      </div>

      {/* Área do Gráfico */}
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#9ca3af" fontSize={12} />
            <YAxis hide={true} />

            {/* 2. Componente de Tooltip Customizado */}
            <Tooltip 
              cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
              formatter={(value) => [formatCurrency(value)]}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#e5e7eb', fontSize: '13px' }}
            />

            {/* Configuração das Barras Finas e Arredondadas */}
            <Bar dataKey="Receitas" fill="#10b981" barSize={6} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Despesas" fill="#ef4444" barSize={6} radius={[4, 4, 0, 0]} />
            
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px', paddingTop: '10px', color: '#4b5563' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
