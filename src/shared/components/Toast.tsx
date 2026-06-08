interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
}

export const Toast = ({ toast }: ToastProps) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all animate-toast-unfold flex items-center gap-2 border bg-[#0f111a] backdrop-blur-md ${
        toast.type === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'
      }`}
    >
      <div className={`relative flex items-center justify-center w-12 h-12 shrink-0 ${toast.type === 'success' ? 'animate-character-dance' : 'animate-character-error'}`}>
        {/* Brazos y piernas dibujados con SVG */}
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${toast.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`} viewBox="0 0 48 48">
          {toast.type === 'success' ? (
            <>
              {/* SUCCESS ARMS/LEGS */}
              <path d="M 14 26 L 6 22 M 6 22 L 2 18 M 6 22 L 2 24 M 6 22 L 4 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 18 34 L 16 42 M 30 34 L 32 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <rect x="12" y="42" width="7" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="29" y="42" width="7" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <g className="animate-wave" style={{ transformOrigin: '34px 26px' }}>
                <path d="M 34 26 L 42 20 M 42 20 L 42 14 M 42 20 L 46 18 M 42 20 L 46 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </>
          ) : (
            <>
              {/* ERROR ARMS/LEGS (Manos arriba, pies separados) */}
              <path d="M 14 26 L 8 18 M 8 18 L 4 14 M 8 18 L 8 12 M 8 18 L 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 34 26 L 40 18 M 40 18 L 44 14 M 40 18 L 40 12 M 40 18 L 36 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 18 34 L 14 42 M 30 34 L 34 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <rect x="10" y="42" width="7" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="31" y="42" width="7" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </>
          )}
        </svg>

        {/* Logo de Portly (cuerpo) */}
        <img 
          src="/portly_logo.png" 
          alt="Portly" 
          className={`w-6 h-6 relative z-10 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-all duration-300 ${
            toast.type === 'error' ? 'grayscale opacity-90' : ''
          }`} 
        />
      </div>
      
      <span className={toast.type === 'success' ? 'text-emerald-400 pr-2' : 'text-red-400 pr-2'}>
        {toast.message}
      </span>
    </div>
  );
};

