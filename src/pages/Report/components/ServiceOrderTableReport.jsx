import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";


export default function ServiceOrderTableReport({ serviceOrders }) {
  const navigate = useNavigate();

  function handleOpenDetails(serviceOrder) {
    navigate(`/ordens-servico/${serviceOrder.id}`);
  }
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Nº OS</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Veículo</th>
              <th className="py-3 px-4">Serviços</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Status Financeiro</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {serviceOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-3 px-4 font-bold text-foreground">
                <Link
                  to={`/ordens-servico/${order.id}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer"
                >
                  #{order.id}
                </Link>
                 
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-foreground">
                    {order.vehicle.customer.name}
                  </div>
                  <div className="text-xs text-foreground">
                    {formatPhone(order.vehicle.customer.phone)}
                  </div>
                </td>
                <td className="px-4">
                  <div className="font-semibold text-foreground">
                    {order.vehicle.model}
                  </div>
                  <div className="text-xs text-foreground uppercase">
                    {formatPlate(order.vehicle.plate)}
                  </div>
                </td>
                <td className="px-4 text-foreground">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="leading-tight">
                      {item.serviceName}
                    </div>
                  ))}
                </td>
                <td className="px-4 vertical-align-middle">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${getStatusClasses(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4">
                  <div className="text-foreground">
                    {formatDateTime(order.createdAt)}
                  </div>
                  <div className="text-xs text-foreground"></div>
                </td>
                <td className="px-4 vertical-align-middle">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${order.isPaid ? getStatusClasses("PAID") : getStatusClasses("NOTPAID")}`}
                  >
                    {order.isPaid ? "PAGO" : "PENDENTE"}
                  </span>
                </td>
                <td className="px-4 font-bold text-foreground text-right">
                  {formatToBRL(order.totalAmount)}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
    </div>
  );
}

const getStatusClasses = (status) => {
  switch (status) {
    case "WAITING":
      return "bg-amber-50 text-amber-600";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-600";
    case "READY":
      return "bg-emerald-50 text-emerald-600";
    case "DELIVERED":
      return "bg-status-delivered-bg text-delivered";
    case "CANCELED":
      return "bg-destructive-light text-destructive";
    case "PAID":
      return "bg-emerald-50 text-emerald-600";
    case "NOTPAID":
      return "bg-destructive-light text-destructive";
    default:
      return "bg-gray-50 text-gray-600 ";
  }
};

const getStatusText = (status) => {
  if (status === "PAID") return "PAGO";
  if (status === "REFOUND") return "ESTORNADO";
  if (status === "CANCELED") return "CANCELADO";
  return status;
};

