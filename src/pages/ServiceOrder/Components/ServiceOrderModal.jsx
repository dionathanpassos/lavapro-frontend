import {
  CheckCircle2,
  X,
  Plus,
  Trash2,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../../../components/Button/Button";
import SelectVehicleSearch from "./SelectVehicleSearch";
import { createServiceOrder, updateServiceOrder } from "../../../services/serviceOrderService";
import { getServicesCatalog } from "../../../services/serviceCatalogService";
import { createServiceOrderItems, deleteServiceOrderItems, updateServiceOrderItems } from "../../../services/serviceOrderItemsService";
import toast from "react-hot-toast";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatPhone } from "../../../utils/Formatted/formatPhone";

export default function ServiceOrderModal({ isOpen, onClose, editData }) {
  // Estados do Formulário e Erros
  const [fieldErrors, setFieldErrors] = useState({});
  const [observations, setObservations] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [serviceOrder, setServiceOrder] = useState(null);

  // Estados dos Itens (Tela 2)
  const [availableServices, setAvailableServices] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Busca o catálogo de serviços do banco quando a OS é criada (Tela 2 ativa)
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await getServicesCatalog();
        setAvailableServices(response?.content || []);
      } catch (error) {
        console.error("Falha ao buscar catálogo:", error);
        toast.error("Erro ao carregar catálogo de serviços.");
      } finally {
        setIsLoadingServices(false);
      }
    };

    if (isOpen && serviceOrder) {
      fetchServices();
    }
  }, [isOpen, serviceOrder]);

  useEffect(() => {
  if (isOpen) {
    if (editData) {
      // Se houver dados de edição, alimenta os estados imediatamente
      setServiceOrder(editData);
      setVehicleId(editData.vehicle?.id || "");
      setObservations(editData.observations || "");

      // Mapeia os itens vindos do banco mantendo as duas referências separadas
      if (editData.items && editData.items.length > 0) {
        const formattedItems = editData.items.map((item) => ({
          id: item.id, // O ID único da linha no banco (Ex: 9, 10) -> USADO NO PATCH E NA KEY
          serviceCatalogId: item.serviceCatalogId, // O ID do produto no catálogo (Ex: 2) -> USADO NO FILTRO
          name: item.serviceName || item.name,
          price: Number(item.unitPrice || item.price || 0),
          quantity: Number(item.quantity),
        }));
        setAddedItems(formattedItems);
      } else {
        setAddedItems([]);
      }
    } else {
      // Se NÃO houver dados de edição (Modo Criação), limpa tudo para abrir em branco
      setServiceOrder(null);
      setVehicleId("");
      setObservations("");
      setAddedItems([]);
    }
    setFieldErrors({});
    setSearchTerm("");
  }
}, [isOpen, editData]);

  // Função auxiliar de formatação de moeda
  const formatToBRL = (val) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  // Reset total ao fechar o modal
  const handleCloseAll = () => {
    setServiceOrder(null);
    setVehicleId("");
    setObservations("");
    setAddedItems([]);
    setSearchTerm("");
    setFieldErrors({});
    onClose();
  };

  // Passo 1: Criar a Ordem de Serviço
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!vehicleId) return;

    const payload = {
      vehicleId: vehicleId,
      observations: observations,
    };

    try {
      const serviceOrderResponse = await createServiceOrder(payload);
      setServiceOrder(serviceOrderResponse);
      toast.success("Ordem criada com sucesso!");
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data?.fieldErrors || {});
    }
  };

  // Passo 2: Lançar os Itens Selecionados no Banco
  // Passo 2: Lançar Itens (Modo Criação) OU Atualizar Observações (Modo Edição)
