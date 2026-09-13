export default function Button({children, text, className, type, action, onClick}) {
    return(
        <button 
        type={type} 
        onClick={onClick}
        className={`
            flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-colors truncate 
            duration-300 active:scale-95 active:opacity-90 ${className}
            ${
                action == "cancel" 
                ? "bg-destructive-light border border-destructive hover:bg-destructive hover:text-foreground-secondary" 
                : "bg-primary hover:bg-primary-hover text-foreground-secondary"}
        `}
        >
            {children}
            {text}
            
        </button>
    );
}