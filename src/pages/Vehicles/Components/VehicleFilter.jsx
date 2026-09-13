import { useState } from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";

export default function VehicleFilter({ onSearch }) {
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
          { value: "plate,ASC", label: "Placa A-Z" },
          { value: "plate,DESC", label: "Placa Z-A" },
          { value: "model,ASC", label: "Modelo A-Z" },
          { value: "model,DESC", label: "Modelo Z-A" },
          { value: "brand,ASC", label: "Marca A-Z" },
          { value: "brand,DESC", label: "Marca Z-A" },
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
