import { useEffect, useState } from "react";
import {
  createVehicle,
  getVehicle,
  getVehicleById,
  uptadeVehicle,
} from "../../services/vehicleService";
import VehicleTable from "./Components/VehicleTable";
import VehicleDetailDrawer from "./Components/VehicleDetailDrawer";
import VehicleFormDrawer from "./Components/VehicleFormDrawer";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination/Pagination";
import { CarFront } from "lucide-react";
import SectionCards from "../../components/SectionCards/SectionCards";
import HeaderSection from "../../components/HeaderSection/HeaderSection";

export default function VehiclesPage() {
  const INITIAL_FORM = {
    plate: "",
    model: "",
    brand: "",
    color: "",
    year: "",
    customerId: "",
  };
  const [vehicles, setVehicles] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingVehicle, setEditingVehicle] = useState();
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState();

  const cleanForm = () => {
    setForm(INITIAL_FORM);
    setEditingVehicle(null);
    setFieldErrors({});
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicleResponse = await getVehicle({ search, size, page });
        setVehicles(vehicleResponse?.content || vehicleResponse || []);
        setTotalVehicles(vehicleResponse?.totalElements || []);
        setTotalPages(vehicleResponse?.totalPages || 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVehicles();
  }, [search, page, size]);

  const handleDatails = async (vehicle) => {
    const id = vehicle.id;

    try {
      const vehicleResponse = await getVehicleById(id);
      setVehicleDetails(vehicleResponse);
      setOpenDetails(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVehicle) {
        await uptadeVehicle(form, editingVehicle.id);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await createVehicle(form);
        toast.success("Veículo cadastrado com sucesso!");
      }

      setOpenForm(false);
      cleanForm();

      const vehicleResponse = await getVehicle({ search, size, page });
      setVehicles(vehicleResponse?.content || vehicleResponse || []);
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data.fieldErrors);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      color: vehicle.color,
      year: vehicle.year,
      customerId: vehicle.customer?.id || vehicle.customerId, // Pega o ID do relacionamento vindo do banco
    });
    setOpenForm(true);
  };

  
   const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };

  const closeFormModal = () => {
    cleanForm();
    setOpenForm(false);
    setEditingVehicle(null);
  };
  const closeDetailsModal = () => {
    setOpenDetails(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      
      <HeaderSection
        title={"Veículos"}
        subtile={"Gerencie os veículos cadastrados na sua empresa"}
        buttonText={"Novo veículo"}
        onClick={() => {
          setOpenForm(true);
        }}
        onChange={handleSearch}
      />
      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        
        <SectionCards
          cards={[
            {
              label: "Total de veículos",
              data: totalVehicles,
              icon: <CarFront />,
            },
          ]}
        />
        <VehicleTable
          vehicles={vehicles}
          onDetails={handleDatails}
          onEdit={handleEdit}
          onSearch={handleSearch}
        />

        <VehicleFormDrawer
          open={openForm}
          form={form}
          onClose={closeFormModal}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={fieldErrors}
          editing={editingVehicle}
        />

        <VehicleDetailDrawer
          vehicle={vehicleDetails}
          open={openDetails}
          onClose={closeDetailsModal}
          onEdit={handleEdit}
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
