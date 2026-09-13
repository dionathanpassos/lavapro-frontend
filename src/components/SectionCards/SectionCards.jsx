export default function SectionCards({ cards }) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 -mt-13">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col md:flex-row gap-1 md:gap-3 items-center border border-border p-5 rounded-xl bg-background-white overflow-hidden shadow-md"
          >
            <span
              className={`${getStatusClasses(card.label)}
               p-3 rounded-full
              `}
            >
              {card.icon}
            </span>
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-muted-foreground">
                {card.label}
              </p>
              <h1 className="text-lg md:text-2xl font-bold">{card.data}</h1>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const getStatusClasses = (status) => {
  switch (status) {
    case "Aguardando":
    case "Ordens em operação":
    case "Novos este mês":
      return "bg-status-waiting-bg text-status-waiting";

    case "Entregues":
    case "Ordens de Serviço":
    case "Saldo atual":
      return "bg-status-delivered-bg text-delivered ";

    case "Recebidos":
    case "Concluídas":
    case "Faturamento do mês":
    case "Entradas":
    case "Itens ativos":
    case "Ativos":
      return "bg-success-light text-success";  

    case "Todas Ordens":
    case "Ticket médio":
    case "Total de registros":
    case "Em andamento":
    case "Total de items":
    case "Total de usuários":
      return "bg-status-progress-bg text-status-progress";

    case "Canceladas":
    case "Saídas":
    case "Inativos":
      return "bg-status-cancelled-bg text-status-cancelled";
      
    default:
      return "bg-status-progress-bg text-status-progress";
  }
};
