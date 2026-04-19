import { useNavigate } from 'react-router-dom';
import { HeroMockup } from './HeroMockup';

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-12 px-20 pt-5 pb-16">
      <div className="flex-1 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-src-0b0f24 border border-white/8 rounded-full px-3.5 py-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/70" />
          <span className="text-slate-300 text-xs font-semibold tracking-widest uppercase">
            PLATAFORMA DE PORTAFOLIOS
          </span>
        </div>

        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          <span className="text-white">Construye tu legado,</span>
          <br />
          <span className="text-teal-300"> un pixel a la vez.</span>
        </h1>

        <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md">
          La plataforma de portafolios profesionales para desarrolladores de
          software. Centraliza tus proyectos, habilidades y logros en un solo
          lugar — ya sea para postularte a un empleo o a un programa académico.
        </p>

        <div className="flex items-center gap-4 mb-4">
          <button className="px-6 py-3 rounded-full bg-src-6b72ff hover:bg-src-585fe6 text-white font-semibold text-sm tracking-wide shadow-lg shadow-src-6b72ff/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Comenzar ahora
          </button>
          <button
            onClick={() => navigate('/profesionales')}
            className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm tracking-wide hover:bg-white/5 hover:border-white/30 transition-all duration-200 active:scale-[0.98]"
          >
            Ver Profesionales
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center lg:justify-end">
        <HeroMockup />
      </div>
    </section>
  );
};
