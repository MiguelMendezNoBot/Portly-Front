import { useEffect, useRef } from 'react';

const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
        <path d="M12 11v4M10 13h4" />
      </svg>
    ),
    value: '100%',
    label: 'Gratis para empezar',
    colorClass: 'text-[#C9BEFF]',
    bg: 'bg-[#7c6bec]/10',
    border: 'border-[#7c6bec]/20',
    glow: 'rgba(124,107,236,0.15)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    value: '< 5 min',
    label: 'De registro a publicado',
    colorClass: 'text-[#2dd4bf]',
    bg: 'bg-[#2dd4bf]/10',
    border: 'border-[#2dd4bf]/20',
    glow: 'rgba(45,212,191,0.12)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    value: 'Total',
    label: 'Control de privacidad',
    colorClass: 'text-pink-300',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    glow: 'rgba(236,72,153,0.12)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    value: '24/7',
    label: 'Estadísticas en tiempo real',
    colorClass: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'rgba(52,211,153,0.12)',
  },
];

export const BenefitsStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.benefit-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('is-visible'), i * 110);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={stripRef} className="relative border-y border-white/5 bg-[#0b0f22]/90 backdrop-blur-sm py-14 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[100px] rounded-full bg-[#7c6bec]/6 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
        {benefits.map((b, i) => (
          <div
            key={i}
            className={`benefit-card reveal flex flex-col items-center gap-3 text-center p-5 rounded-2xl border ${b.border} ${b.bg} transition-all duration-300 hover:-translate-y-1.5`}
            style={{
              boxShadow: `0 0 0 0 ${b.glow}`,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${b.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${b.glow}`;
            }}
          >
            <div className={`${b.colorClass} opacity-90`}>{b.icon}</div>
            <span className={`font-black text-3xl tracking-tight leading-none ${b.colorClass}`}>{b.value}</span>
            <span className="text-[#5a6278] text-sm font-medium leading-snug">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
