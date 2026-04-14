import { useState, useRef, useEffect } from 'react';
import { Skill } from '../../../domain/entities/Skill';

// 1. Switch para los logos de las tecnologías
const TechIcon = ({ name }: { name: string }) => {
  const iconProps = {
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'React':
      return (
        <svg
          width="800px"
          height="800px"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.6789 15.9759C18.6789 14.5415 17.4796 13.3785 16 13.3785C14.5206 13.3785 13.3211 14.5415 13.3211 15.9759C13.3211 17.4105 14.5206 18.5734 16 18.5734C17.4796 18.5734 18.6789 17.4105 18.6789 15.9759Z"
            fill="#53C1DE"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.7004 11.1537C25.2661 8.92478 25.9772 4.79148 23.4704 3.39016C20.9753 1.99495 17.7284 4.66843 16.0139 6.27318C14.3044 4.68442 10.9663 2.02237 8.46163 3.42814C5.96751 4.82803 6.73664 8.8928 7.3149 11.1357C4.98831 11.7764 1 13.1564 1 15.9759C1 18.7874 4.98416 20.2888 7.29698 20.9289C6.71658 23.1842 5.98596 27.1909 8.48327 28.5877C10.9973 29.9932 14.325 27.3945 16.0554 25.7722C17.7809 27.3864 20.9966 30.0021 23.4922 28.6014C25.9956 27.1963 25.3436 23.1184 24.7653 20.8625C27.0073 20.221 31 18.7523 31 15.9759C31 13.1835 26.9903 11.7923 24.7004 11.1537ZM24.4162 19.667C24.0365 18.5016 23.524 17.2623 22.8971 15.9821C23.4955 14.7321 23.9881 13.5088 24.3572 12.3509C26.0359 12.8228 29.7185 13.9013 29.7185 15.9759C29.7185 18.07 26.1846 19.1587 24.4162 19.667ZM22.85 27.526C20.988 28.571 18.2221 26.0696 16.9478 24.8809C17.7932 23.9844 18.638 22.9422 19.4625 21.7849C20.9129 21.6602 22.283 21.4562 23.5256 21.1777C23.9326 22.7734 24.7202 26.4763 22.85 27.526ZM9.12362 27.5111C7.26143 26.47 8.11258 22.8946 8.53957 21.2333C9.76834 21.4969 11.1286 21.6865 12.5824 21.8008C13.4123 22.9332 14.2816 23.9741 15.1576 24.8857C14.0753 25.9008 10.9945 28.557 9.12362 27.5111ZM2.28149 15.9759C2.28149 13.874 5.94207 12.8033 7.65904 12.3326C8.03451 13.5165 8.52695 14.7544 9.12123 16.0062C8.51925 17.2766 8.01977 18.5341 7.64085 19.732C6.00369 19.2776 2.28149 18.0791 2.28149 15.9759ZM9.1037 4.50354C10.9735 3.45416 13.8747 6.00983 15.1159 7.16013C14.2444 8.06754 13.3831 9.1006 12.5603 10.2265C11.1494 10.3533 9.79875 10.5569 8.55709 10.8297C8.09125 9.02071 7.23592 5.55179 9.1037 4.50354ZM20.3793 11.5771C21.3365 11.6942 22.2536 11.85 23.1147 12.0406C22.8562 12.844 22.534 13.6841 22.1545 14.5453C21.6044 13.5333 21.0139 12.5416 20.3793 11.5771ZM16.0143 8.0481C16.6054 8.66897 17.1974 9.3623 17.7798 10.1145C16.5985 10.0603 15.4153 10.0601 14.234 10.1137C14.8169 9.36848 15.414 8.67618 16.0143 8.0481ZM9.8565 14.5444C9.48329 13.6862 9.16398 12.8424 8.90322 12.0275C9.75918 11.8418 10.672 11.69 11.623 11.5748C10.9866 12.5372 10.3971 13.5285 9.8565 14.5444ZM11.6503 20.4657C10.6679 20.3594 9.74126 20.2153 8.88556 20.0347C9.15044 19.2055 9.47678 18.3435 9.85796 17.4668C10.406 18.4933 11.0045 19.4942 11.6503 20.4657ZM16.0498 23.9915C15.4424 23.356 14.8365 22.6531 14.2448 21.8971C15.4328 21.9423 16.6231 21.9424 17.811 21.891C17.2268 22.6608 16.6369 23.3647 16.0498 23.9915ZM22.1667 17.4222C22.5677 18.3084 22.9057 19.1657 23.1742 19.9809C22.3043 20.1734 21.3652 20.3284 20.3757 20.4435C21.015 19.4607 21.6149 18.4536 22.1667 17.4222ZM18.7473 20.5941C16.9301 20.72 15.1016 20.7186 13.2838 20.6044C12.2509 19.1415 11.3314 17.603 10.5377 16.0058C11.3276 14.4119 12.2404 12.8764 13.2684 11.4158C15.0875 11.2825 16.9178 11.2821 18.7369 11.4166C19.7561 12.8771 20.6675 14.4086 21.4757 15.9881C20.6771 17.5812 19.7595 19.1198 18.7473 20.5941ZM22.8303 4.4666C24.7006 5.51254 23.8681 9.22726 23.4595 10.8426C22.2149 10.5641 20.8633 10.3569 19.4483 10.2281C18.6239 9.09004 17.7698 8.05518 16.9124 7.15949C18.1695 5.98441 20.9781 3.43089 22.8303 4.4666Z"
            fill="#53C1DE"
          />
        </svg>
      );
    case 'TypeScript':
      return (
        <svg
          {...iconProps}
          fill="currentColor"
          stroke="none"
          className="text-[#3178c6]"
        >
          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111v2.111c-.473-.074-.975-.111-1.504-.111-1.252 0-1.909.585-1.909 1.67v1.599h3.413v2.112h-3.413V24h-2.389v-6.871h-1.574v-2.112h1.574v-1.649c0-2.31 1.347-3.618 3.662-3.618zM12 24H9.611v-6.871H7.135v-2.112h2.476v-1.649c0-2.31 1.347-3.618 3.662-3.618.612 0 1.154.037 1.627.111v2.111c-.473-.074-.975-.111-1.504-.111-1.252 0-1.909.585-1.909 1.67V24z" />
        </svg>
      );
    case 'Node.js':
      return (
        <svg {...iconProps} className="text-[#68a063]">
          <path d="M12 2L4.5 6.5v9L12 20l7.5-4.5v-9L12 2z" />
          <polyline points="12 22 12 12 19.5 7.5" />
          <polyline points="4.5 7.5 12 12" />
        </svg>
      );
    case 'Tailwind CSS':
      return (
        <svg {...iconProps} className="text-[#38bdf8]">
          <path d="M12 4.1c-1.8 0-3 .9-3.6 2.7 1.8-.9 3-.6 3.6.9.9 2.2 0 3.9-2.7 5.1 1.8 0 3-.9 3.6-2.7-.9 2.2 0 3.9 2.7 5.1 1.8 0 3-.9 3.6-2.7-.9 2.2 0 3.9 2.7 5.1 1.8 0 3-.9 3.6-2.7-.9 2.2 0 3.9 2.7 5.1-1.8 0-3-.9-3.6-2.7 1.8.9 3 .6 3.6-.9-.9-2.2 0-3.9 2.7-5.1-1.8 0-3 .9-3.6 2.7.9-2.2 0-3.9-2.7-5.1-1.8 0-3-.9-3.6-2.7.9-2.2 0-3.9 2.7-5.1" />
        </svg>
      );
    default: // Icono genérico de código para otros
      return (
        <svg {...iconProps} className="text-[#9ca3af]">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
};

// 2. Switch para los iconos de Nivel (el pequeño al lado del texto)
const LevelIcon = ({ level }: { level: string }) => {
  const iconProps = {
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '3',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (level) {
    case 'Maestro':
      return (
        <svg {...iconProps} className="text-[#C9BEFF]">
          <path d="M6 9l6-3 6 3v6l-6 3-6-3V9z" />
          <path d="M12 3v3" />
          <path d="M12 18v3" />
        </svg>
      ); // Representación de Corona/Diamante
    case 'Experto':
      return (
        <svg
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="32.5"
            height="32.5"
            rx="16.25"
            fill="#C5830B"
            fill-opacity="0.2"
          />
          <path
            d="M21.5 14L20.5625 11.9375L18.5 11L20.5625 10.0625L21.5 8L22.4375 10.0625L24.5 11L22.4375 11.9375L21.5 14ZM21.5 24.5L20.5625 22.4375L18.5 21.5L20.5625 20.5625L21.5 18.5L22.4375 20.5625L24.5 21.5L22.4375 22.4375L21.5 24.5ZM14 22.25L12.125 18.125L8 16.25L12.125 14.375L14 10.25L15.875 14.375L20 16.25L15.875 18.125L14 22.25ZM14 18.6125L14.75 17L16.3625 16.25L14.75 15.5L14 13.8875L13.25 15.5L11.6375 16.25L13.25 17L14 18.6125Z"
            fill="#FFB954"
          />
        </svg>
      ); // Estrella
    case 'Avanzado':
      return (
        <svg {...iconProps} className="text-[#C9BEFF]">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ); // Capas/Rocket
    case 'Intermedio':
      return (
        <svg {...iconProps} className="text-[#C9BEFF]">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ); // Rayo
    default: // Básico
      return (
        <svg {...iconProps} className="text-[#C9BEFF]">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v6l4 2" />
        </svg>
      ); // Reloj/Semilla
  }
};

export default function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="group relative bg-[#1a1a2e] rounded-2xl p-5 flex items-center justify-between border border-white/5 hover:border-[#6b72ff]/40 transition-all duration-300 shadow-md">
      <div className="flex items-center gap-4">
        {/* Contenedor del Logo de Tecnología */}
        <div className="w-12 h-12 rounded-xl  flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
          <TechIcon name={skill.name} />
        </div>

        <div>
          <h3 className="text-white font-bold text-lg">{skill.name}</h3>
          {/* Nivel con su Icono SVG al lado */}
          <div className="flex items-center gap-1.5">
            <LevelIcon level={skill.level} />
            <p className="text-[#6b72ff] text-xs font-bold uppercase tracking-wider">
              {skill.level}
            </p>
          </div>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-[#9ca3af] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-12 w-40 bg-[#0f111a] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                onEdit();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-[#6b72ff] text-sm font-medium flex items-center gap-3 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9M16.5 3.5L20 7l-9 9-4 1 1-4 9-9z" />
              </svg>
              Editar
            </button>
            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white text-sm font-medium flex items-center gap-3 border-t border-white/5 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
