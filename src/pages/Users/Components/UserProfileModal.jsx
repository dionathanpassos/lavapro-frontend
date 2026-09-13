import { useState } from "react";
import { X } from "lucide-react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { formatPhone } from "../../../utils/Formatted/formatPhone";

export default function UserProfileModal({
  open,
  editing,
  onSubmit,
  form,
  onChange,
  errors,
  onClose,
}) {
  
  const [activeTab, setActiveTab] = useState("personal");

  const handleClose = () => {
    setActiveTab("personal");
    onClose(false);
  };

  return (
    <div
      className={`inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all ${
        open ? "fixed" : "hidden"
      }`}
    >
      <div
        className={`
        relative w-full md:w-110 min-h-170 bg-background-white px-6 py-12 border-l border-border shadow-2xl flex flex-col z-50
        transition-transform duration-300 ease-in-out rounded-2xl
      `}
      >
        <header className="mb-6">
          <h1 className="text-xl font-semibold">Editar perfil</h1>
          <span className="text-muted-foreground text-sm">
            Edite os dados do seu perfil.
          </span>
        </header>

        <div className="grid grid-cols-2 border-b border-border mb-6">
          <button
            type="button"
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "personal"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Dados pessoais
          </button>

          <button
            type="button"
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "access"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("access")}
          >
            Dados de acesso
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 justify-between gap-6"
        >
          {activeTab === "personal" && (
            <div className="flex flex-col gap-6">
              <Input
                label={"Nome"}
                name={"name"}
                type={"text"}
                value={form.name}
                placeholder={"Nome do usuário"}
                onChange={onChange}
                error={errors?.name}
              />
              <Input
                label={"Email"}
                name={"email"}
                type={"email"}
                value={form.email}
                placeholder={"usuario@email.com"}
                onChange={onChange}
                disabled
                error={errors?.email}
              />
              <Input
                label={"Telefone"}
                name={"phone"}
                type={"text"}
                value={formatPhone(form?.phone)}
                placeholder={"(00) 00000-0000"}
                onChange={onChange}
                disabled
                maxLength={15}
                error={errors?.phone}
              />
              <Select
                label={"Função"}
                name={"role"}
                value={form.role}
                onChange={onChange}
                disabled
                error={errors?.role}
                options={[
                  { value: "ROLE_ADMIN", label: "Administrador" },
                  { value: "ROLE_EMPLOYEE", label: "Colaborador" },
                  { value: "ROLE_MANAGER", label: "Gerente" },
                ]}
              />
            </div>
          )}

          {activeTab === "access" && (
            <div className="flex flex-col gap-6">
              <div className="pt-4 flex flex-col gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {editing
                    ? "Alterar senha do usuário"
                    : "Definir senha inicial"}
                </span>

                <Input
                  label={editing ? "Nova Senha" : "Senha"}
                  name={"password"}
                  type={"password"}
                  value={form.password || ""}
                  placeholder={
                    editing
                      ? "Digite a nova senha se desejar alterar"
                      : "Senha de acesso"
                  }
                  onChange={onChange}
                  error={errors?.password}
                />

                <Input
                  label={"Confirmar Senha"}
                  name={"confirmPassword"}
                  type={"password"}
                  value={form.confirmPassword || ""}
                  placeholder={"Confirme a senha informada"}
                  onChange={onChange}
                  error={errors?.confirmPassword}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-end mt-6">
            <Button type={"button"} action={"cancel"} onClick={handleClose}>
              Cancelar
            </Button>
            <Button type={"submit"}>Salvar</Button>
          </div>
        </form>

        <button onClick={handleClose} className="absolute top-5 right-5">
          <X className="active:scale-95 active:opacity-90 hover:text-foreground/70" />
        </button>
      </div>
    </div>
  );
}
