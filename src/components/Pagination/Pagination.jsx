import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "../Select/Select";

export default function Pagination({
  totalPages,
  page,
  onPageChange,
  onSizeChange,
  size
}) {  
  const getPagesArray = () => {
    const pages = [];
    const windowSize = 1; 

    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1) {
        pages.push(i);
      }
      else if (i >= page - windowSize && i <= page + windowSize) {
        pages.push(i);
      }
      else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center py-8 flex-wrap gap-2 md:gap-0">
      <Select
        name={"size"}
        value={String(size)}
        onChange={(e) => {
          const value = Number(e.target.value);
          onSizeChange(value);
          onPageChange(0);
        }}
        options={[
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "40", label: "40" },
          { value: "60", label: "60" },
          { value: "120", label: "120" },
          { value: "99999999999", label: "Todas" },
        ]}
      />

      <div className="flex">
        <div className="flex items-center mx-2">
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="p-2 bg-primary-light rounded-full hover:bg-primary hover:text-white cursor-pointer transition-all duration-200 ease-in-out active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>
        </div>

        <div className="flex items-center justify-center font-light">
          {getPagesArray().map((item, index) => {
            if (item === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-8 text-center text-gray-400 select-none"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`w-7 h-7 p-4 m-1 items-center flex rounded-full justify-center text-center 
              cursor-pointer hover:bg-primary hover:text-white transition-colors duration-200 ease-in-out active:scale-95 ${
                page === item ? "bg-primary text-white font-medium" : ""
              }`}
              >
                {item + 1}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center items-center mx-2">
          <button
            disabled={page === totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="p-2 bg-primary-light rounded-full hover:bg-primary hover:text-white cursor-pointer transition-colors duration-200 ease-in-out active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
