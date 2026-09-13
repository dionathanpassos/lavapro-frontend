import { useNavigate } from "react-router-dom";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { formatToBRL } from "../../utils/Formatted/FormatToBRL";

export default function ChartsDonut({ serviceOrders, title, type = "integer" }) {
  const navigate = useNavigate();

  const formatarValor = (num) => {
  if (type === "currency") {
    return formatToBRL(num);
  }
  
  return num;
};

  const temDados = serviceOrders && Object.keys(serviceOrders).length > 0;

  const entradasFiltradas = temDados 
    ? Object.entries(serviceOrders).filter(([key]) => key !== "totalMonth")
    : [];

  const total = entradasFiltradas.reduce((acc, [_, value]) => acc + value, 0);  

  const possuiOrdens = total > 0;

  const data = entradasFiltradas.map(([key, value]) => {
    const porcentagem = total > 0 ? (value / total) * 100 : 0;

    return {
      name: getStatusText(key.toUpperCase()),
      value: value,
      percentage: Number(porcentagem.toFixed(1)),
      color: getStatusClasses(key.toLocaleLowerCase()),
    };
  });

  return (
    <div className="w-full min-h-90 bg-white p-6 rounded-xl shadow-sm border border-border/30 flex flex-col justify-between">
      <div>
     
        <h3 className="m-0 mb-6 text-base font-bold text-gray-900">
          {title}
        </h3>
    
        {temDados && possuiOrdens ? (
  
          <div className="flex flex-wrap items-center justify-between gap-5">
     
            <div className="flex justify-center w-full lg:w-50 h-50 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Texto Centralizado "120 Total" */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="block text-[18px] font-bold text-gray-900 leading-none">
                  {formatarValor(total)}
                </span>
                <span className="text-sm text-gray-500 font-medium">Total</span>
              </div>
            </div>

        
            <div className="flex-1 min-w-[280px]">
              <table className="w-full border-collapse">
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        index !== data.length - 1
                          ? "border-b border-gray-100"
                          : "border-0"
                      }
                    >
                 
                      <td className="py-2.5 px-0 text-sm text-gray-600 flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </td>
                    
                      <td className="py-2.5 px-0 text-sm font-bold text-gray-900 text-right">
                        {formatarValor(item.value)}
                      </td>
                   
                      <td className="py-2.5 px-0 text-sm text-gray-500 text-right w-[70px]">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          
          <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <p className="text-gray-500 font-medium text-sm">
              Nenhuma ordem de serviço aberta hoje
            </p>
            <p className="text-gray-400 text-xs mt-1">
              O gráfico por status será exibido assim que as OS forem criadas.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => navigate("/ordens-servico")}
          className="flex items-center gap-2 py-2 px-4 border border-gray-200 rounded-lg bg-white text-[13px] font-semibold text-primary cursor-pointer hover:bg-gray-50 transition-colors"
        >
          Ver todas as OS <span>➔</span>
        </button>
      </div>
    </div>
  );
}

const getStatusText = (status) => {
  if (status === "WAITING") return "Aguardando";
  if (status === "INPROGRESS") return "Em andamento";
  if (status === "READY") return "Concluída";
  if (status === "DELIVERED") return "Entregue";
  if (status === "CANCELED") return "Cancelado";
  return status;
};

const getStatusClasses = (status) => {
  switch (status) {
    case "waiting":
    case "credit_card":
      return "#116bf6";

    case "inProgress":
    case "bank_transfer":
      return "#ffb100";

    case "ready":
    case "cash":
      return "#10b981";

    case "delivered":
    case "pix":
      return "#8b5cf6";

    case "canceled":
    case "debit_card":
      return "#ef4444";
    default:
      return "#9ca3af";   
  }
};
