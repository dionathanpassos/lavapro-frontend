import { useState, useEffect, useRef } from "react";
import { Search, User } from "lucide-react";
import { getCustomerById, getCustomersFilter } from "../../../services/customerService";
import { formatPhone } from "../../../utils/Formatted/formatPhone";

export default function SelectCustomerSearch({ value, onChange, error }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const containerRef = useRef(null);
  


  useEffect(() => {
    const fetchCustomerName = async () => { 
      if (value && !selectedName) {
        try {
          const response = await getCustomerById(value);
          if (response) {
            setSelectedName(response.name);
            setSearchTerm(response.name);
          }
        } catch (error) {
          console.error(
            "Erro ao carregar cliente selecionado na edição:",
            error,
          );
        }
      }
    }

    fetchCustomerName();
  }, [value, selectedName]);
  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchTerm("");
      setSelectedName("");
    }
  }, [value]);


  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!isOpen && searchTerm === selectedName) return;

      try {
        const response = await getCustomersFilter({
          search: searchTerm,
        });
        setCustomers(response?.content || response || []);
      } catch (error) {
        console.error("Erro ao buscar clientes no select:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen, selectedName]);

  const handleSelect = (customer) => {
    setSelectedName(customer.name);
    setSearchTerm(customer.name);
    setIsOpen(false);
    
    onChange({
      target: {
        name: "customerId",
        value: customer.id,
      },
    });
  };

  return (
    <div ref={containerRef} className="relative flex flex-col w-full">
      <label className="text-sm font-medium text-foreground mb-1.5">
        Selecionar Cliente
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder="Digite o nome do cliente..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full border rounded-lg px-4 py-2.5 pl-10 text-base bg-background-white transition-all duration-300 outline-none 
            ${error ? "border-destructive focus:outline-none focus:border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-2 focus:ring-foreground"}`}
        />
        <Search className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
      </div>

    
      {isOpen && customers.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-background-white border border-border mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
          {customers.map((customer) => (
            <li
              key={customer.id}
              onClick={() => handleSelect(customer)}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 text-md cursor-pointer transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{customer.name}</span>
              {customer.phone && (
                <span className="text-sm ml-auto">
                  {formatPhone(customer.phone)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && customers.length === 0 && searchTerm.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-background-white border border-border mt-1 p-4 rounded-lg shadow-xl text-center text-sm text-muted-foreground z-50">
          Nenhum cliente encontrado
        </div>
      )}

      {error && <span className="text-sm text-destructive mt-1">{error}</span>}
    </div>
  );
}
