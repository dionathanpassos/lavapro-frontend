import { ArrowDownUp, Check, CircleX, Clock, FileText } from "lucide-react";
import Kpi from "./Kpi";
import { useEffect, useState } from "react";
import {
  getOperationalReport,
  getOperationalReportServiceOrders,
} from "../../../services/reportService";
import Pagination from "../../../components/Pagination/Pagination";
import ChartsDonut from "../../../components/ChartsLine/ChartsDonut";
import MostPerformedServices from "../../Dashboard/Components/MostPerformedServices";
import ServiceOrderTableReport from "./ServiceOrderTableReport";

export default function OperationalReport({ startDate, endDate }) {
  const [report, setReport] = useState({});
  const [serviceOrders, setServiceOrders] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  console.log(report?.serviceOrderKpi?.totalServiceOrder);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const reportResponse = await getOperationalReport({
          startDate,
          endDate,
        });
        const reportServiceOrdersResponse =
          await getOperationalReportServiceOrders({
            size,
            page,
            startDate,
            endDate,
          });

        setReport(reportResponse || {});
        setServiceOrders(reportServiceOrdersResponse?.content || []);
        setTotalPages(reportServiceOrdersResponse?.totalPages || 0);
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
            title: "Total de ordens de serviço",
            value: report?.serviceOrderKpi?.totalServiceOrder,
            icon: <FileText className="w-5 h-5 text-primary" />,
            bg: "bg-primary/10",
          }}
        />
        <Kpi
          kpi={{
            title: "Concluídas",
            value: report?.serviceOrderKpi?.completed,
            icon: <Check className="w-5 h-5 text-success" />,
            bg: "bg-success-light",
          }}
        />
        <Kpi
          kpi={{
            title: "Canceladas",
            value: report?.serviceOrderKpi?.canceled,
            icon: <CircleX className="w-5 h-5 text-rose-600" />,
            bg: "bg-rose-50",
          }}
        />
        <Kpi
          kpi={{
            title: "Em operação",
            value: report?.serviceOrderKpi?.inProgress,
            icon: <Clock className="w-5 h-5 text-warning" />,
            bg: "bg-warning-light",
          }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6  mb-6">
        <ChartsDonut
          title={"Ordens de serviço por status"}
          serviceOrders={report.serviceOrderSummary}
        />
        <MostPerformedServices services={report.bestSellingServices} />
      </div>

      <div className="">
        <ServiceOrderTableReport
          serviceOrders={serviceOrders}
          totalPages={totalPages}
        />
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
