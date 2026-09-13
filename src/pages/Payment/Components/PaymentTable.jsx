import { Pencil } from "lucide-react";
import PaymentFilter from "./PaymentFilter";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import { Link } from "react-router-dom";

export default function PaymentTable({ payments, onDetails, onSearch }) {
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <PaymentFilter onSearch={onSearch} />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nº OS</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Veiculo</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Meio de pagamento</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Valor</th>
              <th className="py-3 px-4 w-10">Açoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-primary/10 transition-colors"
              >
                <td className="py-4 px-4 font-bold text-foreground">
                  #{payment.id}
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-primary">
                    <Link
                      to={`/ordens-servico/${payment.serviceOrderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline cursor-pointer font-bold"
                    >
                      #{payment.serviceOrderId}
                    </Link>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {payment.customerName}
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-gray-900">
                    {payment.vehicleBrand} {payment.vehicleModel}
                  </div>
                  <div className="text-xs text-gray-400 uppercase">
                    {formatPlate(payment.vehiclePlate)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">
                    {formatDateTime(payment.paidAt)}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {getMethodText(payment.paymentMethod)}
                </td>
                <td className="py-4 px-4 ">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${getStatusClasses(payment.paymentStatus)}`}
                  >
                    {getStatusText(payment.paymentStatus)}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-gray-900">
                  {formatToBRL(payment.amount)}
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex gap-4">
                    <button
                      onClick={() => onDetails(payment)}
                      className="rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                    >
                      <Pencil className="w-4" />
                    </button>
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
const getMethodText = (status) => {
  if (status === "DEBIT_CARD") return "CARTÃO DE DÉBITO";
  if (status === "CREDIT_CARD") return "CARTÃO DE CRÉDITO";
  if (status === "PIX") return "PIX";
  if (status === "CASH") return "DINHEIRO";
  if (status === "BANK_TRANSFER") return "TRANSFÊNCIA BANCÁRIA";
  return status;
};
