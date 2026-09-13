import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";


export default function PaymentTableReport({ payments }) {

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gra-500 uppercase tracking-wider">
              <th className="py-3 px-4">Nº OS</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Veiculo</th>
              <th className="py-3 px-4">Placa</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Meio de pagamento</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-primary/10 transition-colors"
              >
                
                <td className="px-4 py-2">
                  <div className="font-semibold text-primary">
                    #<a className="cursor-pointer hover:underline" href={`/ordens-servico/${payment.serviceOrderId}`} target="_blank" rel="noopener noreferrer">{payment.id}</a>
                  </div>
                </td>
                <td className="px-4 text-foreground">
                  {payment.customerName}
                </td>
                <td className="px-4">
                  <div className="flex gap-4">
                    <span className="font-semibold text-foreground">{payment.vehicleBrand} {payment.vehicleModel}</span>
                    
                  </div>
                </td>
                <td className="px-4">
                  <div className="flex gap-4">
                    <span className="text-xs text-muted-foreground uppercase">{formatPlate(payment.vehiclePlate)}</span>
                  </div>
                </td>
                <td className="px-4">
                  <div className="text-foreground">
                    {formatDateTime(payment.paidAt)}
                  </div>
                </td>
                <td className="px-4 text-foreground">
                  {getMethodText(payment.paymentMethod)}
                </td>
                <td className="px-4 ">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${getStatusClasses(payment.paymentStatus)}`}
                  >
                    {getStatusText(payment.paymentStatus)}
                  </span>
                </td>
                <td className="px-4 font-bold text-foreground">
                  {formatToBRL(payment.amount)}
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

