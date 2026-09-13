import { Plus } from "lucide-react";
import Button from "../Button/Button";

export default function HeaderSection({
  title,
  subtile,
  buttonText,
  onClick,
}) {
    
  return (
    <div className="flex flex-col items-center md:h-35 h-35 p-6 ">
      <div className="w-full mt-2 mb-8">
        <div className="flex justify-between w-full items-center h-12 gap-2">
          <div>
            <h1 className="text-xl md:text-2xl text-foreground-secondary font-bold tracking-tight">
              {title}
            </h1>
            <span className="hidden md:flex text-xs md:text-sm text-muted-foreground">
              {subtile}
            </span>
          </div>
          {buttonText && (
            <Button text={buttonText} onClick={onClick} className={""}>
              <Plus className="w-5" />
            </Button>
          )}
        </div>
      </div>
      
    </div>
  );
}
