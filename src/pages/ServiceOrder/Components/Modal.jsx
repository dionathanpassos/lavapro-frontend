import {
  X,
  Plus,
  Trash2,
  ShoppingBag,
  ClipboardList,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../../../components/Button/Button";
import SelectVehicleSearch from "./SelectVehicleSearch";
import {
  createServiceOrder,
  updateServiceOrder,
} from "../../../services/serviceOrderService";
import { getServicesCatalog } from "../../../services/serviceCatalogService";
import {
  createServiceOrderItems,
  updateServiceOrderItems,
  deleteServiceOrderItems,
} from "../../../services/serviceOrderItemsService";
import toast from "react-hot-toast";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatPhone } from "../../../utils/Formatted/formatPhone";

export default function ServiceOrderModal({
  isOpen,
  onClose,
  editData = null,
  onSuccess
}) {
  // Controle de Navegação do Modal: "os_data" (Camada 1) | "items" (Camada 2)
  const [step, setStep] = useState("os_data");

  // Dados da OS (Camada 1)
  const [serviceOrder, setServiceOrder] = useState(null);
  const [vehicleId, setVehicleId] = useState("");
  const [observations, setObservations] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Dados dos Itens (Camada 2)
  const [availableServices, setAvailableServices] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Gatilho de Entrada: Configura se é Criação ou Edição
  useEffect(() => {
    if (isOpen) {
      setStep("os_data"); // Sempre começa na Camada 1
      if (editData) {
        setServiceOrder(editData);
        setVehicleId(editData.vehicle?.id || "");
        setObservations(editData.observations || "");

        if (editData.items && editData.items.length > 0) {
          setAddedItems(
            editData.items.map((item) => ({
              id: item.id, // ID real do item lançado na OS para o PATCH/DELETE
              serviceCatalogId: item.serviceCatalogId, // ID do catálogo para evitar duplicados
              name: item.serviceName || item.name,
              price: Number(item.unitPrice || item.price || 0),
              quantity: Number(item.quantity),
            })),
          );
        } else {
          setAddedItems([]);
        }
      } else {
        setServiceOrder(null);
        setVehicleId("");
        setObservations("");
        setAddedItems([]);
      }
      setFieldErrors({});
      //   setSearchTerm("\");
    }
  }, [isOpen, editData]);

  // Carrega catálogo se a Camada 2 for aberta
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await getServicesCatalog();
        setAvailableServices(response?.content || []);
      } catch (error) {
        console.error("Falha ao buscar catálogo:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    if (isOpen && step === "items") {
      fetchServices();
    }
  }, [isOpen, step]);


  const handleCloseAll = () => {
  setServiceOrder(null);
  setVehicleId("");
  setObservations("");
  setAddedItems([]);
  setSearchTerm("");
  setFieldErrors({});
  setStep("os_data"); // Reseta para o primeiro passo
  onClose(); // Executa a propriedade que fecha o modal no Pai (ex: setIsModalOpen(false))
};

  // CAMADA 1: Salva ou Atualiza a OS Principal (Dados do Veículo e Observações)
  const handleSaveOSData = async (e) => {
    e.preventDefault();
    if (!vehicleId) return;

    const payload = { vehicleId, observations };

    try {
      if (editData) {
        // Modo Edição: Atualiza os dados mestres da OS via PUT
        await updateServiceOrder(payload, serviceOrder.id);
        toast.success("Dados da OS atualizados!");
        if (onSuccess) onSuccess();
        handleCloseAll();
      } else {
        // Modo Criação: Cria a OS base e avança para a Camada 2 colocar itens
        const response = await createServiceOrder(payload);
        setServiceOrder(response);
        toast.success("Ordem inicial gerada!");
        if (onSuccess) onSuccess();
        setStep("items"); // Vai para a tela de produtos
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg || "Erro ao salvar dados da OS.");
      setFieldErrors(error.response?.data?.fieldErrors || {});
    }
  };

  // CAMADA 2: Operações de Itens em Tempo Real
  const handleAddItem = async (service) => {
    if (!serviceOrder) return;
    const targetCatalogId = Number(service.id);

    const existingItem = addedItems.find(
      (item) => Number(item.serviceCatalogId) === targetCatalogId,
    );

    if (existingItem) {
      handleUpdateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      try {
        const payload = { serviceCatalogId: targetCatalogId, quantity: 1 };
        const newItemResponse = await createServiceOrderItems(
          payload,
          serviceOrder.id,
        );

        setAddedItems((prev) => [
          ...prev,
          {
            id: newItemResponse.id,
            serviceCatalogId: targetCatalogId,
            name: service.name,
            price: service.price,
            quantity: 1,
          },
        ]);
        toast.success("Item adicionado!");
      } catch (error) {
        const mensagemDoBackend = error.response?.data?.message || error.message;
        toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
        setFieldErrors(error.response?.data.fieldErrors);
        
      }
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const parsedQuantity = Number(newQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) return;

    setAddedItems((prev) =>
      prev.map((item) =>
        Number(item.id) === Number(itemId)
          ? { ...item, quantity: parsedQuantity }
          : item,
      ),
    );

    try {
      await updateServiceOrderItems({ quantity: parsedQuantity }, itemId);
      toast.success("Quantidade alterada com sucesso!");
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data.fieldErrors);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setAddedItems((prev) =>
      prev.filter((item) => Number(item.id) !== Number(itemId)),
    );
    try {
      await deleteServiceOrderItems({}, itemId);
      toast.success("Item removido!");
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data.fieldErrors);
    }
  };

  const filteredServices = availableServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalOSPrice = addedItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0,
  );
  const formatToBRL = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div
      className={`inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all ${isOpen ? "fixed" : "hidden"}`}
    >
   
      {step === "os_data" && (
        <div className="bg-white rounded-2xl w-160 p-6 shadow-2xl border border-border flex flex-col max-h-[90vh]  space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 m-0">
                {editData
                  ? `Ordem de Serviço #00${serviceOrder?.id}`
                  : "Nova Ordem de Serviço"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 m-0">
                Confira as informações, itens e observações gerais
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseAll}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {editData && serviceOrder && (
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
              <div>
                <span className="font-semibold text-gray-400 block mb-1 text-xs uppercase tracking-wider">
                  Dados do Veículo
                </span>
                <p className="m-0 text-gray-900 font-semibold">
                  {serviceOrder.vehicle?.brand} {serviceOrder.vehicle?.model}
                </p>
                <p className="m-0 text-gray-500 text-xs mt-0.5">
                  Placa: {formatPlate(serviceOrder.vehicle?.plate)}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block mb-1 text-xs uppercase tracking-wider">
                  Dados do Cliente
                </span>
                <p className="m-0 text-gray-900 font-semibold">
                  {serviceOrder.vehicle?.customer?.name}
                </p>
                <p className="m-0 text-gray-500 text-xs mt-0.5">
                  Tel: {formatPhone(serviceOrder.vehicle?.customer?.phone)}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveOSData} className="space-y-4 flex-1">
            {!editData && (
              <SelectVehicleSearch
                onChange={(e) => setVehicleId(e.target.value)}
              />
            )}

            {(vehicleId || editData) && (
              <div className="space-y-4">
              
                {editData && (
                  <div className="border border-border rounded-xl p-4 bg-white space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-2 gap-2">
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-green-500" />{" "}
                        Produtos/Serviços Lançados
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep("items")}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:bg-blue-50/50 px-2 py-1 rounded-md border w-fit transition-all cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" /> Adicionar / Remover Itens
                      </button>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {addedItems.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-2 m-0">
                          Nenhum produto cadastrado nesta OS.
                        </p>
                      ) : (
                        addedItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm p-1.5 bg-gray-50/50 rounded-lg border border-gray-100"
                          >
                            <div>
                              <p className="m-0 font-medium text-gray-800">
                                {item.name}
                              </p>
                              <p className="m-0 text-xs text-gray-400">
                                {item.quantity}x {formatToBRL(item.price)}
                              </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {formatToBRL(item.price * item.quantity)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {addedItems.length > 0 && (
                      <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-900">
                        <span>Total Geral:</span>
                        <span>{formatToBRL(totalOSPrice)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wider">
                    Observações da OS
                  </label>
                  <textarea
                    rows={4}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Problemas relatados pelo cliente..."
                    className={`w-full border rounded-lg p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-foreground ${fieldErrors?.observations ? "border-destructive focus:ring-destructive" : "border-border"}`}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <Button type="button" action="cancel" onClick={handleCloseAll}>
                Cancelar
              </Button>
              <Button type="submit">{editData ? "Salvar" : "Avançar"}</Button>
            </div>
          </form>
        </div>
      )}

      {step === "items" && serviceOrder && (
        <div className="relative bg-white rounded-2xl w-3xl p-6 shadow-2xl border border-border flex flex-col max-h-[90vh]">
          <div className="flex flex-col md:flex-row md:items-center pb-4 border-b border-gray-100 mb-4 gap-2">
            <button
              type="button"
              onClick={() => setStep("os_data")}
              className="w-fit flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Resumo
            </button>
            <span className="text-sm font-bold text-gray-900">
              Gerenciador de Itens: OS #00{serviceOrder.id}
            </span>
            <button
              type="button"
              onClick={handleCloseAll}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
      
            <div className="flex flex-col border border-border rounded-xl p-3 bg-white overflow-hidden">
              <span className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-primary" /> Catálogo de
                Serviços
              </span>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-border rounded-lg p-2 text-sm mb-3 outline-none"
              />
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {isLoadingServices ? (
                  <p className="text-center text-xs text-gray-400 py-4">
                    Buscando...
                  </p>
                ) : (
                  filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-2 rounded-lg border border-gray-100 bg-gray-50/50"
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
                        className="p-1 bg-white border border-border rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col border border-border rounded-xl p-3 bg-white overflow-hidden">
              <span className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-green-500" /> Itens na
                Ordem ({addedItems.length})
              </span>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {addedItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                    <ShoppingBag className="w-8 h-8 mb-2" />
                    <p className="text-xs">Lista vazia</p>
                  </div>
                ) : (
                  addedItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between p-2 border border-border/40 rounded-lg bg-white"
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
                        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white h-9 shadow-sm">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-full px-2.5 text-foreground-secondary bg-primary hover:bg-primary-hover font-medium text-base transition-colors active:scale-95 active:opacity-90"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(item.id, e.target.value)
                            }
                            className="w-10 text-center border-none text-md font-bold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-full px-2.5 text-foreground-secondary bg-primary hover:bg-primary-hover font-medium text-base transition-colors active:scale-95 active:opacity-90"
                          >
                            +
                          </button>
                        </div>           
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-destructive p-1 cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
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

          <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
            <Button type="button" onClick={() => {
                if(onSuccess) onSuccess();
                handleCloseAll();
            }
                
            }>
              Concluir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
