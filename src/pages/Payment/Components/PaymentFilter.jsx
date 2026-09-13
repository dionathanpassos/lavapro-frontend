import { useState } from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";

export default function PaymentFilter({ onSearch }) {
  const INITIAL_FILTERS = {
    search: "",
    paymentStatus: "",
    paymentMethod: "",
    sort: "createdAt,DESC",
    startDate: "",
    endDate: "",
  };

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };

    setFilters(updatedFilters);

    if (onSearch) {
      onSearch(updatedFilters);
    }
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);

    if (onSearch) {
      onSearch(INITIAL_FILTERS);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-4 pb-8 pt-2">
      <Input
        label={"Buscar"}
        type={"text"}
        name={"search"}
        placeholder={"Buscar por cliente, veículo, placa"}
        className={"col-span-2"}
        value={filters.search} // Controlado pelo estado
        onChange={handleChange}
      />
      <Select
        label={"Status"}
        name={"paymentStatus"}
        value={filters.paymentStatus}
        onChange={handleChange}
        options={[
          { value: "", label: "Todos" },
          { value: "PAID", label: "Pago" },
          { value: "CANCELED", label: "Cancelado" },
          { value: "REFOUNDED", label: "Estornado" },
        ]}
      />
      <Select
        label={"Meio de pagamento"}
        name={"paymentMethod"}
        value={filters.paymentMethod}
        onChange={handleChange}
        options={[
          { value: "", label: "Todos" },
          { value: "PIX", label: "PIX" },
          { value: "CREDIT_CARD", label: "Cartão de Crédito" },
          { value: "DEBIT_CARD", label: "Cartão de Débito" },
          { value: "CASH", label: "Dinheiro" },
          { value: "BANK_TRANSFER", label: "Transferência" },
        ]}
      />
      <Select
        label={"Ordernar"}
        name={"sort"}
        value={filters.sort}
        onChange={handleChange}
        options={[
          { value: "createdAt,DESC", label: "Mais Recentes" },
          { value: "createdAt,ASC", label: "Mais Antigas" },
        ]}
      />
      <Input
        label={"Data inicial"}
        name={"startDate"}
        type={"date"}
        value={filters.startDate}
        onChange={handleChange}
      />
      <Input
        label={"Data final"}
        name={"endDate"}
        type={"date"}
        value={filters.endDate}
        onChange={handleChange}
      />
      <div className="flex items-end">
        <Button type="button" onClick={handleClear}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
