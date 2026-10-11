import { useState} from "react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import { register } from "../../services/authService";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    companyEmail: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({})

     if (formData.password !== formData.confirmPassword) {
      setFieldErrors({confirmPassword: "As senhas não coincidem."});
      return;
    }

    try {
      setLoading(true);
      
      await register({
        name: formData.name,
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Registro criado com sucesso! Redirecionando...")
      window.location.href = "/auth/login";
      
    } catch (error) {
      const mensagemDoBackend =
        error.response?.data?.message || error.message;
        toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
        setFieldErrors(error.response?.data.fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg overflow-hidden px-6">
      <Card>
        <div className="w-fit m-auto text-center bg-primary text-primary-foreground p-4 rounded-lg mt-2 shadow-lg">
            <span className="text-2xl font-extrabold text-white">LP</span>
        </div>
        <header className="text-center text-foreground text-xl my-6">
          Crie sua conta do LavaPro
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white">
          <Input 
            label={"Nome"} 
            name={"name"}            
            value={formData.name} 
            onChange={handleChange} 
            error={fieldErrors?.name}
          />
          <Input 
            label={"Nome da empresa"}
            name={"companyName"}
            value={formData.companyName} 
            onChange={handleChange} 
            error={fieldErrors?.companyName}

          />
          <Input 
            label={"Email empresarial"}
            name={"companyEmail"} 
            type={"email"}
            value={formData.companyEmail} 
            onChange={handleChange} 
            error={fieldErrors?.companyEmail}
          />
          <Input 
            label={"Email"} 
            name={"email"}
            type={"email"}
            value={formData.email} 
            onChange={handleChange} 
            error={fieldErrors?.email}

          />
          <Input 
            label={"Senha"}
            name={"password"}
            type={"password"}
            value={formData.password} 
            onChange={handleChange} 
            error={fieldErrors?.password}

          />
          <Input 
            label={"Confirmar Senha"}
            name={"confirmPassword"}
            type={"password"}
            value={formData.confirmPassword} 
            onChange={handleChange} 
            error={fieldErrors?.confirmPassword}
            
          />

          {/* Botão desabilitado enquanto a requisição acontece */}
          <Button 
            text={loading ? "Cadastrando..." : "Cadastrar"} 
            type="submit" 
            disabled={loading} 
          />
        </form>

        <div className="mt-6 text-center">
          <span>
            Já possui uma conta?{" "}
            <a
              href="/auth/login"
              className="text-foreground font-bold hover:text-primary hover:underline"
            >
              Entrar
            </a>
          </span>
        </div>
      </Card>
    </div>
  );
}
