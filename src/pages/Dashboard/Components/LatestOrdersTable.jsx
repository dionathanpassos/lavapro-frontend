import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";



export default function LatestOrdersTable({ serviceOrders }) {

  
  const getStatusClass = (status) => {
  switch (status) {
    case "WAITING":
      return "bg-amber-50 text-amber-600";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-600";
    case "READY":
      return "bg-emerald-50 text-emerald-600 ";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-600";
    case "PAID":
      return "bg-success-light text-success";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const getStatusText = (status) => {
  if (status === "WAITING") return "AGUARDANDO";
  if (status === "IN_PROGRESS") return "EM ANDAMENTO";
  if (status === "READY") return "CONCLUÍDA";
  if (status === "DELIVERED") return "ENTREGUE";
  if (status === "CANCELED") return "CANCELADO";
  return status;
};

  return (
    <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-sm border border-border/30">
      
      {/* Título */}
      <h3 className="text-lg font-bold text-gray-900 mb-5">
        Últimas ordens de serviço
      </h3>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-2 py-3 text-xs font-semibold text-gray-500 tracking-wider">Nº OS</th>
              <th className="px-2 py-3 text-xs font-semibold text-gray-500 tracking-wider">Cliente</th>
              <th className="px-2 py-3 text-xs font-semibold text-gray-500 tracking-wider">Veículo</th>
              <th className="px-2 py-3 text-xs font-semibold text-gray-500 tracking-wider">Placa</th>
              <th className="px-2 py-3 text-xs font-semibold text-gray-500 tracking-wider">Serviços</th>
              <th className="px-2 py-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
              <th className="px-2 py-3 text-xs font-semibold text-gray-500 tracking-wider">Total</th>
              <th className="w-5 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {serviceOrders?.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                {/* ID da OS */}
                <td className="px-2 py-4 text-xs font-semibold text-foreground">
                  #{order.id}
                </td>
                
                {/* Nome do Cliente */}
                <td className="px-2 py-4 text-xs text-muted-foreground">
                  {order.vehicle.customer.name}
                </td>
                
                {/* Nome do Veículo */}
                <td className="px-2 py-4 text-xs text-muted-foreground">
                  <p>{order.vehicle.model}</p>
                  <p className="text-muted-foreground">{order.vehicle.brand}</p>
                </td>
                <td className="px-2 py-4 text-xs text-muted-foreground">
                  <p>{formatPlate(order.vehicle.plate)}</p>
                 
                </td>
                
                {/* Serviços Empilhados */}
                <td className="px-2 py-4 text-xs text-muted-foreground leading-relaxed">
                  {order.items.map((service, sIdx) => (
                    <div key={sIdx}>{service.serviceName}</div>
                  ))}
                </td>
                
                {/* Badge do Status */}
                <td className="px-2 py-4 whitespace-nowrap">
                  <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wider ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                
                
                
                {/* Total */}
                <td className="px-2 py-4 text-xs font-bold text-gray-900">
                  {formatToBRL(order.totalAmount)}
                </td>
                
                {/* Ações (Três pontinhos) */}
                {/* <td className="px-2 py-4 text-center cursor-pointer text-gray-400 hover:text-gray-600 font-bold transition-colors">
                 
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

      {/* Link de Navegação */}
      
      <div className="mt-5">
        <a 
          href="/ordens-servico" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Ver todas as ordens de serviço <span>➔</span>
        </a>
      </div>

    </div>
  );
}
