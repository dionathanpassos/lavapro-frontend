import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">

        {/* Ícone */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <ShieldX size={40} className="text-primary" />
          </div>
        </div>

        {/* Código */}
        <h1 className="text-7xl font-bold tracking-tight text-primary">
          403
        </h1>

        {/* Título */}
        <h2 className="mt-4 text-2xl font-semibold">
          Acesso não autorizado
        </h2>

        {/* Mensagem */}
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Você não possui permissão para acessar esta página.
          Entre em contato com o administrador caso precise
          de acesso a este recurso.
        </p>

        {/* Ações */}
        <div className="flex items-center justify-center gap-3 mt-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md
                       border border-border text-sm font-medium
                       hover:bg-primary/5 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md text-foreground-secondary 
                       bg-primary text-sm font-medium
                       hover:bg-primary-hover transition-colors"
          >
            <Home size={16} />
            Página inicial
          </button>

        </div>
      </div>
    </div>
  );
}