const handleSaveItems = async (e) => {
  e.preventDefault();
  
  // Identifica se a OS já veio de uma edição (editData existe)
  const isEditing = !!editData;

  try {
    if (isEditing) {
    
      const payloadOS = {
        observations: observations, // Pega o texto atualizado do textarea
      };
      
      // Chama o mesmo serviço que cria, mas se sua API tiver um updateServiceOrder(payload, id), use-o aqui.
      // Caso a sua API use a mesma rota para atualizar se passar o ID, mantenha a lógica do seu padrão.
      await updateServiceOrder(payloadOS, serviceOrder.id ); 
      
      toast.success("Ordem de Serviço atualizada com sucesso!");
      handleCloseAll();
      
    } else {
      // === MODO CRIAÇÃO ===
      // Se for uma OS nova, mantém o comportamento antigo de criar os itens do zero no banco
      if (addedItems.length === 0) {
        await createServiceOrderItems({}, serviceOrder.id);
      }
      
      for (const item of addedItems) {
        const payloadItem = {
          serviceCatalogId: item.serviceCatalogId || item.id,
          quantity: item.quantity,
        };
        await createServiceOrderItems(payloadItem, serviceOrder.id);
      }
      
      toast.success("Serviços/Produtos lançados com sucesso!");
      handleCloseAll();
    }
  } catch (error) {
    const mensagemDoBackend = error.response?.data?.message || error.message;
    toast.error(mensagemDoBackend || "Erro ao finalizar a ordem.");
  }
};


