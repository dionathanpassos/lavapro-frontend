import { useState, useEffect, useRef } from "react";
import { Search, Car } from "lucide-react";
import { getVehicle } from "../../../services/vehicleService"; // Ajuste o caminho do seu service aqui
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";

export default function SelectVehicleSearch({ value, onChange, error, selectedVehicle  }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(""); // Guarda "Modelo - Placa"
  const containerRef = useRef(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        if (value && selectedLabel) {
          setSearchTerm(selectedLabel);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, selectedLabel]);

  useEffect(() => {
    if (selectedVehicle) {
      const label = `${selectedVehicle.model} - ${selectedVehicle.plate}`;
      setSelectedLabel(label);
      setSearchTerm(label);
    } else if (!value) {
      // Se não houver valor nem veículo selecionado, limpa o campo (Modo Criação)
      setSearchTerm("");
      setSelectedLabel("");
    }
  }, [selectedVehicle, value]);

  // Carrega os dados do veículo ao entrar em modo de Edição (Se necessário)
  // Caso tenha uma função 'getVehicleById', você pode descomentar e ajustar aqui:
  /*
  useEffect(() => {
    async function fetchVehicleData() {
      if (value && !selectedLabel) {
        try {
          const response = await getVehicleById(value);
          if (response) {
            const label = `${response.model} - ${response.plate}`;
            setSelectedLabel(label);
            setSearchTerm(label);
          }
        } catch (err) {
          console.error("Erro ao carregar veículo na edição:", err);
        }
      }
    }
    fetchVehicleData();
  }, [value, selectedLabel]);
  */

  // Limpa o campo caso o formulário pai limpe o valor do veículo
  useEffect(() => {
    if (!value) {
      setSearchTerm("");
      setSelectedLabel("");
    }
  }, [value]);

  // Faz a busca na API baseada no modelo ou placa digitados
  useEffect(() => {
    if (!isOpen || searchTerm === selectedLabel) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        // Contorna a estrutura esperada pela sua API de veículos: search.search
        const response = await getVehicle({
          search: {
            search: searchTerm,
            sort: "model,asc" // Fallback opcional de ordenação
          },
          page: 0,
          size: 10
        });

        const data = response?.content || response?.data || response || [];
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar veículos no select:", err);
        setVehicles([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen, selectedLabel]);

  const handleSelect = (vehicle) => {
    const label = `${vehicle.model} - ${vehicle.plate}`;
    setSelectedLabel(label);
    setSearchTerm(label);
    setIsOpen(false);

    // Retorna o ID do veículo para o payload do formulário pai
    if (onChange) {
      onChange({
        target: {
          name: "vehicleId", // Casa com a propriedade do seu payload
          value: vehicle.id,
        },
      });
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col w-full">
      <label className="text-sm font-medium text-foreground mb-1.5">
        Selecionar Veículo *
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder="Digite o modelo ou placa do veículo..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (searchTerm === selectedLabel) {
              setSearchTerm("");
            }
          }}
          className={`w-full border rounded-lg px-4 py-2.5 pl-10 text-base bg-white transition-all duration-300 outline-none ${
            error
              ? "border-destructive focus:outline-none focus:border-destructive focus:ring-1 focus:ring-destructive"
              : "border-border focus:ring-2 focus:ring-foreground"
          }`}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

     
      {isOpen && vehicles.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-border mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50 p-0 m-0 list-none">
          {vehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              onClick={() => handleSelect(vehicle)}
              className="flex flex-col justify-between  gap-2 px-4 py-2.5 hover:bg-gray-100 text-sm cursor-pointer transition-colors"
            >
              <div className="flex gap-2 items-center">
                <Car className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{vehicle.brand}</span>
              <span className="text-sm font-medium text-foreground">{vehicle.model}</span>
              <span className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-auto font-mono">
                {formatPlate(vehicle.plate)}
              </span>
              </div>

              <div className="flex gap-2">
                <span className="text-xs font-medium text-muted-foreground">{vehicle.customer.name}</span>
              <span className="text-xs font-medium text-muted-foreground">{formatPhone(vehicle.customer.phone)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

   
      {isOpen && vehicles.length === 0 && searchTerm.trim().length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-border mt-1 p-4 rounded-lg shadow-xl text-center text-sm text-muted-foreground z-50">
          Nenhum veículo encontrado
        </div>
      )}

      {error && <span className="text-sm text-destructive mt-1">{error}</span>}
    </div>
  );
}
