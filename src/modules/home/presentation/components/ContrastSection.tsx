// ContrastSection — replica los patrones de color y tarjetas de PortfolioList y ViewPortfolioListModal

const withoutItems = [
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    text: 'Un PDF desactualizado que nadie revisa',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" /></svg>,
    text: 'Sin visibilidad real ante reclutadores del sector',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    text: 'Proyectos dispersos en GitHub sin contexto ni narrativa',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
    text: 'Sin estadísticas: no sabes si alguien vio tu trabajo',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
    text: 'Sin control de privacidad sobre lo que compartes',
  },
];

const withItems = [
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" /></svg>,
    text: 'Portafolio con plantilla profesional en minutos',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    text: 'Habilidades técnicas y blandas organizadas y visibles',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    text: 'Experiencia laboral y formación académica estructuradas',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    text: 'Estadísticas reales: visitas, proyectos más vistos',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
    text: 'Control granular de privacidad por sección del portafolio',
  },
];

export const ContrastSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#7c6bec]/4 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="reveal text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Tu talento merece una{' '}
            <span className="text-shimmer">presentación a su altura</span>
          </h2>
          <p className="mt-4 text-[#9ca3af] text-lg max-w-xl mx-auto">
            Los desarrolladores que consiguen mejores oportunidades no tienen el mejor CV —
            tienen la mejor presencia online.
          </p>
        </div>

        {/* Columnas */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Sin Portly — mismos estilos de borde rojo que PortfolioList en modo delete */}
          <div className="reveal-left rounded-2xl border border-red-500/20 bg-[#1a1c29] p-7 lg:p-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-red-400">Sin Portly</h3>
            </div>
            <ul className="space-y-3.5">
              {withoutItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0 text-red-400/70">
                    {item.icon}
                  </span>
                  <span className="text-[#9ca3af] text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Con Portly — mismos estilos que la tarjeta activa/publicada de PortfolioList */}
          <div className="reveal-right rounded-2xl border border-[#7c6bec]/25 bg-[#1a1c29] p-7 lg:p-9 relative overflow-hidden">
            {/* Brillo interno superior */}
            <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-[#7c6bec]/8 rounded-full blur-2xl" />
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="w-8 h-8 rounded-xl bg-[#7c6bec]/20 border border-[#7c6bec]/30 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9BEFF" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#C9BEFF]">Con Portly</h3>
            </div>
            <ul className="space-y-3.5 relative">
              {withItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-7 h-7 rounded-lg bg-[#7c6bec]/15 border border-[#7c6bec]/20 flex items-center justify-center shrink-0 text-[#8e80f5]">
                    {item.icon}
                  </span>
                  <span className="text-[#e2e2e8] text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
