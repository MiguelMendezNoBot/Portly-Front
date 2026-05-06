import { useNavigate } from 'react-router-dom';

export default function PreviewBanner() {
  const navigate = useNavigate();

  const handleBack = () => {
    window.close();
    // Fallback: si el navegador bloquea window.close(), navegar normalmente
    setTimeout(() => navigate('/portfolios'), 100);
  };

  return (
    <div className="sticky top-0 z-[999] flex items-center justify-between px-6 py-3 bg-background border-b-2 border-primary font-inter">
      {/* Izquierda: Botón volver */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Volver a Portly
      </button>

      {/* Centro: Indicador de modo preview */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="text-sm font-bold tracking-wide text-primary uppercase">
          Previsualización
        </span>
      </div>

      {/* Derecha: Aviso de privacidad */}
      <span className="text-xs text-white/40">
        Este enlace no es público aún.
      </span>
    </div>
  );
}
