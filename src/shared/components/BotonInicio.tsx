import { type ReactNode } from 'react';

interface Props {
  texto?: string;
  children?: ReactNode;
}

export default function BotonInicio({ texto = "EXPLORAR COMO INVITADO", children }: Props) {
  return (
    <div className="absolute top-0 right-0 z-20">
      <div className="relative bg-white pt-3 pb-5 pl-6 pr-5 rounded-bl-[2.5rem]">

        {/* Curva invertida SUPERIOR IZQUIERDA */}
        <div className="absolute top-0 -left-6 w-6 h-6 bg-white overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-[#0f111a] rounded-tr-[1.5rem]"></div>
        </div>

        {/* Curva invertida INFERIOR DERECHA */}
        <div className="absolute -bottom-6 right-0 w-6 h-6 bg-white overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-[#0f111a] rounded-tr-[1.5rem]"></div>
        </div>

        {/* Si hay children, los envuelve en la píldora morada; si no, el botón de texto */}
        {children ? (
          <div className="bg-[#9fa2ff] px-9 py-1.5 rounded-full flex items-center gap-6">
            {children}
          </div>
        ) : (
          <button
            type="button"
            className="bg-[#9fa2ff] hover:bg-[#868aff] text-[#1c1154] font-extrabold text-xs sm:text-sm px-6 py-3 sm:px-8 sm:py-3.5 rounded-full transition-colors uppercase tracking-wide"
          >
            {texto}
          </button>
        )}

      </div>
    </div>
  );
}