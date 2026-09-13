import { X } from "lucide-react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import SelectCustomerSearch from "./SelectCustomerSearch.jsx";

export default function VehicleFormDrawer({
  open,
  editing,
  onSubmit,
  form,
  onChange,
  errors,
  onClose,
}) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full md:w-110 bg-background-white px-6 py-12 border-l border-border shadow-2xl flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <header className="mb-6">
        <h1 className="text-xl font-semibold">
          {editing ? "Editar Veículo" : "Novo Veículo"}
        </h1>
        <span className="text-muted-foreground text-sm">
          {editing
            ? "Editar os dados do veículo. "
            : "Preencha os dados para cadastrar um novo veículo."}
        </span>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-col flex-1 justify-between gap-6 "
      >
        <div className="flex flex-col gap-6">
          <SelectCustomerSearch
            value={form.customerId}
            onChange={onChange}
            error={errors.customerId}
          />
          <span className="font-semibold border-b border-border py-4">
            Dados do veículo
          </span>
          <Input
            label={"Placa"}
            name={"plate"}
            type={"text"}
            value={form.plate}
            placeholder={"Ex.: ABC-1D23"}
            onChange={onChange}
            error={errors?.plate}
          />
          <Input
            label={"Modelo"}
            name={"model"}
            type={"text"}
            value={form.model}
            placeholder={"Ex.: ONIX"}
            onChange={onChange}
            error={errors?.model}
          />
          <Input
            label={"Marca"}
            name={"brand"}
            type={"text"}
            value={form.brand}
            placeholder={"Ex.: Chevrolet"}
            onChange={onChange}
            error={errors?.brand}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={"Ano"}
              name={"year"}
              type={"text"}
              value={form.year}
              placeholder={"Ex.: 2026"}
              onChange={onChange}
              error={errors?.year}
            />
            <Input
              label={"Cor"}
              name={"color"}
              type={"text"}
              value={form.color}
              placeholder={"Ex.: Prata"}
              onChange={onChange}
              error={errors?.color}
            />
          </div>
          
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type={"button"}
            action={"cancel"}
            onClick={() => {
              onClose(false);
            }}
          >
            Cancelar
          </Button>
          <Button type={"submit"}>Salvar</Button>
        </div>
      </form>

      <button
        onClick={() => {
          onClose(false);
        }}
        className="absolute top-5 right-5"
      >
        <X className="active:scale-95 active:opacity-90 hover:text-foreground/70" />
      </button>
    </div>
  );
}
