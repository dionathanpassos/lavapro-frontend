import {
  Calendar,  
  X,
} from "lucide-react";
import Button from "../../../components/Button/Button";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { useNavigate } from "react-router";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";

export default function CashFlowDetailDrawer({
  open,
  onClose,
  cashFlow,
}) {
  const navigate = useNavigate();

  function handleOpenDetails(id) {
    navigate(`/ordens-servico/${id}`);
  }
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full md:w-110 bg-background-white px-6 py-12 border-l border-border shadow-2xl flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <header className="mb-6 p-2">
        <h1 className="text-xl font-semibold">Detalhes do lançamento</h1>
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
          className={`inline-block px-2.5 py-1 rounded text-sm font-bold tracking-wide ${getStatusClasses(cashFlow.type)}`}
        >
          {getStatusText(cashFlow.type)}
        </span>
        <span className="flex gap-2 items-center">
          <Calendar className="w-4" />
          {formatDateTime(cashFlow.createdAt)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Informações da OS */}
        <div className="border border-border rounded-xl p-4 space-y-4 text-sm">
          <h3 className="font-bold text-slate-900 mb-4">Informações da OS</h3>
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-600 hover:underline cursor-pointer">
              Pagamento OS #{cashFlow.serviceOrderId}
            </span>
            
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 items-center">
              <p className="text-muted-foreground">
                Data Pagamento
              </p>
              <p className="font-semibold text-foreground">{formatDateTime(cashFlow.createdAt)}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p className="text-muted-foreground">
                Categoria
              </p>
              <p className="font-semibold text-foreground">{getStatusText(cashFlow.category)}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p className="text-muted-foreground">
                Origem
              </p>
              <p onClick={() => handleOpenDetails(cashFlow.serviceOrderId)} className="font-semibold text-primary cursor-pointer hover:underline">Ordem de Serviço #{cashFlow.serviceOrderId}</p>
              
            </div>
            <div className="grid grid-cols-2 items-center">
              <p className="text-muted-foreground">
                Cliente
              </p>
              <p className="text-primary font-semibold hover:underline cursor-pointer">{cashFlow.customerName}</p>
            </div>
             <div className="grid grid-cols-2 items-center">
              <p className="text-muted-foreground">
                Veículo
              </p>
              <p className="text-primary font-semibold hover:underline cursor-pointer">{formatPlate(cashFlow.vehiclePlate)}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p className="text-muted-foreground">
                Forma de Pagamento
              </p>
              <p className="font-semibold text-foreground">{getMethodText(cashFlow.paymentMethod)}</p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="border border-border rounded-xl p-4 space-y-2 text-sm">
          <h3 className="font-bold text-foreground mb-4">Valores da transacao</h3>
          <div className="flex justify-between text-muted-foreground">
            <span>Valor</span>
            <span className={`font-semibold text-[16px] ${cashFlow.type === "INCOME" ? "text-success" : "text-destructive"}`}>{formatToBRL(cashFlow.amount)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
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

const getStatusClasses = (status) => {
  switch (status) {

    case "PAYMENT":
    case "INCOME":
      return "bg-success-light text-success";

    case "REFUND":
    case "EXPENSE":
      return "bg-destructive-light text-destructive";
   
    default:
      return "bg-gray-50 text-gray-600 ";
  }
};

const getStatusText = (status) => {
  if (status === "PAYMENT") return "RECEBIMENTO";
  if (status === "REFUND") return "ESTORNO";
  if (status === "CANCELED") return "CANCELADO";
  if (status === "INCOME") return "ENTRADA";
  if (status === "EXPENSE") return "SAÍDA";
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
