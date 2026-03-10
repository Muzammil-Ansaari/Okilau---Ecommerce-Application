const Button = ({
  children,
  onClick,
  variant = "black",
  className = "",
  type = "button",
}) => {
  const variants = {
    black:
      "bg-black text-white border border-black hover:bg-[#d0d0d0] hover:text-black",
    gray: "bg-[#D0D0D0] text-black border border-[#D0D0D0] hover:bg-black hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        px-10 py-3.5 text-sm
        font-medium tracking-widest uppercase
        transition-all duration-300 cursor-pointer
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
