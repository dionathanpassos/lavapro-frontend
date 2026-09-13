import { ChevronRight, Eye, Info, Pencil, Phone } from "lucide-react";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import CustomerFilter from "./CustomerFilter";

export default function CustomerTable({
  customers,
  onDetails,
  onEdit,
  onSearch,
}) {
  return (
    <>
      {/* Tabela desktop  */}
      <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
        <CustomerFilter onSearch={onSearch}/>

        {/* table  */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Contato</th>
                <th className="py-3 px-4">Cadastro</th>

                <th className="py-3 px-4 w-10">Açoes</th>
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
                  key={customer.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 ">
                    <div className="text-sm font-bold text-foreground truncate">
                      {customer.name}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-sm text-foreground truncate">
                      {formatPhone(customer.phone)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-foreground">
                      {formatDateTime(customer.createdAt)}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex gap-4">
                      <button
                        onClick={() => onDetails(customer)}
                        className="rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                      >
                        <Eye className="w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(customer)}
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

      {/* Tabela mobile  */}
      <div className="hidden flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">Clientes cadastrados</h1>
          <Select
            name={"sort"}
            onChange={onSearch}
            options={[
              { value: "createdAt,DESC", label: "Mais Recentes" },
              { value: "createdAt,ASC", label: "Mais Antigas" },
              { value: "name,ASC", label: "Nome A-Z" },
              { value: "name,DESC", label: "Nome Z-A" },
              { value: "phone,ASC", label: "Telefone A-Z" },
              { value: "phone,DESC", label: "Telefone Z-A" },
            ]}
          />
        </div>
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-background-white border border-border px-4 py-4 rounded-md"
          >
            <div className="flex justify-between gap-4 items-center">
              <div className="flex items-center gap-4">
                <p className="w-12 text-center bg-primary/20 text-primary p-3 rounded-full font-semibold">
                  {customer.name
                    .trim()
                    .split(/\s+/, 2)
                    .map((palavra) => palavra[0])
                    .join("")}
                </p>
                <div>
                  <p className="text-lg font-semibold">{customer.name}</p>
                  <p className="flex gap-2 items-center text-muted-foreground text-sm">
                    <Phone size={16} />
                    {formatPhone(customer.phone)}
                  </p>
                </div>
              </div>
              <button onClick={() => onDetails(customer)}>
                <ChevronRight className="" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
