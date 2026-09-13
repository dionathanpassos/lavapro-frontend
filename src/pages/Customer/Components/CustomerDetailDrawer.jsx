import { CarFront, X } from "lucide-react";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

export default function CustomerDetailDrawer({ open, onClose, customer, onEdit }) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full md:w-110 bg-background-white px-6 py-12 border-l border-border shadow-2xl flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Detalhes do cliente</h1>
        <span className="text-muted-foreground text-sm">
          Visualize os dados do cliente.
        </span>
      </header>

      <form className="flex flex-col flex-1 justify-between gap-6 ">
        <div className="flex flex-col gap-6">
          <span className="font-semibold border-b border-border py-4">
            Dados pessoais
          </span>
          <Input
            label={"Nome completo"}
            name={"name"}
            type={"text"}
            value={customer.name}
          />

          <Input
            label={"Telefone - WhatsApp"}
            name={"phone"}
            type={"text"}
            value={customer.phone}
          />
          <span className="font-semibold border-b border-border py-4">
            Veículos
          </span>
          {customer?.vehicles?.length == 0 ? (
            <span>Nenhum veiculo cadastrado</span>
          ) : (
            <>
              {customer?.vehicles?.map((vehicle) => (
                <div className="flex items-center px-6 py-2 gap-6 border border-border rounded-md">
                  <span className="">
                    <CarFront size={30} />
                  </span>
                  <div className="flex flex-col text-sm ">
                    <span>Placa: {vehicle.plate}</span>
                    <span>Modelo: {vehicle.model}</span>
                    <span>Marca: {vehicle.brand }</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type={"button"}
            onClick={() => {
              onEdit(customer);
              onClose(false)
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
