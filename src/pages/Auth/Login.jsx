import { useState } from "react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import { login } from "../../services/authService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Info } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(form);

      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401 || error.status === 401) {
        toast.error("E-mail ou senha incorretos.");
      } else {
        const mensagemDoBackend =
          error.response?.data?.message || error.message;
        toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
        setFieldErrors(error.response?.data.fieldErrors);
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden px-6">
      <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50/50 bg-muted/30 p-4 text-sm">
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <Info size={18} className="shrink-0 text-primary" />
          <span>Ambiente de demonstração</span>
        </div>

        <p className="mb-4 leading-relaxed text-muted-foreground text-xs">
          O LavaPro é um projeto desenvolvido para fins de aprendizado e
          demonstração. Fique à vontade para explorar as funcionalidades
          utilizando a conta demo abaixo.
        </p>

        <div className="space-y-2 rounded-lg ">
          <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Credenciais de acesso
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Email: </span>
            <span className="font-medium">demo@email.com</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Senha: </span>
            <span className="font-medium">demo2026</span>
          </div>
        </div>
      </div>
      <Card>
        <div className="w-fit m-auto text-center bg-primary text-primary-foreground p-4 rounded-lg mt-2 shadow-lg">
          <span className="text-2xl font-extrabold text-white">LP</span>
        </div>
        <header className="text-center text-foreground text-xl my-6  ">
          Acesse na sua conta do LavaPro
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white">
          <Input
            label={"Email"}
            name={"email"}
            value={form.name}
            type={"text"}
            error={fieldErrors?.email}
            onChange={handleChange}
          />
          <Input
            label={"Senha"}
            name={"password"}
            value={form.password}
            type={"password"}
            error={fieldErrors?.password}
            onChange={handleChange}
          />
          <div className="text-right">
            <a
              href=""
              className="text-muted-foreground hover:text-primary hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>

          <Button text={"Entrar"} className={"mt-4"}></Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-md text-muted-foreground">
            Não possui conta?{" "}
            <a
              href="/auth/register"
              className="text-foreground font-bold hover:text-primary hover:underline"
            >
              Cadastrar
            </a>
          </span>
        </div>
      </Card>
    </div>
  );
}
