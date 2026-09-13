import { useEffect, useState } from "react";


import Pagination from "../../components/Pagination/Pagination";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import { getCustomersMetrics } from "../../services/reportService";
import CustomerTablePage from "./components/CustomerTablePage";

export default function ReportCustomerPage() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerResponse = await getCustomersMetrics({ search, size, page });
        setCustomers(customerResponse?.content || customerResponse || []);
        
        setTotalPages(customerResponse?.totalPages || 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomers();
  }, [search, page, size]);

    const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">     
      <HeaderSection
        title={"Relatório de Clientes"}
      />
      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        <CustomerTablePage
          customers={customers}
          onSearch={handleSearch}
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
