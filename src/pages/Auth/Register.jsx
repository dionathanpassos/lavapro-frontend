import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";

export default function Register() {
  return (
    <div className="w-full max-w-md shadow-xl rounded-lg overflow-hidden px-6">
      <Card>
        <div className="w-fit m-auto text-center bg-primary/80 text-primary-foreground p-5 rounded-lg mt-2 shadow-lg">
          <span className=" text-xl font-extrabold">LP</span>
        </div>
        <header className="text-center text-foreground  text-xl my-6  ">
          Crie sua conta do LavaPro
        </header>
        <form className="flex flex-col gap-4 bg-white">
          <Input label={"Nome"} />
          <Input label={"Nome da Empresa"} />
          <Input label={"Email empresarial"} />
          <Input label={"Email"} />
          <Input label={"Senha"} />
          <Input label={"Confirmar senha"} />

          <Button text={"Cadastrar"}></Button>
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
