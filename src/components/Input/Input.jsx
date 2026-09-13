export default function Input({ label, type, name, value, onChange, error, placeholder, className, maxLength, ...props }) {
  return (
    <div className={`flex flex-col ${className ? className : "" }`}>
      <span className="text-sm font-semibold mb-1.5 ">{label}</span>
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        dis
        className={`
          border rounded-md px-3 py-2 text-base md:text-sm text-foreground transition-all duration-300 outline-none 
          ${error ? "border-destructive focus:outline-none focus:border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-2 focus:ring-foreground"}`}
      ></input>

      {error && (
        <span className="text-sm text-destructive mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
