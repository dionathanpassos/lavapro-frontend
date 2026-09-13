import { X } from "lucide-react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";

export default function ProductFormDrawer({
  open,
  editing,
  onSubmit,
  form,
  onChange,
  errors,
  onClose
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
          {editing ? "Editar produto ou serviço" : "Novo produto ou serviço"}
        </h1>
        <span className="text-muted-foreground text-sm">
          {editing
            ? "Editar os dados do item. "
            : "Preencha os dados para cadastrar um novo item."}
        </span>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-col flex-1 justify-between gap-6 "
      >
        <div className="flex flex-col gap-6">
          <span className="font-semibold border-b border-border py-4">
            Dados do produto ou serviço
          </span>
          <Input
            label={"Descrição"}
            name={"name"}
            type={"text"}
            value={form.name}
            placeholder={"Descição do produto ou serviço"}
            onChange={onChange}
            error={errors?.name}
          />
          <Select
            label={"Tipo"}
            name={"type"}
            value={form.type}
            onChange={onChange}
            error={errors?.type}
            options={[
              { value: "SERVICE", label: "Serviço" },
              { value: "PRODUCT", label: "Produto" },
            ]}
          />
          <Input
            label={"Preço"}
            name={"price"}
            type={"text"}
            value={formatToBRL(form?.price)}
            placeholder={"R$ 00,00"}
            onChange={onChange}
            error={errors?.price}
          />
          

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
