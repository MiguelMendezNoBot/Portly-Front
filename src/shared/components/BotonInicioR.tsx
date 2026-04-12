import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface IconoRuta {
  icono: ReactNode;
  to: string;
  label?: string;
}

interface BotonInicioRProps {
  texto?: string;
  to?: string;
  children?: ReactNode;
  iconos?: IconoRuta[];
  colorFondoMobil?: string;
}

export default function BotonInicioR({
  texto = 'EXPLORAR COMO INVITADO',
  to = '/',
  children,
  iconos = [],
  colorFondoMobil = 'bg-src-9fa2ff',
}: BotonInicioRProps) {
  // Versión Desktop (sin cambios)
  const DesktopContent = () => (
    <div className="hidden md:block absolute top-0 right-0 z-20">
      <div className="relative bg-white pt-3 pb-5 pl-6 pr-5 rounded-bl-[2.5rem]">
        <div className="absolute top-0 -left-6 w-6 h-6 bg-white overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-src-0f111a rounded-tr-[1.5rem]"></div>
        </div>
        <div className="absolute -bottom-6 right-0 w-6 h-6 bg-white overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-src-0f111a rounded-tr-[1.5rem]"></div>
        </div>

        {children ? (
          <div className="bg-src-9fa2ff px-9 py-1.5 rounded-full flex items-center gap-6">
            {children}
          </div>
        ) : (
          <Link
            to={to}
            className="bg-src-9fa2ff hover:bg-src-868aff text-src-1c1154 font-extrabold text-xs sm:text-sm px-6 py-3 sm:px-8 sm:py-3.5 rounded-full transition-colors uppercase tracking-wide inline-block"
          >
            {texto}
          </Link>
        )}
      </div>
    </div>
  );

  // Versión Móvil: botones horizontales con espaciado adaptable
  const MobileContent = () => {
    if (iconos.length === 0) return null;

    return (
      <div className="block md:hidden absolute top-4 right-4 z-20 flex flex-row items-center gap-2 sm:gap-3">
        {iconos.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${colorFondoMobil} flex items-center justify-center text-src-1c1154 shadow-lg hover:scale-105 active:scale-95 transition-transform`}
            aria-label={item.label || `Navegar a ${item.to}`}
          >
            <span className="w-5 h-5">{item.icono}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      <DesktopContent />
      <MobileContent />
    </>
  );
}