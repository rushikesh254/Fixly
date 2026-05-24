function PrimaryBtn({ btn, onclick, className }) {
  return (
    <button
      onClick={onclick}
      className={`bg-[#1E4ED8] px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 ${className || ""}`}
    >
      {btn}
    </button>
  );
}

export default PrimaryBtn;
