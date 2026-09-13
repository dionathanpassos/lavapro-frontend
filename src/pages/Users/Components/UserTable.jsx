import { Pencil } from "lucide-react";
import Switch from "../../../components/Swicth/Swicth";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import UserFilter from "./UserFilter";
import { useState } from "react";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";

export default function UserTable({
  users,
  onEdit,
  onSearch,
  onStatusChange,
  loadingIds = [],
}) {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
      <div className="flex md:hidden mb-4 justify-end  ">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-fit bg-primary hover:bg-primary-hover text-foreground-secondary font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
      </div>
      <div
        className={`${showFilters ? "block" : "hidden"} md:block w-full transition-all`}
      >
        <UserFilter onSearch={onSearch} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Usuário</th>
              <th className="py-3 px-4">Função</th>
              <th className="py-3 px-4">Telefone</th>
              <th className="py-3 px-4">Cadastrado em</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 w-10">Açoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((user) => {
              // Verifica se este produto específico está atualizando na API
              const isUpdating = loadingIds.includes(user.id);

              return (
                <tr
                  key={user.id}
                  className="hover:bg-primary/10 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{getUserRole(user.role)}</td>
                  <td className="py-4 px-4">{formatPhone(user.phone)}</td>
                  <td className="py-4 px-4">
                    {formatDateTime(user.createdAt)}
                  </td>

                  <td className="py-4 px-4 ">
                    <div className="flex items-center gap-3 w-40 h-full">
                      <Switch
                        checked={user.active}
                        isLoading={isUpdating}
                        onChange={() => onStatusChange(user.id, user.active)}
                      />
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${getStatusClasses(user.active)}`}
                      >
                        {user.active ? "ATIVO" : "INATIVO"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex gap-4">
                      <button
                        onClick={() => onEdit(user)}
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

const getUserRole = (role) => {
  if (role === "ROLE_OWNER") return "Proprietário";
  if (role === "ROLE_ADMIN") return "Administrador";
  if (role === "ROLE_EMPLOYEE") return "Atendente";
  return role;
};
