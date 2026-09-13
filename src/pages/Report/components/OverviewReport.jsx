import { ArrowDownUp, DollarSignIcon, FileText, HandCoins, Ticket, Users } from "lucide-react";
import FaturamentoChart from "../../../components/ChartsLine/ChartsLine";
import ChartsDonut from "../../../components/ChartsLine/ChartsDonut";
import MostPerformedServices from "../../Dashboard/Components/MostPerformedServices";
import Kpi from "./Kpi";
import { useEffect, useState } from "react";
import { getOverviewReport } from "../../../services/reportService";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";

export default function OverviewReport({ startDate, endDate }) {
  const [overview, setOverview] = useState({});

  useEffect(() => {
    const loadOverview = async () => {
    try {
      const overviewResponse = await getOverviewReport({ startDate, endDate });

      setOverview(overviewResponse || {});
    } catch (error) {
      console.error(error);
    }
  };
  
    loadOverview();
  }, [startDate, endDate]);

  return (
    <div className="animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Kpi
          kpi={{
            title: "Faturamento",
            value: formatToBRL(overview.revenue),
            icon: <DollarSignIcon className="w-5 h-5 text-success" />,
            bg: "bg-success-light",
          }}
        />
        <Kpi
          kpi={{
            title: "Ordens de serviço",
            value: overview.totalServiceOrder,
            icon: <FileText className="w-5 h-5 text-primary" />,
            bg: "bg-primary/10",
          }}
        />
        <Kpi
          kpi={{
            title: "Ticket médio",
            value: formatToBRL(overview.averageTicket),
            icon: <Ticket className="w-5 h-5 text-primary" />,
            bg: "bg-primary/10",
          }}
        />
        <Kpi
          kpi={{
            title: "Clientes atendidos",
            value: overview.distinctCustomers,
            icon: <Users className="w-5 h-5 text-primary" />,
            bg: "bg-primary/10",

          }}
        />
        <Kpi
          kpi={{
            title: "Pagamentos realizados",
            value: overview.countPayment,
            icon: <HandCoins className="w-5 h-5 text-success" />,
            bg: "bg-success-light",

          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FaturamentoChart
            title={"Faturamento por periodo"}
            data={overview.revenueGroupedByDate}
        />
        <ChartsDonut 
        title={"Faturamento por metodo de pagamento"}
        serviceOrders={overview.paymentByMethod}
        type="currency"
        />
        <ChartsDonut 
        serviceOrders={overview.serviceOrderByStatus}
        title={"Ordem de servico por status"} />
        <MostPerformedServices
        services={overview.bestSellingService}
        />
      </div>

      <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 mt-6 bg-slate-100/50 border border-slate-200/50 py-2 rounded-lg w-full">
        <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold bg-white">
          i
        </span>
        Os dados apresentados são referentes ao período selecionado e podem
        sofrer pequenas variações.
      </div>
    </div>
  );
}
