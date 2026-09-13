export default function MostPerformedServices({ services }) {
  // 1. Validação amigável para ausência de dados
  const temDados = services && services.length > 0;

  const data = temDados ? transformAndRankServices(services) : [];

  return (
    <div className="w-full  min-h-90 bg-white p-6 border border-gray-100 shadow-sm font-sans flex flex-col justify-between">
      
      <div>
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="m-0 text-base font-bold text-gray-900">
            Serviços mais realizados
          </h3>
        </div>

        {/* 2. Renderização Condicional */}
        {temDados ? (
          /* Lista de Serviços (Com Dados) */
          <div className="flex flex-col gap-4">
            {data.map((item) => (
              <div key={item.rank} className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                
                {/* Número do Ranking (Bolinha sutil no primeiro colocado) */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  item.rank === 1 ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-500'
                }`}>
                  {item.rank}
                </div>

                {/* Conteúdo Central (Nome + Barra de Progresso) */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                  
                  {/* Trilho de Fundo da Barra */}
                  <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden">
                    {/* Preenchimento Azul Dinâmico */}
                    <div 
                      className="h-full bg-blue-600 rounded-sm transition-all duration-500" 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>

                {/* Dados da Direita (Quantidade e Porcentagem) */}
                <div className="flex items-center gap-4 text-right min-w-22.5 justify-end">
                  <span className="text-sm font-bold text-gray-900">
                    {item.total}
                  </span>
                  <span className="text-xs text-gray-500 w-11">
                    {item.percentage.toFixed(1).replace('.', ',')}%
                  </span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Estado Vazio (Empty State) */
          <div className="flex flex-col items-center justify-center py-10 text-center flex-1">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-gray-500 font-medium text-sm">
              Nenhum serviço realizado no período
            </p>
            <p className="text-gray-400 text-xs mt-1">
              O ranking será montado assim que as ordens de serviço forem concluídas.
            </p>
          </div>
        )}
      </div>

      {/* Botão de Rodapé */}
      <div className="mt-5">
        <a 
          href="/produtos" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos os serviços <span>➔</span>
        </a>
      </div>

    </div>
  );
}

const transformAndRankServices = (apiServices = []) => {
  const sorted = [...apiServices].sort((a, b) => {
    if (b.totalSold !== a.totalSold) return b.totalSold - a.totalSold;
    return a.serviceName.localeCompare(b.serviceName, 'pt-BR');
  });
  const grandTotal = sorted.reduce((sum, item) => sum + item.totalSold, 0);
  return sorted.map((item, index) => ({
    rank: index + 1,
    name: item.serviceName,
    total: item.totalSold,
    percentage: grandTotal > 0 ? (item.totalSold / grandTotal) * 100 : 0
  }));
};
