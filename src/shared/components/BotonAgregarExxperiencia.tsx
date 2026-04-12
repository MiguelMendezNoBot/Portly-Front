export const BotonAgregarExperiencia = (onClick: any, title: string) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:bg-[#5a52d5] text-[#0D0096] py-3 px-8 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm"
    >
      {title}
    </button>
  );
};
