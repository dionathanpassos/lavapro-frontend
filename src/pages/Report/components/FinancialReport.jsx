import { ArrowDownUp, DollarSignIcon, HandCoins, Ticket } from "lucide-react";
import FaturamentoChart from "../../../components/ChartsLine/ChartsLine";
import ChartsDonut from "../../../components/ChartsLine/ChartsDonut";
import Kpi from "./Kpi";
import { useEffect, useState } from "react";
import {
  getFinancialReport,
  getFinancialReportPayment,
} from "../../../services/reportService";
import { formatToBRL } from "../../../utils/Formatted/FormatToBRL";
import { groupRevenueByWeekDay } from "../../../utils/groupRevenueByWeekDay";
import { ChartBar } from "../../../components/ChartsLine/ChartBar";
import PaymentTableReport from "./PaymentTableReport";
import Pagination from "../../../components/Pagination/Pagination";

export default function FinancialReport({ startDate, endDate}) {
  const [report, setReport] = useState({});
  const [payments, setPayments] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  

  const revenueByWeekDay = groupRevenueByWeekDay(report?.revenueGroupedByDate);

  useEffect(() => {
    const loadReport = async () => {
    try {
      const reportResponse = await getFinancialReport({ startDate, endDate });
      const reportPaymentResponse = await getFinancialReportPayment({
        size,
        page,
        startDate,
        endDate,
      });
      
      setReport(reportResponse || {});
      setPayments(reportPaymentResponse?.content || []);
      setTotalPages(reportPaymentResponse?.totalPages || 0);
    } catch (error) {
      console.error(error);
    }
  };

    loadReport();
  }, [page, size, startDate, endDate]);

  return (
    <div className="animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Kpi
          kpi={{
            title: "Faturamento",
            value: formatToBRL(report?.revenue),
            icon: <DollarSignIcon className="w-5 h-5 text-success" />,
            bg: "bg-success-light",
          }}
        />
        <Kpi
          kpi={{
            title: "Pagamentos",
            value: report.countPayment,
            icon: <HandCoins className="w-5 h-5 text-success" />,
            bg: "bg-success-light",
          }}
        />
        <Kpi
          kpi={{
            title: "Ticket médio",
            value: formatToBRL(report.averageTicket),
            icon: <Ticket className="w-5 h-5 text-primary" />,
            bg: "bg-primary/10",
          }}
        />
        
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6  mb-6">
        <FaturamentoChart
          data={report.revenueGroupedByDate}
          title={"Faturamento por periodo"}
        />

        <ChartsDonut
          title={"Faturamento por metodo de pagamento"}
          serviceOrders={report.paymentByMethod}
          type="currency"
        />
        <ChartBar
          title={"Faturamento por dia da semana"}
          data={revenueByWeekDay}
        />
      </div>

      <div className="">
        <PaymentTableReport payments={payments} totalPages={totalPages} />
        <Pagination
          page={page}
          totalPages={totalPages}
          onSizeChange={setSize}
          onPageChange={setPage}
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
