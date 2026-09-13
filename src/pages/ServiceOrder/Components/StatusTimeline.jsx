import { Check } from 'lucide-react'; 
import Button from '../../../components/Button/Button';

const STATUS_FLUXO = [
  { id: 'WAITING', label: 'Aguardando', button: 'Iniciar' },
  { id: 'IN_PROGRESS', label: 'Em andamento', button: 'Concluir' },
  { id: 'READY', label: 'Concluído', button: 'Entregar' },
  { id: 'DELIVERED', label: 'Entregue' }
];

export default function StatusTimeline({ serviceOrder, onChangeStaus }) {

  const statusAtual = serviceOrder?.status || 'WAITING';

  const indiceAtivo = STATUS_FLUXO.findIndex(passo => passo.id === statusAtual);
  const larguraProgresso = `${(indiceAtivo / (STATUS_FLUXO.length - 1)) * 100}%`;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm w-full">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Status atual
        </h2>
      </div>

      <div className="px-5 py-6">
        <div className="relative grid grid-cols-4 gap-4 text-xs sm:text-sm">
          
          <div className="absolute w-full h-0.5 bg-slate-100 top-4 left-0 z-0" />
          
          <div 
            className="absolute h-0.5 bg-emerald-500 top-4 left-0 z-0 transition-all duration-500 ease-in-out"
            style={{ width: larguraProgresso }}
          />

          {STATUS_FLUXO.map((step, idx) => {
            const isConcluido = idx < indiceAtivo;
            const isAtual = idx === indiceAtivo;
            const isPendente = idx > indiceAtivo;
            
  
            const mostrarCheck = isConcluido || (isAtual && step.id === 'DELIVERED');

            return (
              <div key={step.id} className="flex flex-col items-center z-10 gap-3">
                
       
                <div className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center w-8 h-8
                  ${mostrarCheck ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : ''}
                  ${isAtual && step.id !== 'DELIVERED' ? 'bg-blue-600 text-white ring-4 ring-blue-50 border border-blue-600 font-bold' : ''}
                  ${isPendente ? 'bg-slate-100 text-slate-400 border border-slate-200' : ''}
                `}>
                  {mostrarCheck ? (
                    <Check className="w-4 h-4" />
                  ) : isAtual ? (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  )}
                </div>

              
                <span className={`text-center font-medium transition-colors duration-300 whitespace-nowrap
                  ${mostrarCheck ? 'text-slate-700 font-semibold' : ''}
                  ${isAtual && step.id !== 'DELIVERED' ? 'text-blue-600 font-bold' : ''}
                  ${isPendente ? 'text-slate-400' : ''}
                `}>
                  {step.label}
                </span>

                {isAtual && step.button && (
                    <Button onClick={() => onChangeStaus(serviceOrder)}>
                        {step.button}
                    </Button>
                )}

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
