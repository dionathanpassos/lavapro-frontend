import { ArrowDownUp, UserPlus, Users } from "lucide-react";
import Kpi from "./Kpi";
import { useEffect, useState } from "react";
import {
  getCustomerReport,
  getCustomersMetrics,
} from "../../../services/reportService";
import CustomerTableReport from "./CustomerTableReport";

export default function CustomerReport({ startDate, endDate}) {
  const [report, setReport] = useState({});
  const [customerTotalOrders, setCustomerTotalOrders] = useState([])
  const [customerRevenue, setCustomerRevenue] = useState([])

  useEffect(() => {
    const loadReport = async () => {
      try {
        const reportResponse = await getCustomerReport({ startDate, endDate});
        
        const customerRevenue = await getCustomersMetrics({
          search: { 
            startDate: startDate,
            endDate: endDate,
            sort: "amountPayment,DESC" 
          }
        });

        const customerTotalOrders = await getCustomersMetrics({
          search: { 
            startDate: startDate,
            endDate: endDate,
            sort: "totalOrders,DESC" 
          }
        });

        setReport(reportResponse || {});
        setCustomerRevenue(customerRevenue?.content || []);
        setCustomerTotalOrders(customerTotalOrders?.content || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadReport();
  }, [startDate, endDate]); 

  return (
    <div className="animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Kpi
          kpi={{
            title: "Clientes atendidos",
            value: report.distinctCustomers,
            icon: <Users className="w-5 h-5 text-primary" />,
            bg: "bg-primary/10",
          }}
        />
        <Kpi
          kpi={{
            title: "Novos clientes",
            value: report.newCustomers,
            icon: <UserPlus className="w-5 h-5 text-success" />,
            bg: "bg-success-light",
          }}
        />
        
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6  mb-6">
        
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <CustomerTableReport
            customers={customerRevenue}
            label={"Clientes com maior faturamento"}
          />
        </div>
        <div>
          <CustomerTableReport
            customers={customerTotalOrders}
            label={"Cliente mais frequentes"}
          />
        </div>
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
