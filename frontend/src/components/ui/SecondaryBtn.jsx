function SecondaryBtn({ btn, onclick, className }) {
  return (
    <div>
      <button
        onClick={onclick}
        className={`text-white border border-white px-4 py-2 text-sm rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 active:bg-white/30 duration-200 ${className}`}
      >
        {btn}
      </button>
    </div>
  );
}

export default SecondaryBtn;
