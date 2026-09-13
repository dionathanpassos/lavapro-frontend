import { useState } from "react";
import { FileText, ArrowDownUp, Users, DollarSign } from "lucide-react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import FinancialReport from "./components/FinancialReport";
import OperationalReport from "./components/OperationalReport";
import CustomerReport from "./components/CustomerReport";
import OverviewReport from "./components/OverviewReport";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("geral");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatórios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe os indicadores financeiros, operacionais e de clientes da
            sua empresa.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row justify-between  gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 w-fit gap-2 rounded-lg px-3 py-2 bg-white text-sm text-slate-700 min-w-60">
              <Input label={"Início"} type={"date"} onChange={(e) => setStartDate(e.target.value)}  />
              <Input label={"Final"} type={"date"} onChange={(e) => setEndDate(e.target.value)}  />
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-3 w-full md:w-auto justify-end ">
          <Button text={"Aplicar filtros"} />
        </div> */}
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab("geral")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === "geral" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <FileText className="w-4 h-4" /> Visão geral
        </button>
        <button
          onClick={() => setActiveTab("financial")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === "financial" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <DollarSign className="w-4 h-4" /> Financeiro
        </button>
        <button
          onClick={() => setActiveTab("operational")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === "operational" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <ArrowDownUp className="w-4 h-4" /> Operacional
        </button>
        <button
          onClick={() => setActiveTab("customer")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === "customer" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <Users className="w-4 h-4" /> Clientes
        </button>
      </div>

      {activeTab === "geral" && 
        <OverviewReport
          startDate={startDate} 
          endDate={endDate}
        />
      }
      {activeTab === "financial" && 
        <FinancialReport
          startDate={startDate} 
          endDate={endDate}
        />
      }
      {activeTab === "operational" && 
        <OperationalReport
          startDate={startDate} 
          endDate={endDate}
        />
      }
      {activeTab === "customer" && 
        <CustomerReport 
          startDate={startDate} 
          endDate={endDate} 
        />
      }
    </div>
  );
}
