import {
  Calendar,
  Trash2, 
  X,
} from "lucide-react";
import Button from "../../../components/Button/Button";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";

export default function PaymentDetailDrawer({
  open,
  onClose,
  payment,
  onCancel,
}) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full md:w-115 bg-background-white px-6 py-12 border-l border-border shadow-2xl flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <header className="mb-6 p-2">
        <h1 className="text-xl font-semibold">Pagamento #{payment.id}</h1>
        <button
          onClick={() => {
            onClose(false);
          }}
          className="absolute top-5 right-5"
        >
          <X className="active:scale-95 active:opacity-90 hover:text-foreground/70" />
        </button>
      </header>

      <div className="flex justify-between mb-5 p-2 text-sm">
        <span
          className={`inline-block px-2.5 py-1 rounded text-sm font-bold tracking-wide ${getStatusClasses(payment.paymentStatus)}`}
        >
          {getStatusText(payment.paymentStatus)}
        </span>
        <span className="flex gap-2 items-center">
          <Calendar className="w-4" />
          {formatDateTime(payment.paidAt)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto  space-y-5">
    
        <div className="border border-border rounded-xl p-4 space-y-4 text-sm">
          <h3 className="font-bold text-slate-900 mb-4">Informações da OS</h3>
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-600 hover:underline cursor-pointer">
              OS #{payment.serviceOrderId}
            </span>
            
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-0.5">
                Cliente
              </p>
              <p className="font-semibold text-slate-700">{payment.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium mb-0.5">
                &nbsp;
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-0.5">
                Veículo
              </p>
              <p className="font-semibold text-slate-700">{payment.vehicleBrand} {payment.vehicleModel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium mb-0.5">
                &nbsp;
              </p>
              <p className="text-slate-600">{formatPlate(payment?.vehiclePlate)}</p>
            </div>
          </div>
        </div>


        <div className="border border-border rounded-xl p-4 space-y-2 text-sm">
          <h3 className="font-bold text-slate-900 mb-4">Valores</h3>
          <div className="flex justify-between text-slate-600">
            <span>Total da OS</span>
            <span className="font-medium">{formatToBRL(payment.amount)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Valor do pagamento</span>
            <span className="font-medium">{formatToBRL(payment.amount)}</span>
          </div>
          
        </div>
   
        <div className="border border-border rounded-xl p-4 space-y-2 text-sm">
          <h3 className="font-bold text-slate-900 mb-4">Pagamento</h3>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Meio de pagamento</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
               {getMethodText(payment.paymentMethod)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Status</span>
            <span className={` text-xs font-semibold px-2 py-0.5 rounded ${getStatusClasses(payment.paymentStatus)}`}>
              {getStatusText(payment.paymentStatus)}
            </span>
          </div>
          
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          action={"cancel"}
          type={"button"}
          onClick={() => {
            onCancel(payment);
          }}
        >
          <Trash2 size={15}/>
          Cancelar pagamento
        </Button>
        <Button
          type={"button"}
          onClick={() => {
            onClose(false);
          }}
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}

const getStatusText = (status) => {
  if (status === "PAID") return "PAGO";
  if (status === "REFOUND") return "ESTORNADO";
  if (status === "CANCELED") return "CANCELADO";
  return status;
};
const getStatusClasses = (status) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-600";
    case "CANCELED":
      return "bg-destructive-light text-destructive";
    default:
      return "bg-gray-50 text-gray-600 ";
  }
};
const getMethodText = (status) => {
  if (status === "DEBIT_CARD") return "CARTÃO DE DÉBITO";
  if (status === "CREDIT_CARD") return "CARTÃO DE CRÉDITO";
  if (status === "PIX") return "PIX";
  if (status === "CASH") return "DINHEIRO";
  if (status === "BANK_TRANSFER") return "TRANSFÊNCIA BANCÁRIA";
  return status;
};
