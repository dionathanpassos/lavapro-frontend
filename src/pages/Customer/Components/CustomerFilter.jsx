import { useState } from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";

export default function CustomerFilter({ onSearch }) {
  const INITIAL_FILTERS = {
    search: "",
    sort: "createdAt,DESC",
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
          { value: "createdAt,DESC", label: "Mais Recentes" },
          { value: "createdAt,ASC", label: "Mais Antigas" },
          { value: "name,ASC", label: "Nome A-Z" },
          { value: "name,DESC", label: "Nome Z-A" },
          { value: "phone,ASC", label: "Telefone A-Z" },
          { value: "phone,DESC", label: "Telefone Z-A" },
        ]}
      />
      <div className="flex items-end">
        <Button type="button" onClick={handleClear}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
