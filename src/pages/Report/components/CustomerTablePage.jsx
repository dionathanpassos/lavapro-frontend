import { Info } from "lucide-react";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import CustomerReportFilter from "./CustomerReportFilter";

export default function CustomerTablePage({
  customers,
  onSearch,
}) {
  return (
    <>
      <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
        <CustomerReportFilter
          onSearch={onSearch}
        />

      {/* table  */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Contato</th>
                <th className="py-3 px-4">Nº de OS</th>
                <th className="py-3 px-4">Faturamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {customers.length == 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-muted-foregroundr"
                  >
                    <div className="flex flex-col gap-4 items-center justify-center text-muted-foreground">
                      <span>
                        <Info size={50} />
                      </span>
                      <span>Nenhum cliente encontrado</span>
                    </div>
                  </td>
                </tr>
              )}
              {customers.map((customer) => (
                <tr
                  key={customer.customerId}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 ">
                    <div className="text-sm text-foreground">
                      {customer.customerName}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-foreground">
                      {formatPhone(customer.customerPhone)}
                    </div>
                  </td>
                  <td className="px-4 text-foreground">
                  {customer.totalOrders}
                </td>
                <td className="px-4 font-bold">
                  {formatToBRL(customer.amountPayment)}
                </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>

    
    </>
  );
}
