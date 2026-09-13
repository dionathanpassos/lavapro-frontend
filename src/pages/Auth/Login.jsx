import { useState } from "react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import { login } from "../../services/authService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({})

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

    setFieldErrors(prev => {
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
        setFieldErrors(error.response?.data.fieldErrors)
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden px-6">
      <Card>
        <div className="w-fit m-auto text-center bg-primary/80 text-primary-foreground p-5 rounded-lg mt-2 shadow-lg">
            <span className=" text-xl font-extrabold">LP</span>
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
            <a href="" className="text-muted-foreground hover:text-primary hover:underline">Esqueceu a senha?</a>
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
