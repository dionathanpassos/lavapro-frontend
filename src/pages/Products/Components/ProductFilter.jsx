import { useState } from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";

export default function ProductFilter({ onSearch }) {
  const INITIAL_FILTERS = {
    search: "",
    active: "",
    type: "",
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
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-4 pb-8 pt-2">
      <Input
        label={"Buscar"}
        type={"text"}
        name={"search"}
        placeholder={"Buscar por nome do servico"}
        className={"col-span-2"}
        value={filters.search}
        onChange={handleChange}
      />
      <Select
        label={"Status"}
        name={"status"}
        value={filters.status}
        onChange={handleChange}
        options={[
          { value: "", label: "Todos" },
          { value: true, label: "Ativo" },
          { value: false, label: "Inativo" },
        ]}
      />
      <Select
        label={"Tipo"}
        name={"type"}
        value={filters.type}
        onChange={handleChange}
        options={[
          { value: "", label: "Todos" },
          { value: "SERVICE", label: "Servico" },
          { value: "PRODUCT", label: "Produto" },
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
          { value: "name,ASC", label: "Nome A-Z" },
          { value: "name,DESC", label: "Nome Z-A" },
          
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
