import {
  Check,
  ChevronRight,
  CircleX,
  Plus,
  RotateCwFadingClock,
  User,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  getServiceOrderIndicators,
  getServiceOrders,
} from "../../services/serviceOrderService";
import LatestOrdersTable from "./components/LatestOrdersTable";
import CardKpi from "../../components/SectionCards/CardKpi";

export default function QuickStartPage() {
  const navigate = useNavigate();
  const [serviceOrders, setServiceOrders] = useState([]);
  const [serviceOrdersIndicators, setServiceOrdersIndicators] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const serviceOrdersResponse = await getServiceOrders();
        const indicatorsResponse = await getServiceOrderIndicators();

        setServiceOrders(serviceOrdersResponse?.content || []);
        setServiceOrdersIndicators(indicatorsResponse || {});
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-sidebar-background">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-2xl bg-background p-4">

        {/* Ações rápidas */}
        <div className="mb-5 grid shrink-0 grid-cols-2 sm:grid-cols-6 gap-4">
          <button
            onClick={() =>
              navigate("/ordens-servico", { state: { openModal: true } })
            }
            className="flex items-center gap-2 rounded-lg bg-linear-to-tr from-primary to-[#1d82fe] p-3 text-foreground-secondary shadow-lg transition-colors duration-300 active:scale-95 active:opacity-90"
          >
            <span className="rounded-full bg-white p-1.5 text-primary">
              <Plus />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
              <span className="truncate text-sm font-semibold">
                Nova Ordem
              </span>

              <p className="text-[10px]">
                Criar nova OS
              </p>
            </div>

            <ChevronRight />
          </button>

          <button
            onClick={() =>
              navigate("/clientes", { state: { openModal: true } })
            }
            className="flex items-center gap-2 rounded-lg bg-white p-3 text-foreground shadow-lg transition-colors duration-300 active:scale-95 active:opacity-90"
          >
            <span className="rounded-full bg-primary p-1.5 text-foreground-secondary">
              <User />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
              <span className="truncate text-sm font-semibold">
                Novo Cliente
              </span>

              <p className="text-[10px] text-muted-foreground">
                Criar novo cliente
              </p>
            </div>

            <ChevronRight />
          </button>
        </div>

        {/* Área flexível */}
        <div className="flex min-h-0 flex-1">
          <LatestOrdersTable serviceOrders={serviceOrders} />
        </div>

        {/* Resumo */}
        <div className="mt-5 shrink-0">
          <span className="mb-2 block text-lg font-bold">
            Resumo das OS
          </span>

          <CardKpi
            cards={[
              {
                label: "Aguardando",
                data: serviceOrdersIndicators?.waiting,
                icon: <RotateCwFadingClock />,
              },
              {
                label: "Em andamento",
                data: serviceOrdersIndicators?.inProgress,
                icon: <Wrench />,
              },
              {
                label: "Concluídas",
                data: serviceOrdersIndicators?.ready,
                icon: <Check />,
              },
              {
                label: "Canceladas",
                data: serviceOrdersIndicators?.canceled,
                icon: <CircleX />,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
