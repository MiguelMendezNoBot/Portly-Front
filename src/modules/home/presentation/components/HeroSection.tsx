import { HeroMockup } from './HeroMockup';

const AVATARS = [
  { bg: '#7c3aed', label: 'A' },
  { bg: '#0891b2', label: 'B' },
  { bg: '#059669', label: 'C' },
];

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l2.9 6.3 6.8.6-5 4.7 1.5 6.7L12 17l-6.2 3.3 1.5-6.7-5-4.7 6.8-.6z" />
  </svg>
);

export const HeroSection = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-12 px-20 pt-5 pb-16">
      {/* Left: Text content */}
      <div className="flex-1 max-w-xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0b0f24] border border-white/8 rounded-full px-3.5 py-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/70" />
          <span className="text-slate-300 text-xs font-semibold tracking-widest uppercase">
            Nuevo: Motor de diseño con IA
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          <span className="text-white">Construye tu legado,</span>
          <br />
          <span className="text-teal-300"> un pixel a la vez.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md">
          La plataforma de portafolios profesionales para desarrolladores de software. Centraliza tus proyectos, habilidades y logros en un solo lugar — ya sea para postularte a un empleo o a un programa académico.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-12">
          <button className="px-6 py-3 rounded-full bg-[#6B72FF] hover:bg-[#585fe6] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#6B72FF]/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Comenzar ahora
          </button>
          <button className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm tracking-wide hover:bg-white/5 hover:border-white/30 transition-all duration-200 active:scale-[0.98]">
            Ver portafolios
          </button>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex -space-x-2.5">
            {AVATARS.map((av, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#0f1629] flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: av.bg }}
              >
                {av.label}
              </div>
            ))}
          </div>
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <span className="text-slate-400 text-sm">Utilizado por más de 2,000 profesionales del software</span>
        </div>
      </div>

      {/* Right: Mockup */}
      <div className="flex-1 flex justify-center lg:justify-end">
        <HeroMockup />
      </div>
    </section>
  );
};