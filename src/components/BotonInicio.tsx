interface Props {
  texto?: string;
}

export default function BotonInicio({ texto = "EXPLORAR COMO INVITADO" }: Props) {
  return (
    // Contenedor principal anclado a la esquina superior derecha
    <div className="absolute top-0 right-0 z-20">
      
      {/* El fondo blanco principal. 
      */}
      <div className="relative bg-white pt-4 pb-6 pl-8 pr-6 rounded-bl-[2.5rem]">
        
        {/* Curva invertida SUPERIOR IZQUIERDA */}
        {/* Esto suaviza el ángulo recto de 90 grados en la parte de arriba */}
        <div className="absolute top-0 -left-6 w-6 h-6 bg-white overflow-hidden pointer-events-none">
           <div className="w-full h-full bg-[#0f111a] rounded-tr-[1.5rem]"></div>
        </div>

        {/* Curva invertida INFERIOR DERECHA */}
        {/* Esto suaviza el ángulo recto de 90 grados en el lado derecho */}
        <div className="absolute -bottom-6 right-0 w-6 h-6 bg-white overflow-hidden pointer-events-none">
           <div className="w-full h-full bg-[#0f111a] rounded-tr-[1.5rem]"></div>
        </div>
        <button 
          type="button"
          className="bg-[#9fa2ff] hover:bg-[#868aff] text-[#1c1154] font-extrabold text-xs sm:text-sm px-6 py-3 sm:px-8 sm:py-3.5 rounded-full transition-colors uppercase tracking-wide"
        >
          {texto}
        </button>

      </div>
    </div>
  );
}