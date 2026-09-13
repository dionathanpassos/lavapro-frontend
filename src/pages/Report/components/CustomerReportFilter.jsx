import { useState } from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";

export default function CustomerReportFilter({ onSearch }) {
  const INITIAL_FILTERS = {
    search: "",
    sort: "amountPayment,DESC",
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
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 pb-8 pt-2">
      <Input
        label={"Buscar"}
        type={"text"}
        name={"search"}
        placeholder={"Buscar por cliente, telefone, modelo, marca ou placa..."}
        className={"col-span-2"}
        value={filters.search}
        onChange={handleChange}
      />

      <Select
        label={"Ordernar"}
        name={"sort"}
        value={filters.sort}
        onChange={handleChange}
        options={[
          { value: "amountPayment,DESC", label: "Maior faturamento" },
          { value: "amountPayment,ASC", label: "Menor faturamento" },
          { value: "totalOrders,DESC", label: "Maior N de OS" },
          { value: "totalOrders,ASC", label: "Menor N de OS" },
        ]}
      />
      <Input
        label={"Data inicial"}
        name={"startDate"}
        value={filters.startDate}
        onChange={handleChange}
        type={"date"}
      />
      <Input
        label={"Data final"}
        name={"endDate"}
        value={filters.endDate}
        onChange={handleChange}
        type={"date"}
      />
      <div className="flex items-end">
        <Button type="button" onClick={handleClear}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
