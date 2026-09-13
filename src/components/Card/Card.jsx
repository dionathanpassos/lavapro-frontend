export default function Card({children}) {
    return(
        <div className="border border-border px-8 py-6 rounded-xl bg-background-white overflow-hidden">
            {children}
        </div>
    );
}