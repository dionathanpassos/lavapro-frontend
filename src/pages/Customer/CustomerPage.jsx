import { useEffect, useState } from "react";
import {
  createCustomer,
  getCustomerById,
  getCustomers,
  uptadeCustomer,
} from "../../services/customerService";
import toast from "react-hot-toast";
import CustomerTable from "./Components/CustomerTable";
import CustomerDetailDrawer from "./Components/CustomerDetailDrawer";
import CustomerFormDrawer from "./Components/CustomerFormDrawer";
import { formatPhone } from "../../utils/Formatted/formatPhone";
import { countCurrentMonthDates } from "../../utils/Count/countDateMonth";
import Pagination from "../../components/Pagination/Pagination";
import { Star, Users } from "lucide-react";
import SectionCards from "../../components/SectionCards/SectionCards";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import { useLocation } from "react-router";

export default function Customer() {
  const INITIAL_FORM = {
    name: "",
    phone: "",
  };
  const [customers, setCustomers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingCustomer, setEditingCustomer] = useState();
  const [customerDetails, setCustomerDetails] = useState({});
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState();
  const location = useLocation();

  useEffect(() => {
    if(location.state?.openModal) {
      setOpenForm(true);

      window.history.replaceState({}, document.title);
    }
  }, [location])

  const totalMonth = countCurrentMonthDates(customers);
  const cleanForm = () => {
    setForm(INITIAL_FORM);
    setEditingCustomer(null);
    setFieldErrors({});
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerResponse = await getCustomers({ search, size, page });
        setCustomers(customerResponse?.content || customerResponse || []);
        setTotalCustomers(customerResponse?.totalElements || []);
        setTotalPages(customerResponse?.totalPages || 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomers();
  }, [search, page, size]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhone(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formToSend = {
        ...form,
        phone: form.phone ? form.phone.replace(/\D/g, "") : "",
      };
      if (editingCustomer) {
        await uptadeCustomer(formToSend, editingCustomer.id);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await createCustomer(formToSend);
        toast.success("Cliente criado com sucesso!");
      }

      setOpenForm(false);
      cleanForm();

      const customerResponse = await getCustomers({search, size, page});
      setCustomers(customerResponse?.content || customerResponse || []);
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data.fieldErrors);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name,
      phone: formatPhone(customer.phone),
    });

    setOpenForm(true);
  };

   const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };
  const handleDatails = async (customer) => {
    const id = customer.id;

    try {
      const customerResponse = await getCustomerById(id);
      setCustomerDetails(customerResponse);
      setOpenDetails(true);
    } catch (error) {
      console.error(error);
    }
  };
  const closeFormModal = () => {
    cleanForm();
    setOpenForm(false);
    setEditingCustomer(null);
  };
  const closeDetailsModal = () => {
    setOpenDetails(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      <HeaderSection
        title={"Clientes"}
        subtile={"Gerencie os clientes cadastrados na sua empresa"}
        buttonText={"Novo cliente"}
        onClick={() => {
          setOpenForm(true);
        }}
        onChange={handleSearch}
      />
      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        <SectionCards
          cards={[
            {
              label: "Total de cliente",
              data: totalCustomers,
              icon: <Users />,
            },
            {
              label: "Novos este mês",
              data: totalMonth,
              icon: <Star />,
            },
          ]}
        />
        <CustomerTable
          customers={customers}
          onDetails={handleDatails}
          onEdit={handleEdit}
          onSearch={handleSearch}
        />
        <CustomerFormDrawer
          open={openForm}
          form={form}
          onClose={closeFormModal}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={fieldErrors}
          editing={editingCustomer}
        />
        <CustomerDetailDrawer
          customer={customerDetails}
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
