export default function Switch({ checked, onChange, isLoading = false }) {
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-success' : 'bg-destructive'}`}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md flex items-center justify-center transform duration-300 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isLoading && (
          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </button>
  );
}