const handleAddItem = async (service) => {
  const targetCatalogId = Number(service.id);

  // Procura se já existe um item adicionado correspondente a esse ID do catálogo
  const existingItem = addedItems.find(
    (item) => Number(item.serviceCatalogId) === targetCatalogId
  );

  if (existingItem) {
    // Se o item já existe, aumenta a quantidade chamando a nossa função com PATCH
    handleUpdateQuantity(existingItem.id, existingItem.quantity + 1);
  } else {
    // Se for um produto/serviço inédito na lista, adiciona localmente primeiro
    setAddedItems((prev) => [...prev, { ...service, serviceCatalogId: targetCatalogId, quantity: 1 }]);
  }
};

  const handleUpdateQuantity = async (itemId, newQuantity) => {
  const parsedQuantity = Number(newQuantity);
  if (isNaN(parsedQuantity) || parsedQuantity < 1) return;

  // 1. Atualiza visualmente o estado local de forma imediata (UX rápida)
  setAddedItems((prev) =>
    prev.map((item) =>
      Number(item.id) === Number(itemId)
        ? { ...item, quantity: parsedQuantity }
        : item
    )
  );

  // 2. Envia a alteração em tempo real para o banco de dados via PATCH
  try {
    const payload = { quantity: parsedQuantity };
    console.log(payload)
    await updateServiceOrderItems(payload, itemId);
    toast.success("Quantidade atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar quantidade no banco:", error);
    toast.error("Não foi possível atualizar no servidor.");
  }
};

  const handleRemoveItem = async (itemId) => {
  // 1. Remove visualmente da tela imediatamente para dar agilidade à interface
  setAddedItems((prev) =>
    prev.filter((item) => Number(item.id) !== Number(itemId))
  );

  // 2. Dispara a requisição DELETE para remover fisicamente do banco de dados
  try {
    // Passa um objeto vazio como primeiro parâmetro e o id como segundo, conforme sua assinatura
    await deleteServiceOrderItems({}, itemId);
    toast.success("Item removido com sucesso!");
  } catch (error) {
    console.error("Erro ao remover item no servidor:", error);
    toast.error("Não foi possível remover o item do servidor.");
    
    // Opcional: Se der erro no banco, você pode recarregar a OS para reexibir o item que falhou ao deletar
    if (editData) {
      setServiceOrder(editData);
    }
  }
};
console.log(addedItems)


  const filteredServices = availableServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalOSPrice = addedItems.reduce(
    (sum, item) => sum + (item.price || item.unitPrice || 0) * item.quantity,
    0,
  );
  console.log("Itens atualmente na lista:", addedItems);

  return (
    <div
      className={`inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all ${
        isOpen ? "fixed" : "hidden"
      }`}
    >
  
      {!serviceOrder && (
        <div className="bg-white rounded-2xl w-160 p-6 shadow-2xl border border-border space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 m-0">
                Nova Ordem de Serviço
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 m-0">
                Preencha os dados iniciais do veículo
              </p>
            </div>
            <button
              onClick={handleCloseAll}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateOrder}>
            <div className="flex flex-col gap-6">
              <SelectVehicleSearch
                onChange={(e) => setVehicleId(e.target.value)}
              />

              {vehicleId && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Observações
                  </label>
                  <textarea
                    rows={5}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Observações ou problemas relatados pelo cliente..."
                    className={`w-full border rounded-lg p-3 text-sm placeholder-gray-400 resize-none transition-all duration-300 outline-none ${
                      fieldErrors?.observations
                        ? "border-destructive focus:ring-1 focus:ring-destructive"
                        : "border-border focus:ring-2 focus:ring-foreground"
                    }`}
                  />
                  {fieldErrors?.observations && (
                    <span className="text-sm text-destructive mt-1 block">
                      {fieldErrors.observations}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <Button type="button" action="cancel" onClick={handleCloseAll}>
                  Cancelar
                </Button>
                <Button type="submit">Avançar</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {serviceOrder && (
        <div className="bg-white rounded-2xl w-3xl p-6 shadow-2xl border border-border flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 m-0">
                Lançamento de Itens: OS #{serviceOrder.id}
              </h2>
              <p className="text-xs text-gray-400 m-0">
                Gerencie os produtos, serviços e observações desta ordem
              </p>
            </div>
            <button
              onClick={handleCloseAll}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 text-sm">
            <div>
              <span className="font-semibold text-gray-500 block mb-1 text-xs uppercase tracking-wider">
                Dados do Veículo
              </span>
              <p className="m-0 text-gray-900 font-medium">
                {serviceOrder.vehicle?.brand} {serviceOrder.vehicle?.model}
              </p>
              <p className="m-0 text-gray-600 text-xs">
                Placa: {formatPlate(serviceOrder.vehicle?.plate)}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-500 block mb-1 text-xs uppercase tracking-wider">
                Dados do Cliente
              </span>
              <p className="m-0 text-gray-900 font-medium">
                {serviceOrder.vehicle?.customer?.name}
              </p>
              <p className="m-0 text-gray-600 text-xs">
                Tel: {formatPhone(serviceOrder.vehicle?.customer?.phone)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">

            <div className="flex flex-col border border-border rounded-xl p-3 bg-white overflow-hidden">
              <span className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-primary" /> Adicionar Itens
              </span>
              <input
                type="text"
                placeholder="Buscar serviço ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-border rounded-lg p-2 text-sm mb-3 focus:ring-2 focus:ring-foreground outline-none"
              />
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {isLoadingServices ? (
                  <p className="text-center text-sm text-gray-400 py-4">
                    Carregando catálogo...
                  </p>
                ) : filteredServices.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-4">
                    Nenhum item encontrado
                  </p>
                ) : (
                  filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-gray-300 bg-gray-50/50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {service.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatToBRL(service.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddItem(service)}
                        className="flex gap-2 p-1 bg-white hover:bg-gray-100 border border-border text-xs text-gray-700 rounded-md transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>


            <div className="flex flex-col gap-3 overflow-hidden">
     
              <div className="flex flex-col border border-border rounded-xl p-3 bg-white flex-1 overflow-hidden">
                <span className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-green-500" /> Servicos
                  Lançados ({addedItems.length})
                </span>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {addedItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                      <ShoppingBag className="w-8 h-8 mb-2 stroke-[1.5]" />
                      <p className="text-xs m-0">
                        Nenhum produto/servico selecionado
                      </p>
                    </div>
                  ) : (
                    addedItems.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex items-center justify-between p-2 border border-gray-100 rounded-lg bg-white"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-sm font-medium text-gray-800 truncate m-0">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 m-0">
                            {formatToBRL(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdateQuantity(
                                item.id,
                                val === "" ? "1" : val,
                              );
                            }}
                            className="w-12 border border-border rounded p-1 text-center text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {addedItems.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 mt-2 flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>Total Geral:</span>
                    <span>{formatToBRL(totalOSPrice)}</span>
                  </div>
                )}
              </div>
            </div>
  
            <div className="flex flex-col md:col-span-2 m-1">
              <label className="text-xs font-semibold text-gray-700 mb-1">
                Observações da OS (Editável)
              </label>
              <textarea
                rows={4}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Alterar observações se necessário..."
                className="w-full border border-border rounded-xl p-2 text-xs placeholder-gray-400 resize-none outline-none focus:ring-2 focus:ring-foreground transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-gray-100 mt-4">
            <Button type="button" action="cancel" onClick={handleCloseAll}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveItems}>
              Finalizar Ordem
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
