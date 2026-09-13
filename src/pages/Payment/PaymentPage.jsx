import {
  Check,
  CheckCircle,
  CircleX,
  FileSpreadsheet,
  FileText,
  HandCoins,
  PackageCheck,
  RotateCwFadingClock,
  Wrench,
} from "lucide-react";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import { useEffect, useState } from "react";
import SectionCards from "../../components/SectionCards/SectionCards";
import PaymentTable from "./Components/PaymentTable";


import Modal from "./Components/Modal";
import Pagination from "../../components/Pagination/Pagination";
import toast from "react-hot-toast";
import { cancelPayment, getPaymentById, getPaymentIndicators, getPayments } from "../../services/paymentService";
import PaymentDetailDrawer from "./Components/PaymentDetailDrawer";
import ModalCancelPayment from "./Components/ModalCancelPayment";

export default function PaymentPage() {

  const [payments, setPayments] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsOpen, setisDetailsOpen] = useState(false);
  const [isCancelPaymentOpen, setIsCancelPaymentOpen] = useState(false);
  const [editingServiceOrder, setEditingServiceOrder] = useState();
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentCancel, setPaymentCancel] = useState({});
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [paymentsIndicators, setPaymentsIndicators] = useState();

  const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };

  const handleDetails = async (payment) => {
    const paymentDetailsResponse = await getPaymentById(payment.id);
    setPaymentDetails(paymentDetailsResponse);
    setisDetailsOpen(true);
  };

  const handleCancelPaymentModal = (payment) => {
    setPaymentCancel(payment);
    setIsCancelPaymentOpen(true);
  };

  const handleCancelPayment = async () => {
     if (!paymentCancel) return;
     const id = paymentCancel.id;

     try {
      await cancelPayment(id);

      setPaymentCancel(null);
      setIsCancelPaymentOpen(false);
      setisDetailsOpen(false);
      toast.success("Paamento cancelado com sucesso!");
     } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg || "Erro ao salvar dados da OS.");
     }

  }

  const loadPayments = async () => {
    try {
      const paymentResponse = await getPayments({
        search,
        size,
        page,
      });
      const indicatorsResponse  = await getPaymentIndicators({search});

      setPayments(paymentResponse?.content || paymentResponse || []);
      setTotalPages(paymentResponse?.totalPages || 0);

      setPaymentsIndicators(indicatorsResponse);

    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseAll = () => {
    setIsDrawerOpen(false);
    setEditingServiceOrder(null);
  };

  useEffect(() => {
    loadPayments();
  }, [search, page, size, paymentCancel]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      <HeaderSection
        title={"Pagamentos"}
        subtile={"Gerencie os pagamentos das ordens de serviço"}
      />

      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        <SectionCards
          cards={[
            {
              label: "Total de registros",
              data: paymentsIndicators?.total,
              icon: <FileText/>,
            },
            {
              label: "Recebidos",
              data: paymentsIndicators?.totalPaid,
              icon: <CheckCircle />,
            },
            {
              label: "Canceladas",
              data: paymentsIndicators?.totalCanceled,
              icon: <CircleX />,
            },
          ]}
        />
        <PaymentTable
          payments={payments}
          onDetails={handleDetails}
          onSearch={handleSearch}
        />
        <PaymentDetailDrawer
          payment={paymentDetails}
          open={isDetailsOpen}
          onClose={() => setisDetailsOpen(false)}
          onCancel={handleCancelPaymentModal}
        />

        <Modal
          isOpen={isDrawerOpen}
          onClose={handleCloseAll}
          editData={editingServiceOrder}
          onSuccess={loadPayments}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onSizeChange={setSize}
          onPageChange={setPage}
        />
      </section>

      <ModalCancelPayment
        isOpen={isCancelPaymentOpen}
        onClose={() => {
          setIsCancelPaymentOpen(false);
          setPaymentCancel(null);
        }}
        onConfirm={handleCancelPayment}
      />
    </div>
  );
}
