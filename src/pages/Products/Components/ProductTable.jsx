import { Pencil } from "lucide-react";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import Switch from "../../../components/Swicth/Swicth";
import ProductFilter from "./ProductFilter";

export default function ProductTable({
  products,
  onEdit,
  onSearch,
  onStatusChange,
  loadingIds = [],
}) {
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <ProductFilter onSearch={onSearch} />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nome do Serviço</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Cadastrado em</th>
              <th className="py-3 px-4">preço</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 w-10">Açoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {products.map((product) => {
              const isUpdating = loadingIds.includes(product.id);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-primary/10 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-foreground">
                    #{product.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-primary">
                      {product.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {getServiceText(product.type)}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {formatDateTime(product.createdAt)}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {formatToBRL(product.price)}
                  </td>
                  <td className="py-4 px-4 flex items-center gap-3 w-40">
                    <Switch
                      checked={product.active}
                      isLoading={isUpdating}
                      onChange={() =>
                        onStatusChange(product.id, product.active)
                      }
                    />
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${getStatusClasses(product.active)}`}
                    >
                      {product.active ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex gap-4">
                      <button
                        onClick={() => onEdit(product)}
                        disabled={isUpdating}
                        className="rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Pencil className="w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const getStatusClasses = (status) => {
  switch (status) {
    case true:
      return "bg-emerald-50 text-emerald-600";
    case false:
      return "bg-destructive-light text-destructive";
    default:
      return "bg-gray-50 text-gray-600 ";
  }
};

const getServiceText = (status) => {
  if (status === "SERVICE") return "SERVIÇO";
  if (status === "PRODUCT") return "PRODUTO";
  return status;
};
