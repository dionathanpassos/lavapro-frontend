import {
  Check,
  CircleX,
  FileText,
  PackageCheck,
  RotateCwFadingClock,
  Wrench,
} from "lucide-react";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import { useCallback, useEffect, useState } from "react";
import SectionCards from "../../components/SectionCards/SectionCards";
import ServiceOrdersTable from "./Components/ServiceOrdersTable";
import {
  deliverServiceOrder,
  finishtServiceOrder,
  getServiceOrderById,
  getServiceOrderIndicators,
  getServiceOrders,
  startServiceOrder,
} from "../../services/serviceOrderService";

import Modal from "./Components/Modal";
import ServiceOrderDetailsModal from "./Components/ServiceOrderDetailsModal";
import Pagination from "../../components/Pagination/Pagination";
import ModalChangeStatus from "./Components/ModalChangeStatus";
import toast from "react-hot-toast";
import { useLocation } from "react-router";

export default function ServiceOrder() {
  const INITIAL_FORM = {
    observations: "",
    vehicleId: "",
  };
  const [serviceOrders, setServiceOrders] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsOpen, setisDetailsOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [editingServiceOrder, setEditingServiceOrder] = useState();
  const [serviceOrderDetails, setServiceOrderDetails] = useState({});
  const [serviceOrderIndicators, setServiceOrderIndicators] = useState();
  const [serviceOrderChangeStatus, setServiceOrderChangeStatus] = useState(null);
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalServiceOrders, setTotalServiceOrders] = useState();
  const [status, setStatus] = useState();

  const location = useLocation();

  useEffect(() => {
    if(location.state?.openModal) {
      setIsDrawerOpen(true);

      window.history.replaceState({}, document.title);
    }
  }, [location])

  const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };

  const handleEdit = (serviceOrder) => {
    setEditingServiceOrder(serviceOrder);
    setIsDrawerOpen(true);
  };

  const handleDetails = async (serviceOrder) => {
    const serviceOrderDetailsResponse = await getServiceOrderById(
      serviceOrder.id,
    );
    setServiceOrderDetails(serviceOrderDetailsResponse);
    setisDetailsOpen(true);
  };

  const handleChangeStatusModal = (serviceOrder) => {
    setServiceOrderChangeStatus(serviceOrder);
    setIsChangeStatusOpen(true);
  };

  const handleChangeStatus = async () => {
    if (!serviceOrderChangeStatus) return;

    try {
      const { id, status } = serviceOrderChangeStatus;

      if (status === "WAITING") {
        await startServiceOrder(id);
      } else if (status === "IN_PROGRESS") {
        await finishtServiceOrder(id);
      } else if (status === "READY") {
        await deliverServiceOrder(id);
      }

      setIsChangeStatusOpen(false);
      setServiceOrderChangeStatus(null);
      
      toast.success("Status atualizado com sucesso!");

      const updatedOrderDetails = await getServiceOrderById(id);
      setServiceOrderDetails(updatedOrderDetails);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg || "Erro ao salvar dados da OS.");
    }
  };

  const loadServiceOrders = useCallback(async () => {
    try {
      const ServiceOrderResponse = await getServiceOrders({
        search,
        status,
        size,
        page,
      });
      const serviceOrderIndicators = await getServiceOrderIndicators();

      setServiceOrders(
        ServiceOrderResponse?.content || ServiceOrderResponse || [],
      );
      setServiceOrderIndicators(serviceOrderIndicators);
      setTotalServiceOrders(ServiceOrderResponse?.totalElements || 0);

      setTotalPages(ServiceOrderResponse?.totalPages || 0);
    } catch (error) {
      console.error(error);
    }
  }, [search, status, size, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadServiceOrders();
  }, [loadServiceOrders, serviceOrderChangeStatus]);

  const handleCloseAll = () => {
    setIsDrawerOpen(false);
    setEditingServiceOrder(null);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      <>
        <HeaderSection
          title={"Ordens de Serviço"}
          subtile={"Gerencie todas as ordens de serviço da sua empresa"}
          buttonText={"Nova OS"}
          onClick={() => setIsDrawerOpen(true)}
        />

        <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
          <SectionCards
            cards={[
              {
                label: "Todas Ordens",
                data: totalServiceOrders,
                icon: <FileText />,
              },
              {
                label: "Aguardando",
                data: serviceOrderIndicators?.waiting,
                icon: <RotateCwFadingClock />,
              },
              {
                label: "Em andamento",
                data: serviceOrderIndicators?.inProgress,
                icon: <Wrench />,
              },
              {
                label: "Concluídas",
                data: serviceOrderIndicators?.ready,
                icon: <Check />,
              },
              {
                label: "Entregues",
                data: serviceOrderIndicators?.delivered,
                icon: <PackageCheck />,
              },
              {
                label: "Canceladas",
                data: serviceOrderIndicators?.canceled,
                icon: <CircleX />,
              },
            ]}
          />
          <ServiceOrdersTable
            serviceOrders={serviceOrders}
            onEdit={handleEdit}
            onDetails={handleDetails}
            onSearch={handleSearch}
            onChangeStatus={handleChangeStatusModal}
          />

          <Modal
            isOpen={isDrawerOpen}
            onClose={handleCloseAll}
            editData={editingServiceOrder}
            onSuccess={loadServiceOrders}
          />

          <Pagination
            page={page}
            size={size}
            totalPages={totalPages}
            onSizeChange={setSize}
            onPageChange={setPage}
          />
        </section>
      </>

      <ModalChangeStatus
        isOpen={isChangeStatusOpen}
        onClose={() => {
          setIsChangeStatusOpen(false);
          setServiceOrderChangeStatus(null);
        }}
        onConfirm={handleChangeStatus}
      />
    </div>
  );
}
