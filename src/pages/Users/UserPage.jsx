import { ShieldBan, ShieldCheck, Users } from "lucide-react";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import { useCallback, useEffect, useState } from "react";
import SectionCards from "../../components/SectionCards/SectionCards";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination/Pagination";
import { activateUser, createUser, deactivateUser, getUserIndicators, getUsers, updateUser } from "../../services/userService";
import UserFormDrawer from "./Components/UserFormDrawer";
import { useNavigate } from "react-router";
import UserTable from "./Components/UserTable";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState();
  const [userIndicators, setUserIndicators] = useState({});
  const [fieldErrors, setFieldErrors] = useState();
  const [loadingStatusIds, setLoadingStatusIds] = useState([]);
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const INITIAL_FORM = {
    name: "",
    email: "",
    role: "ROLE_ADMIN",
    password: "",
    phone: ""
  };

  const [form, setForm] = useState(INITIAL_FORM);

  const cleanForm = () => {
    setForm(INITIAL_FORM);
    setEditingUser(null);
    setIsDrawerOpen(false);
    setFieldErrors({});
    navigate("/usuarios");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

      if (name === "phone") {
      const cleanValue = value.replace(/\D/g, "");
      
      setForm((prev) => ({
        ...prev,
        phone: cleanValue,
      }));

    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

  };

  const handleEdit = (user) => {
    setEditingUser(user);
    navigate("/usuarios/editar")

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role ?? "",
    });

    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await updateUser(form, editingUser.id);
        toast.success("Usuário alterado com sucesso!");
      } else {
        await createUser(form);
        toast.success("Usuário criado com sucesso!");
      }

      cleanForm();
      loadUsers();
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data.fieldErrors);
    }
  };

  const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };

  const loadUsers = useCallback(async () => {
    try {
      const userResponse = await getUsers({
        search,
        size,
        page,
      });
      const indicatorsResponse = await getUserIndicators({search});

      setUsers(userResponse?.content || userResponse || []);
      setTotalPages(userResponse?.totalPages || 0);
      setUserIndicators(indicatorsResponse || 0);
    } catch (error) {
      console.log(error);
    }
  }, [search, page, size]);;

  const handleToggleStatus = async (id, currentActiveState) => {
    setLoadingStatusIds((prev) => [...prev, id]);

    try {
      if (currentActiveState) {
        await deactivateUser(id);
        toast.success("Usuário desativado com sucesso!")
      } else {
        await activateUser(id);
        toast.success("Usuário ativado com sucesso!")

      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, active: !currentActiveState } : user,
        ),
      );
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
    } finally {
      setLoadingStatusIds((prev) =>
        prev.filter((loadingId) => loadingId !== id),
      );
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers, loadingStatusIds]);

 

  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      <HeaderSection
        title={"Usuários"}
        subtile={
          "Gerencie os usuários que tem acesso ao sistema"
        }
        buttonText={"Novo Usuário"}
        onClick={() => {
          setIsDrawerOpen(true);
          navigate(`/usuarios/novo`);
        }}
        onChange={handleSearch}
      />

      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        <SectionCards
          cards={[
            {
              label: "Total de usuários",
              data: userIndicators.totalUsers,
              icon: <Users />,
            },
            {
              label: "Ativos",
              data: userIndicators.totalActive,
              icon: <ShieldCheck />,
            },{
              label: "Inativos",
              data: userIndicators.totalInactive,
              icon: <ShieldBan />,
            },
          ]}
        />
        <UserTable
          users={users}
          onEdit={handleEdit}
          onStatusChange={handleToggleStatus}
          loadingIds={loadingStatusIds}
          onSearch={handleSearch}
        />
        <UserFormDrawer
          open={isDrawerOpen}
          form={form}
          onSubmit={handleSubmit}
          editing={editingUser}
          onChange={handleChange}
          onClose={() => {
            cleanForm();
          }}
          errors={fieldErrors}
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
