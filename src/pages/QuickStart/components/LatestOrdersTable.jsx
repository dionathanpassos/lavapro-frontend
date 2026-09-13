import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { CarFront, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";



export default function LatestOrdersTable({ serviceOrders }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Cabeçalho */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          Últimas ordens de serviço
        </h3>

        <Link
          to="/ordens-servico"
          className="flex items-center gap-2 font-semibold text-primary"
        >
          Ver todas
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Lista */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg border border-border p-2 scrollbar-none">
        {serviceOrders.map((order) => (
          <div
            key={order.id}
            className="flex shrink-0 items-center justify-between gap-4 rounded-lg border border-border/50 bg-white px-4 py-4 shadow-md"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-full flex flex-col items-center gap-2">
                
                <span
                  className={`rounded-full p-3 text-sm font-bold tracking-wider ${getStatusClass(
                    order.status,
                  )}`}
                >
                  <CarFront />
                </span>
                
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-4">
                  <span className="truncate text-lg font-bold">
                    {formatPlate(order.vehicle.plate)}
                  </span>
                  

                  <span
                    className={`flex shrink-0 items-center rounded px-2.5 py-1 text-[12px] font-bold tracking-wider ${getStatusClass(
                      order.status,
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <span className={`text-xs font-semibold text-primary`}>OS #{order.id}</span>

                <p className="truncate text-sm text-muted-foreground">
                  {order.vehicle.brand} - {order.vehicle.model} -{" "}
                  {order.vehicle.color}
                </p>

                <span className="mb-1 truncate text-sm">
                  {order.vehicle.customer.name}
                </span>

                <div className="flex gap-2">
                  <span className="flex items-center gap-2 truncate text-sm text-muted-foreground">
                    <Clock size={14} />
                    {formatDateTime(order.createdAt)}
                  </span>

                  <span className="text-sm font-bold text-foreground">
                    {formatToBRL(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={`/ordens-servico/${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 cursor-pointer font-semibold hover:underline"
            >
              <ChevronRight />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


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
