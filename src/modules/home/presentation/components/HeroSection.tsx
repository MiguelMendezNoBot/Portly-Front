import { useNavigate } from 'react-router-dom';
import { HeroMockup } from './HeroMockup';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-120px)] flex items-center">
      {/* ── Blobs de fondo animados ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob-pulse absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-[#7c6bec]/8 blur-3xl" />
        <div
          className="animate-blob-pulse absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-[#2dd4bf]/5 blur-3xl"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="animate-blob-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-[#7c6bec]/4 blur-3xl"
          style={{ animationDelay: '6s' }}
        />
        {/* Grid decorativo sutil */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,107,236,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(124,107,236,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Contenido ── */}
      <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-16 px-6 md:px-12 lg:px-20 py-16">

        {/* Columna izquierda: texto */}
        <div className="flex-1 max-w-xl flex flex-col items-center text-center lg:items-start lg:text-left">

          {/* Badge */}
          <div
            className="animate-hero-fadein opacity-0 inline-flex items-center gap-2.5 gradient-border-animated rounded-full px-4 py-2 mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[#C9BEFF] text-xs font-bold tracking-widest uppercase">
              Plataforma de portafolios para desarrolladores
            </span>
          </div>

          {/* Título */}
          <h1
            className="animate-hero-fadein delay-150 opacity-0 font-bold leading-[1.1] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}
          >
            <span className="text-white">Tu carrera profesional,</span>
            <br />
            <span className="text-shimmer">centralizada y visible.</span>
          </h1>

          {/* Subtítulo */}
          <p className="animate-hero-fadein delay-300 opacity-0 text-[#9ca3af] text-base sm:text-lg leading-relaxed mb-10 max-w-md">
            Crea un portafolio con plantilla profesional. Muestra tus proyectos,
            habilidades técnicas y blandas, formación y experiencia —
            <span className="text-white font-semibold"> todo en un solo lugar.</span>
          </p>

          {/* CTAs */}
          <div className="animate-hero-fadein delay-400 opacity-0 flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
            <button
              onClick={() => navigate('/register')}
              className="group relative w-full sm:w-auto overflow-hidden px-8 py-3.5 rounded-2xl bg-[#7c6bec] text-white font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(124,107,236,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_36px_rgba(124,107,236,0.6)] active:scale-[0.97]"
            >
              {/* Shimmer overlay on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative">CREAR PORTAFOLIO</span>
            </button>
            <button
              onClick={() => navigate('/explorar')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-white/10 bg-white/4 text-[#9ca3af] font-semibold text-sm tracking-wide hover:bg-white/8 hover:border-white/20 hover:text-white transition-all duration-300 active:scale-[0.97]"
            >
              EXPLORAR PORTAFOLIOS
            </button>
          </div>

          {/* Trust row */}
          <div className="animate-hero-fadein delay-500 opacity-0 flex flex-wrap items-center justify-center lg:justify-start gap-x-7 gap-y-2">
            {[
              'Plantillas profesionales',
              'Control de privacidad',
              'Estadísticas de visitas',
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-[#5a6278] text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Columna derecha: mockup */}
        <div className="animate-slide-right delay-200 opacity-0 flex-1 flex justify-center lg:justify-end w-full max-w-[480px] lg:max-w-none">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
};
