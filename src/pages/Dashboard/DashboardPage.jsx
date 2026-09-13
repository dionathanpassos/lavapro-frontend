import { Clock, DollarSignIcon, FileText, Ticket } from "lucide-react";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import SectionCards from "../../components/SectionCards/SectionCards";
import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboardService";
import ChartsLine from "../../components/ChartsLine/ChartsLine";
import ChartsDonut from "../../components/ChartsLine/ChartsDonut";
import LatestOrdersTable from "./Components/LatestOrdersTable";
import MostPerformedServices from "./Components/MostPerformedServices";
import { formatToBRL } from "../../utils/Formatted/FormatToBRL";
import { getServiceOrders } from "../../services/serviceOrderService";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    serviceOrders: {
      waiting: 0,
      inProgress: 0,
      ready: 0,
      delivered: 1,
      canceled: 0,
      totalMonth: 0,
    },
    customers: {
      total: 0,
    },
    financial: {
      monthRevenue: 0,
      todayRevenue: 0,
      averageTicket: 0,
      countRefunded: 0,
      countPaid: 0,
    },
    cashFlow: {
      income: 0,
      expense: 0,
      balance: 0,
    },
    service: {
      mostSold: "Nenhum produto",
      total: 0,
    },
  });
  const [serviceOrders, setServiceOrders] = useState({});
  const [serviceOrdersData, setServiceOrdersData] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardResponse = await getDashboard();
        const serviceOrdersResponse = await getServiceOrders();
        setServiceOrdersData(serviceOrdersResponse?.content);
        setDashboard(dashboardResponse);
        setServiceOrders(dashboardResponse?.serviceOrders || []);
      } catch (error) {
        console.log(error);
      }
    };
    loadDashboard();
  }, []);


  const chavesPermitidas = ["waiting", "inProgress", "ready"];
  const totalEspecifico = Object.entries(serviceOrders).reduce(
    (acc, [key, value]) => {
      return chavesPermitidas.includes(key) ? acc + value : acc;
    },
    0,
  );
  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      <HeaderSection
        title={"Dashboard"}
        subtile={"Visão geral do seu negócio"}
      />

      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        <SectionCards
          cards={[
            {
              label: "Faturamento do mês",
              data: formatToBRL(dashboard.financial?.monthRevenue),
              icon: <DollarSignIcon />,
            },
            {
              label: "Ticket médio",
              data: formatToBRL(dashboard.financial?.averageTicket),
              icon: <Ticket />,
            },
            {
              label: "Ordens de Serviço",
              data: dashboard.serviceOrders?.totalMonth,
              icon: <FileText />,
            },
            { label: "Ordens em operação", data: totalEspecifico, icon: <Clock /> },
          ]}
        />

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div className="">
            <ChartsLine 
            title={"Faturamento"}
            data={dashboard?.financial?.revenueByDate} />
          </div>
          <div className="">
            <ChartsDonut 
            title={"Ordens de servico por status"}
            serviceOrders={serviceOrders} />
          </div>

          <div>
            <LatestOrdersTable serviceOrders={serviceOrdersData} />
          </div>

          <div>
            <MostPerformedServices services={dashboard?.services} />
          </div>
        </div>
      </section>
    </div>
  );
}
