import { CarFront, ChevronRight, Eye, Info, Pencil, User } from "lucide-react";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import VehicleFilter from "./VehicleFilter";

export default function VehicleTable({
  vehicles,
  onDetails,
  onEdit,
  onSearch,
}) {
  return (
    <>
      <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md">
        <VehicleFilter onSearch={onSearch} />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Placa</th>
                <th className="py-3 px-4">Veículo</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Ano</th>
                <th className="py-3 px-4">Cor</th>
                <th className="py-3 px-4 w-10">Açoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {vehicles.length == 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-muted-foregroundr"
                  >
                    <div className="flex flex-col gap-4 items-center justify-center text-muted-foreground">
                      <span>
                        <Info size={50} />
                      </span>
                      <span>Nenhum veículo encontrado</span>
                    </div>
                  </td>
                </tr>
              )}
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 ">
                    <div className="text-sm text-foreground font-semibold border border-border w-fit p-1 rounded-md truncate">
                      {formatPlate(vehicle.plate)}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-sm text-foreground">
                      {vehicle.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.brand}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate">
                        {vehicle.customer.name}
                      </span>
                      <span className="text-sm text-muted-foreground truncate">
                        {formatPhone(vehicle.customer.phone)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 ">
                    <div className="text-sm text-foreground">
                      {vehicle.year}
                    </div>
                  </td>
                  <td className="py-4 px-4 ">
                    <div className="text-sm text-foreground">
                      {vehicle.color}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex gap-4">
                      <button
                        onClick={() => onDetails(vehicle)}
                        className="rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                      >
                        <Eye className="w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="rounded-full px-2 py-1 cursor-pointer hover:bg-primary hover:text-foreground-secondary transition-colors duration-300 active:scale-95 active:opacity-90"
                      >
                        <Pencil className="w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Tabela mobile */}
      <div className="hidden flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">Veículos cadastrados</h1>
          <Select
            name={"sort"}
            onChange={onSearch}
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
        </div>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-background-white border border-border px-4 py-2 rounded-md"
          >
            <div className="flex justify-between gap-4 items-center">
              <div className="flex items-center gap-4">
                <p className="bg-primary/20 text-primary p-3 rounded-full">
                  <CarFront />
                </p>
                <div>
                  <p className="text-lg font-semibold">
                    {formatPlate(vehicle.plate)}
                  </p>
                  <div className="flex text-muted-foreground">
                    <p className="text-xs">{vehicle.brand}</p>
                    <p className="text-xs">/{vehicle.model}</p>
                    <p className="text-xs">/{vehicle.color}</p>
                    <p className="text-xs">/{vehicle.year}</p>
                  </div>
                  <span className="flex gap-1 items-center text-xs text-muted-foreground">
                    <User className="w-4" /> {vehicle.customer.name}
                  </span>
                </div>
              </div>
              <button onClick={() => onDetails(vehicle)}>
                <ChevronRight className="" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
