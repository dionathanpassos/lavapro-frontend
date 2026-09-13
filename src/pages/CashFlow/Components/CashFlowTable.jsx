import { Eye } from "lucide-react";
import CashFlowFilter from "./CashFlowFilter";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CashFlowTable({
  cashFlows,
  onDetails,
  onSearch, 
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <div className="flex md:hidden mb-4  justify-end  ">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-fit bg-primary hover:bg-primary-hover text-foreground-secondary font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>
      <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full transition-all`}>
        <CashFlowFilter onSearch={onSearch} />
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-30">Origem</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Veículo</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Meio de pagamento</th>
              <th className="py-3 px-4">Valor</th>
              <th className="py-3 px-4 w-10">Açoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {cashFlows.map((cashFlow) => (
              <tr
                key={cashFlow.id}
                className="hover:bg-primary/10 transition-colors"
              >
                <td className="py-4 px-4 text-foreground">
                  
                  <Link
                  to={`/ordens-servico/${cashFlow.serviceOrderId}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer font-semibold"
                >
                    OS - #{cashFlow.serviceOrderId}
                </Link>
                </td>
                <td className="py-4 px-4 text-foreground">
                  {formatDateTime(cashFlow.createdAt)}
                </td>
                <td className="py-4 px-4 text-primary font-semibold hover:underline cursor-pointer truncate">
                  {cashFlow.customerName}
                </td>
                <td className="py-4 px-4 text-primary font-semibold hover:underline cursor-pointer truncate">
                  {formatPlate(cashFlow.vehiclePlate)}

                </td>
                <td className="py-4 px-4 text-foreground">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[12px] font-semibold tracking-wide ${getStatusClasses(cashFlow.category)}`}>
                    {getStatusText(cashFlow.category)}
                  </span>
                </td>
                <td className="py-4 px-4 text-foreground">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[12px] font-semibold tracking-wide ${getStatusClasses(cashFlow.type)}`}>
                    {getStatusText(cashFlow.type)}
                  </span>
                </td>
                
                
                <td className="py-4 px-4 text-foreground ">
                  {getMethodText(cashFlow.paymentMethod)}
                </td>
                <td className="py-4 px-4">
                  <div className={`font-semibold ${cashFlow.type === "INCOME" ? "text-success" : "text-destructive"}`}>
                    {formatToBRL(cashFlow.amount)}
                  </div>
                </td>
                
                <td className="py-4 px-4 text-right">
                  <div className="flex gap-4">
                    <button
                      onClick={() => onDetails(cashFlow)}
                      className="rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                    >
                      <Eye className="w-4" />
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

    case "PAYMENT":
    case "INCOME":
      return "text-success";

    case "REFUND":
    case "EXPENSE":
      return "text-destructive";
   
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
  if (status === "DEBIT_CARD") return "Cartão de Débito";
  if (status === "CREDIT_CARD") return "Cartão de Crédito";
  if (status === "PIX") return "Pix";
  if (status === "CASH") return "Dinheiro";
  if (status === "BANK_TRANSFER") return "Transferência Bancária";
  return status;
};


