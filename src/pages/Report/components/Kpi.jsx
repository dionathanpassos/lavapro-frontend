export default function Kpi({ kpi }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase line-clamp-1">
          {kpi?.title}
        </span>
        <div className={`p-2 rounded-lg ${kpi.bg}`}>{kpi.icon}</div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {kpi.value}
        </h3>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs font-bold text-emerald-500">
            {kpi.growth}
          </span>
          <span className="text-[10px] text-slate-400 truncate">
            {kpi.period}
          </span>
        </div>
      </div>
    </div>
  );
}
