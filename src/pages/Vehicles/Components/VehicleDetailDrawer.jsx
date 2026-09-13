import { User, X } from "lucide-react";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { formatPhone } from "../../../utils/Formatted/formatPhone";

export default function VehicleDetailDrawer({ open, onClose, vehicle, onEdit }) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full md:w-110 bg-background-white px-6 py-12 border-l border-border shadow-2xl flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Detalhes do veículo</h1>
        <span className="text-muted-foreground text-sm">
          Visualize os dados do veículo.
        </span>
      </header>

      <form className="flex flex-col flex-1 justify-between gap-6 ">
        <div className="flex flex-col gap-6">
          <span className="font-semibold border-b border-border py-4">
            Dados do veículo
          </span>
          <Input
            label={"Placa"}
            name={"plate"}
            type={"text"}
            value={vehicle.plate}
          />

          <Input
            label={"Modelo"}
            name={"model"}
            type={"text"}
            value={vehicle.model}
          />
          <Input
            label={"Marca"}
            name={"brand"}
            type={"text"}
            value={vehicle.brand}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={"Ano"}
              name={"year"}
              type={"text"}
              value={vehicle.year}
              className={""}
            />
            <Input
              label={"Cor"}
              name={"color"}
              type={"text"}
              value={vehicle.color}
            />
          </div>
          <span className="font-semibold border-b border-border py-4">
            Cliente
          </span>
          {vehicle?.vehicles?.length == 0 ? (
            <span>Nenhum cliente cadastrado</span>
          ) : (
            <div className="flex items-center px-6 py-2 gap-6 border border-border rounded-md">
              <span className="">
                <User size={30} />
              </span>
              <div className="flex flex-col text-sm ">
                <span>{vehicle.customer?.name}</span>
                <span>{formatPhone(vehicle.customer?.phone)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type={"button"}
            onClick={() => {
              onEdit(vehicle);
              onClose(false);
            }}
          >
            Editar
          </Button>
          <Button
            type={"button"}
            onClick={() => {
              onClose(false);
            }}
          >
            Fechar
          </Button>
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
