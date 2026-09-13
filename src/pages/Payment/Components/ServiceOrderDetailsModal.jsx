import { useEffect, useState } from "react";
import {
  ArrowLeft,  
  Car,  
  CalendarDays,
  FileText,
  Wrench,
  CreditCard,
  CircleDollarSign,
  Phone,
  Edit3,
  X,
  Check,
} from "lucide-react";
import { formatPhone } from "../../../utils/Formatted/formatPhone";
import { formatPlate } from "../../../utils/Formatted/FormatPlate";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import toast from "react-hot-toast";
import { formatDateTime } from "../../../utils/Formatted/FormatDateTime";
import StatusTimeline from "./StatusTimeline";
import { getServiceOrderById } from "../../../services/serviceOrderService";
import { createPayment } from "../../../services/servicePayment"

const ServiceOrderDetails = ({
  onClose,
  serviceOrder: initialServiceOrder,
  onSuccess,
  onChangeStatus,
}) => {
  const [activeTab, setActiveTab] = useState("Resumo");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [fieldErrors, setFieldErrors] = useState();

  const [serviceOrder, setServiceOrder] = useState(initialServiceOrder);


  useEffect(() => {
    setServiceOrder(initialServiceOrder);
  }, [initialServiceOrder]);
  const tabs = [
    { label: "Resumo", icon: FileText },
    { label: "Serviços/Produtos", icon: Wrench },
    { label: "Pagamentos", icon: CreditCard },
  ];

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    const payload = {
      paymentMethod: paymentMethod,
      serviceOrderId: serviceOrder.id,
    };

    try {
      const paymentResponse = await createPayment(payload);
      toast.success("Pagamento realizado com sucesso!");

      if (onSuccess) {
        await onSuccess();
      }

      const updatedOrderDetails = await getServiceOrderById(
        payload.serviceOrderId,
      );

      setServiceOrder(updatedOrderDetails);
      
      setIsOpenPayment(false);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg || "Erro ao salvar dados da OS.");
      setFieldErrors(error.response?.data?.fieldErrors || {});
    }
  };

  const STATUS_FLUXO = [
    { id: "WAITING", label: "Aguardando" },
    { id: "IN_PROGRESS", label: "Em andamento" },
    { id: "READY", label: "Concluído" },
    { id: "DELIVERED", label: "Entregue" },
  ];
  const statusAtual = serviceOrder?.status || "WAITING";
  const indiceAtivo = STATUS_FLUXO.findIndex(
    (passo) => passo.id === statusAtual,
  );
  const larguraProgresso = `${(indiceAtivo / (STATUS_FLUXO.length - 1)) * 100}%`;

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 z-100">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-350 px-6 py-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Ordem de Serviço #{serviceOrder.id}
                  </h1>
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold w-fit ${getStatusClasses(serviceOrder.status)} `}
                  >
                    {getStatusText(serviceOrder.status)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span>
                    Cliente:{" "}
                    <strong className="font-medium text-slate-700">
                      {serviceOrder?.vehicle?.customer.name}
                    </strong>
                  </span>

                  <span className="text-slate-300">•</span>

                  <span>
                    Veículo:{" "}
                    <strong className="font-medium text-slate-700">
                      {serviceOrder.vehicle.brand} {serviceOrder.vehicle.model}
                    </strong>
                  </span>

                  <span className="text-slate-300">•</span>

                  <span>
                    Entrada:{" "}
                    <strong className="font-medium text-slate-700">
                      {formatDateTime(serviceOrder.createdAt)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  type="button"
                  className="flex h-10 items-center gap-2 rounded-lg border border-border 
                  bg-primary px-4 text-sm font-medium text-foreground-secondary 
                  shadow-sm transition hover:bg-primary-hover truncate "
                >
                  <ArrowLeft size={16} />
                  Voltar para OS
                </button>
              </div>
            </div>


            <div className="mt-6 flex gap-7">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.label;

                return (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(tab.label)}
                    className={`
                    relative flex items-center gap-2 pb-3 text-sm font-medium
                    transition
                    ${
                      active
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-800"
                    }
                  `}
                  >
                    <Icon size={16} />

                    {tab.label}

                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </header>


        <main className="mx-auto max-w-350 px-6 py-6">
          {activeTab === "Resumo" && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        
              <div className="space-y-4">

                <section className="rounded-xl border border-border bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-3">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Resumo da OS
                    </h2>
                  </div>

                  <div className="flex flex-col grid-cols-2 gap-x-6 gap-y-2 px-5 py-3 md:grid-cols-2">
                    <div className="flex flex-col gap-6 sm:flex-row">
                      <InfoItem
                        label="Nº da OS"
                        value={`#${serviceOrder.id}`}
                      />

                      <InfoItem
                        label="Status"
                        value={
                          <span
                            className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold
                        ${getStatusClasses(serviceOrder.status)}
                      `}
                          >
                            {getStatusText(serviceOrder.status)}
                          </span>
                        }
                      />

                      <InfoItem
                        label="Data de entrada"
                        value={formatDateTime(serviceOrder.createdAt)}
                        icon={CalendarDays}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-xs font-medium text-slate-500">
                        Observações
                      </span>

                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {serviceOrder.observations}
                      </p>
                    </div>
                  </div>
                </section>


                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        Cliente
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Informações do cliente
                      </p>
                    </div>

                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                      <Edit3 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-5 px-5 py-3 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                      {serviceOrder?.vehicle?.customer.name
                        .trim()
                        .split(/\s+/, 2)
                        .map((palavra) => palavra[0])
                        .join("")}
                    </div>

                    <div className="flex flex-1 grid-cols-2 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Nome
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {serviceOrder?.vehicle?.customer.name}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Phone size={15} className="mt-0.5 text-slate-400" />

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Telefone
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            {formatPhone(serviceOrder?.vehicle?.customer.phone)}
                          </p>
                        </div>
                      </div>                
                    </div>
                  </div>
                </section>

                {/* VEÍCULO */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        Veículo
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Veículo relacionado à ordem de serviço
                      </p>
                    </div>

                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                      <Edit3 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-5 px-5 py-3 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Car size={27} className="text-slate-600" />
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-5 md:grid-cols-4">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Veículo
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {serviceOrder.vehicle.brand}{" "}
                          {serviceOrder.vehicle.model}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Placa
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatPlate(serviceOrder.vehicle.plate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Ano
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {serviceOrder.vehicle.year}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Cor
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {serviceOrder.vehicle.color}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

           
                <StatusTimeline
                  serviceOrder={serviceOrder}
                  onChangeStaus={onChangeStatus}
                />
              </div>

             
              <aside className="space-y-6">
             
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Valores da OS
                    </h2>
                  </div>

                  <div className="space-y-4 p-5">
                    <PriceRow
                      label="Subtotal dos serviços/produtos"
                      value={formatToBRL(serviceOrder?.totalAmount)}
                    />

                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900">
                          Total da OS
                        </span>

                        <span className="text-lg font-bold text-blue-600">
                          {formatToBRL(serviceOrder?.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

      
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-sm font-semibold text-foreground">
                      Pagamentos
                    </h2>
                  </div>
                  {serviceOrder.payments.length > 0 ? (
                    <div className="space-y-4 p-5">
                      {serviceOrder.payments.map((payment) => (
                        <div key={payment.id}>
                          <div className="flex text-sm items-center gap-4 mb-4">
                            <span className="bg-success-light text-success rounded-full p-1.5">
                              <Check />
                            </span>
                            <div className="flex flex-col text-muted-foreground gap-1">
                              <span>{formatDateTime(payment?.paidAt)}</span>
                              <span>
                                Pagamento via{" "}
                                {getMethodPaymentText(payment?.paymentMethod)}
                              </span>
                            </div>
                          </div>
                          <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-bold text-slate-900">
                                Total recebido
                              </span>

                              <span className="text-lg font-bold text-success">
                                {formatToBRL(payment?.amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex flex-col items-center justify-center py-5 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                          <CircleDollarSign
                            size={21}
                            className="text-slate-400"
                          />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-600">
                          Nenhum pagamento registrado.
                        </p>

                        <button
                          onClick={() => setIsOpenPayment(true)}
                          className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                          Registrar pagamento
                        </button>
                      </div>
                    </div>
                  )}
                </section>


                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Resumo financeiro
                    </h2>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Total</span>

                      <span className="text-sm font-semibold text-slate-800">
                        {formatToBRL(serviceOrder.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Pago</span>

                      <span className="text-sm font-semibold text-emerald-600">
                        {formatToBRL(
                          serviceOrder.payments.find(
                            (payment) => payment.paymentStatus === "PAID",
                          )?.amount || 0,
                        )}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">
                          Em aberto
                        </span>

                        <span className="text-base font-bold text-amber-600">
                          {formatToBRL(
                            serviceOrder.totalAmount -
                              (serviceOrder.payments.find(
                                (payment) => payment.paymentStatus === "PAID",
                              )?.amount || 0),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          )}

          {activeTab === "Pagamentos" && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Meio de pagamento</th>
                      <th className="py-3 px-4">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {serviceOrder.payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
            
                        <td className="py-4 px-4">
                          <div
                            className={`text-xs font-semibold flex justify-center w-fit p-1 rounded-lg
                          ${getStatusClasses(payment?.paymentStatus)}
                            `}
                          >
                            {getStatusText(payment?.paymentStatus)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            {formatDateTime(payment?.updatedAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            {getMethodPaymentText(payment?.paymentMethod)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            {formatToBRL(payment?.amount)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Serviços/Produtos" && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Produto/serviço</th>
                      <th className="py-3 px-4">Quantidade</th>
                      <th className="py-3 px-4">Preço unitário</th>
                      <th className="py-3 px-4">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {serviceOrder.items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            {item?.serviceName}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            {item?.quantity}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            {formatToBRL(item?.unitPrice)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            {formatToBRL(item.totalPrice)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      {isOpenPayment && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-150 p-4 transition-all">
     
          <div className="bg-white rounded-2xl w-160 p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[95vh] overflow-y-auto font-sans">

            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 m-0">
                  Finalizar Ordem de Serviço #{serviceOrder.id}
                </h2>
                <p className="text-xs text-gray-500 m-0 mt-1 tracking-wide">
                  OS {serviceOrder?.id}` •{" "}
                  {serviceOrder?.vehicle?.customer?.name} •{" "}
                  {serviceOrder?.vehicle?.brand} {""}{" "}
                  {serviceOrder?.vehicle?.model}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenPayment(false)}
                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-5 flex-1">
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">               
                <div className="space-y-4 p-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">
                    Resumo da cobrança
                  </h3>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between items-center mb-10">
                      <span>Subtotal dos serviços</span>
                      <span className="font-semibold text-gray-900">
                        {formatToBRL(serviceOrder?.totalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                      <span className="font-bold text-gray-900">
                        Total da OS
                      </span>
                      <span className="text-xl font-extrabold text-blue-600">
                        {formatToBRL(serviceOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                
                  <div className="space-y-2 pt-4">
                    <h3 className="text-sm font-bold text-gray-900 m-0 tracking-wide mb-4">
                      Informações de pagamento
                    </h3>
                    <div>
                      <label className="text-xs text-gray-500 font-semibold block mb-1">
                        Valor a pagar *
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formatToBRL(serviceOrder.totalAmount)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-semibold text-gray-700 outline-none"
                      />
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        Valor total: {formatToBRL(serviceOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-2">
                  <h3 className="text-sm font-bold text-gray-900 m-0 tracking-wide mb-4">
                    Forma de pagamento *
                  </h3>

                  <div className="space-y-2">
                    {[
                      { id: "CASH", label: "Dinheiro" },
                      { id: "DEBIT_CARD", label: "Cartão de Débito" },
                      { id: "CREDIT_CARD", label: "Cartão de Crédito" },
                      { id: "PIX", label: "PIX" },
                      { id: "BANK_TRANSFER", label: "Transferência" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-sm ${
                          paymentMethod === method.id
                            ? "border-blue-500 bg-blue-50/10 font-semibold text-blue-700"
                            : "border-border hover:bg-gray-50 text-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method_group"
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

        
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenPayment(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  ✓ Confirmar pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

/* -------------------------------- */
/* COMPONENTES AUXILIARES */
/* -------------------------------- */

const InfoItem = ({ label, value, icon: Icon }) => {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400">{label}</span>

      <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
        {Icon && <Icon size={15} className="text-slate-400" />}

        <span>{value}</span>
      </div>
    </div>
  );
};

const PriceRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
};

const getStatusText = (status) => {
  if (status === "WAITING") return "AGUARDANDO";
  if (status === "IN_PROGRESS") return "EM ANDAMENTO";
  if (status === "READY") return "CONCLUÍDA";
  if (status === "DELIVERED") return "CONCLUÍDA";
  if (status === "PAID") return "PAGO";
  if (status === "CANCELED") return "CANCELADO";
  if (status === "REFOUNDED") return "ESTORNADO";
  return status;
};

const getStatusClasses = (status) => {
  switch (status) {
    case "WAITING":
      return "bg-amber-50 text-amber-600";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-600";
    case "READY":
      return "bg-emerald-50 text-emerald-600 ";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-600";
    case "PAID":
      return "bg-success-light text-success";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const getMethodPaymentText = (status) => {
  if (status === "CREDIT_CARD") return "Cartão de Crédito";
  if (status === "CREDIT_CARD") return "Cartão de Débito";
  if (status === "CASH") return "Dinheiro";
  if (status === "BANK_TRANSFER") return "Transferência";
  if (status === "PIX") return "Pix";
  return status;
};

export default ServiceOrderDetails;
