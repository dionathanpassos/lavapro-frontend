import {
  Pencil,
  User,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { getProfileUser, updateProfileUser } from "../../services/userService";
import { formatPhone } from "../../utils/Formatted/formatPhone";
import { formatDateTime } from "../../utils/Formatted/FormatDateTime";
import UserProfileModal from "./Components/UserProfileModal";

import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});

  const loadProfile = useCallback(async () => {
    try {
      const profileResponse = await getProfileUser();

      setUser(profileResponse || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, [loadProfile]);

  const cleanForm = () => {
    setForm({});
    setOpen(false);
    navigate("/usuarios/profile");
  };
  const handleEdit = () => {
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role ?? "",
    });

    setOpen(true);
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
      };
      
      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }
      await updateProfileUser(payload);
      toast.success("Usuário alterado com sucesso!");

      cleanForm();
      loadProfile();
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data.fieldErrors);
    }
  };

  if (!user) {
    return (
      <div className="w-full bg-white p-6 rounded-xl border border-border shadow-md text-center text-muted-foreground">
        Carregando dados do perfil...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-6 rounded-xl border border-border shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleEdit}
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-foreground-secondary font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm shadow-sm active:scale-95 duration-300"
        >
          <Pencil className="w-4 h-4" />
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Dados de Contato
          </h3>

          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100 h-20">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                E-mail
              </span>
              <span className="text-sm font-semibold">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100 h-20">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                Telefone
              </span>
              <span className="text-sm font-semibold">
                {formatPhone(user.phone)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Informações da Conta
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col p-3 bg-gray-50/50 rounded-lg border border-gray-100 gap-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Nível de Acesso
              </div>
              <span className="text-sm font-bold text-gray-700">
                {getUserRole(user.role)}
              </span>
            </div>

            <div className="flex flex-col p-3 bg-gray-50/50 rounded-lg border border-gray-100 gap-1.5 h-20">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Situação
              </div>
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide ${getStatusClasses(user.active)}`}
                >
                  {user.active ? "ATIVO" : "INATIVO"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100 h-20">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                Membro desde
              </span>
              <span className="text-sm font-medium">
                {formatDateTime(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {user.updatedAt && (
        <div className="mt-6 pt-4 border-t border-border text-right">
          <p className="text-[11px] text-gray-400">
            Última atualização do perfil em: {formatDateTime(user.updatedAt)}
          </p>
        </div>
      )}

      <UserProfileModal
        open={open}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          cleanForm();
        }}
        errors={fieldErrors}
      />
    </div>
  );
}
const getStatusClasses = (status) => {
  switch (status) {
    case true:
      return "bg-emerald-50 text-emerald-600";
    case false:
      return "bg-destructive-light text-destructive";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const getUserRole = (role) => {
  if (role === "ROLE_OWNER") return "Proprietário";
  if (role === "ROLE_ADMIN") return "Administrador";
  if (role === "ROLE_EMPLOYEE") return "Atendente";
  return role;
};
