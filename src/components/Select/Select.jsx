import { ChevronDown } from "lucide-react";

export default function Select({ error, label, name, onChange, options = [], value, ...props }) {
  return (
    <div className="flex flex-col">
      {label && (
        <span className="text-sm text-foreground font-semibold mb-1.5">
          {label}
        </span>
      )}

      <div
        className={`
          relative flex items-center border rounded-lg
          ${error ? "border-destructive focus:outline-none focus:border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-2 focus:ring-foreground"}
          `}
      >
        <select
          {...props}
          name={name}
          onChange={onChange}
          value={value ?? ""}
          className={`
                     px-3 py-2 text-sm text-foreground transition-all duration-300 outline-none appearance-none pr-10 w-full
                `}
        >
          {options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}
