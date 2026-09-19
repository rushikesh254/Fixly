function SecondaryBtn({ btn, onclick, className, type, disabled }) {
  return (
    <div>
      <button
        type={type || "button"}
        onClick={onclick}
        disabled={disabled}
        className={`text-white border border-white px-4 py-2 text-sm rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 active:bg-white/30 duration-200 min-w-26 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {btn}
      </button>
    </div>
  );
}

export default SecondaryBtn;
