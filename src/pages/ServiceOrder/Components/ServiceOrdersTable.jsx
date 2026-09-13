import { Eye, Pencil, Play, Square, Truck } from "lucide-react";
import ServiceOrderFilter from "./ServiceOrderFilter";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";

export default function ServiceOrdersTable({
  serviceOrders,
  onEdit,
  onSearch,
  onChangeStatus,
}) {
  const navigate = useNavigate();

  function handleOpenDetails(serviceOrder) {
    navigate(`/ordens-servico/${serviceOrder.id}`);
  }
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <ServiceOrderFilter onSearch={onSearch} />

   
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
              <th className="py-3 px-4 w-10">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {serviceOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4 font-bold text-gray-900">
                  <Link
                  to={`/ordens-servico/${order.id}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer font-semibold"
                >
                  #{order.id}
                </Link>
                  
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-foreground">
                    {order.vehicle.customer.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {formatPhone(order.vehicle.customer.phone)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-foreground">
                    {order.vehicle.model}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase">
                    {formatPlate(order.vehicle.plate)}
                  </div>
                </td>
                <td className="py-4 px-4 text-foreground">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="leading-tight">
                      {item.serviceName}
                    </div>
                  ))}
                </td>
                <td className="py-4 px-4 vertical-align-middle">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${getStatusClasses(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-foreground">
                    {formatDateTime(order.createdAt)}
                  </div>
                </td>
                <td className="py-4 px-4 vertical-align-middle">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${order.isPaid ? getStatusClasses("PAID") : getStatusClasses("NOTPAID")}`}
                  >
                    {order.isPaid ? "PAGO" : "PENDENTE"}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-foreground text-right">
                  {formatToBRL(order.totalAmount)}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleOpenDetails(order)}
                      className="rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                    >
                      <Eye className="w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(order)}
                      className=" rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                    >
                      <Pencil className="w-4" />
                    </button>
                    {order.status != "DELIVERED" && (
                      <button
                        onClick={() => onChangeStatus(order)}
                        className=" rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                      >
                        {getStatusIcon(order.status)}
                      </button>
                    )}
                  </div>
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
      return "bg-emerald-50 text-emerald-600";
    case "CANCELLED":
      return "bg-emerald-50 text-emerald-600";
    case "PAID":
      return "bg-emerald-50 text-emerald-600";
    case "NOTPAID":
      return "bg-destructive-light text-destructive";
    default:
      return "bg-gray-50 text-gray-600 ";
  }
};

const getStatusText = (status) => {
  if (status === "WAITING") return "AGUARDANDO";
  if (status === "IN_PROGRESS") return "EM ANDAMENTO";
  if (status === "READY") return "CONCLUÍDA";
  if (status === "DELIVERED") return "ENTREGUE";
  if (status === "CANCELLED") return "CANCELADA";
  return status;
};

const getStatusIcon = (status) => {
  if (status === "WAITING") return <Play className="w-4" />;
  if (status === "IN_PROGRESS") return <Square className="w-4" />;
  if (status === "READY") return <Truck className="w-4" />;
};
