
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { useNavigate } from "react-router";

export default function CustomerTableReport({ customers, label }) {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <div className="flex justify-between">
        <span className="font-bold text-lg flex items-center">
          {label}
        </span>
      
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Telefone</th>
              <th className="py-3 px-4">Total de Ordens</th>
              <th className="py-3 px-4">Faturamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-primary/10 transition-colors"
              >
                <td className="px-4 py-2 text-foreground">{customer.customerName}</td>
                <td className="px-4 text-foreground">
                  {formatPhone(customer.customerPhone)}
                </td>
                <td className="px-4 text-foreground">{customer.totalOrders}</td>

                <td className="px-4 font-bold text-foreground">
                  {formatToBRL(customer.amountPayment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => navigate("/relatorios/clientes")}
          className="flex items-center gap-2 py-2 px-4 border border-gray-200 rounded-lg bg-white text-[13px] font-semibold text-primary cursor-pointer hover:bg-gray-50 transition-colors"
        >
          Ver relatório completo <span>➔</span>
        </button>
      </div>
    </div>
  );
}


