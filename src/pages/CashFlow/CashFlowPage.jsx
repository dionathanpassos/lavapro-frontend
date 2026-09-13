import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle,
  CircleX,
  DollarSign,
  FileText,
  Wallet,

} from "lucide-react";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import { useEffect, useState } from "react";
import SectionCards from "../../components/SectionCards/SectionCards";



import Pagination from "../../components/Pagination/Pagination";
import CashFlowTable from "./Components/CashFlowTable";
import CashFlowDetailDrawer from "./Components/CashFlowDetailDrawer";
import { getCashFlowById, getCashFlownsdicators, getCashFlows } from "../../services/cashFlowService";
import { formatToBRL } from "../../utils/Formatted/FormatToBRL";

export default function CashFlowPage() {

  const [cashFlows, setCashFlows] = useState([]);
  const [isDetailsOpen, setisDetailsOpen] = useState(false);
  const [cashFlowDetails, setCashFlowDetails] = useState({});
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [cashFlowIndicators, setcashFlowIndicators] = useState();

  const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };

  const handleDetails = async (cashFlow) => {
    const cashFlowDetailsResponse = await getCashFlowById(cashFlow.id);
    setCashFlowDetails(cashFlowDetailsResponse);
    setisDetailsOpen(true);
  };
console.log(search)
  const loadCashFlows = async () => {
    try {
      const cashFlowResponse = await getCashFlows({
        search,
        size,
        page,
      });
      const indicatorsResponse  = await getCashFlownsdicators({search});

      setCashFlows(cashFlowResponse?.content || cashFlowResponse || []);
      setTotalPages(cashFlowResponse?.totalPages || 0);

      setcashFlowIndicators(indicatorsResponse);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    loadCashFlows();
  }, [search, page, size]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      <HeaderSection
        title={"Fluxo de Caixa"}
        subtile={"Acompanhe todas as entradas e saídas do eu négocio"}
      
      />

      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        <SectionCards
          cards={[
            {
              label: "Entradas",
              data: formatToBRL(cashFlowIndicators?.income),
              icon: <ArrowDownToLine/>,
            },
            {
              label: "Saídas",
              data: formatToBRL(cashFlowIndicators?.expense),
              icon: <ArrowUpFromLine />,
            },
            {
              label: "Saldo do período",
              data: formatToBRL(cashFlowIndicators?.balance),
              icon: <DollarSign />,
            },
            {
              label: "Saldo atual",
              data: formatToBRL(cashFlowIndicators?.balanceTotal),
              icon: <Wallet />,
            },
          ]}
        />
        <CashFlowTable
          cashFlows={cashFlows}
          onDetails={handleDetails}
          onSearch={handleSearch}
        />
        <CashFlowDetailDrawer
          cashFlow={cashFlowDetails}
          open={isDetailsOpen}
          onClose={() => setisDetailsOpen(false)}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onSizeChange={setSize}
          onPageChange={setPage}
        />
      </section>

     
    </div>
  );
}
