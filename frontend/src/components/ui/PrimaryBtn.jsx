function PrimaryBtn({ btn, onclick, className }) {
  return (
    <div>
      <button
        onClick={onclick}
        className={`bg-[#1E4ED8] px-7 text-white py-2.5 rounded-xl text-sm  shadow-2xl cursor-pointer hover:bg-blue-700 transition active:bg-blue-800  duration-200 ${className}`}
      >
        {btn}
      </button>
    </div>
  );
}

export default PrimaryBtn;
