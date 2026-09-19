function PrimaryBtn({ btn, onclick, className, type, disabled }) {
  return (
    <button
      type={type || "button"}
      onClick={onclick}
      disabled={disabled}
      className={`bg-[#1E4ED8] px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 min-w-26 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md ${className || ""}`}
    >
      {btn}
    </button>
  );
}

export default PrimaryBtn;
