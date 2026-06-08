import { useState, useEffect, useRef } from 'react';

// ── Mockup 1: Portafolio con plantilla ───────────────────────────────────────
const PortfolioTemplateMockup = () => (
  <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0f111a] shadow-2xl w-full">
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.015]">
      <div className="flex items-center gap-2 text-[#C9BEFF]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Vista de portafolio</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 uppercase tracking-wider">Público</span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#7c6bec]/15 text-[#C9BEFF] border border-[#7c6bec]/25 uppercase tracking-wider">Plantilla Dark</span>
      </div>
    </div>
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-[#7c6bec]/20 border border-white/5 flex items-center justify-center shrink-0">
          <span className="text-[#C9BEFF] font-bold text-sm">M</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm">Marco Fernández</p>
          <p className="text-[#9ca3af] text-xs">Backend Developer</p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#5a6278]">Habilidades Técnicas</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[['Python', 'Avanzado'], ['FastAPI', 'Experto'], ['Docker', 'Intermedio'], ['AWS', 'Básico']].map(([name, level]) => {
            const colors: Record<string, string> = {
              Básico: 'bg-slate-500/20 text-slate-300',
              Intermedio: 'bg-blue-500/20 text-blue-300',
              Avanzado: 'bg-violet-500/20 text-violet-300',
              Experto: 'bg-emerald-500/20 text-emerald-300',
            };
            return (
              <span key={name} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${colors[level]}`}>
                {name}<span className="opacity-60 ml-1">· {level}</span>
              </span>
            );
          })}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#5a6278]">Habilidades Blandas</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Liderazgo', 'Creatividad', 'Gestión del Tiempo'].map((s) => (
            <span key={s} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300">{s}</span>
          ))}
        </div>
      </div>
      <div className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded bg-[#7c6bec]/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#8e80f5" strokeWidth="2">
              <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold">Microservicios con FastAPI</p>
            <p className="text-[#9ca3af] text-[11px] mt-0.5">Arquitectura escalable con autenticación OAuth2.</p>
            <div className="flex gap-1 mt-1.5">
              {['Python', 'FastAPI', 'Redis'].map((t) => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[#7c6bec]/15 text-[#C9BEFF]">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Mockup 2: Privacidad — réplica fiel de la pantalla "Visibilidad" de Portly ─
const PrivacyMockup = () => {
  // Toggle interactivo: las secciones collapsables
  const [generalOpen, setGeneralOpen] = useState(false);
  const [toggles, setToggles] = useState({
    correo: true, profesion: true, descripcion: true, telefono: false,
    pais: true, linkedin: true, github: true, instagram: false, facebook: true, youtube: true,
  });
  const [sectionToggles, setSectionToggles] = useState({
    tecnicas: true, blandas: true, trayectoria: true, formacion: true, proyectos: true,
  });

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative shrink-0 w-9 h-5 rounded-full transition-colors duration-300 focus:outline-none"
      style={{ background: on ? 'linear-gradient(135deg,#7c6bec,#a78bfa)' : 'rgba(255,255,255,0.12)' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
        style={{ transform: on ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b0f1a] shadow-2xl w-full flex" style={{ minHeight: 420 }}>
      {/* Contenido principal */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-white/5">
          <h3 className="text-white font-bold text-sm">Visibilidad</h3>
          <p className="text-[#5a6278] text-[10px] mt-0.5">Controla qué información es visible en tu perfil público</p>
        </div>

        <div className="p-4 flex flex-col gap-2.5">
          {/* Información General — expandible */}
          <div className="rounded-xl border border-white/8 bg-[#111420] overflow-hidden">
            <button
              onClick={() => setGeneralOpen(!generalOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-[#e2e2e8] text-[11px] font-bold uppercase tracking-widest">Información General</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a6278" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: generalOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {generalOpen && (
              <div className="border-t border-white/5 flex flex-col">
                {(Object.entries({
                  correo: 'Mostrar correo electrónico',
                  profesion: 'Mostrar profesión',
                  descripcion: 'Mostrar descripción profesional',
                  telefono: 'Mostrar número de teléfono',
                  pais: 'Mostrar país',
                  linkedin: 'Mostrar LinkedIn',
                  github: 'Mostrar GitHub',
                  instagram: 'Mostrar Instagram',
                  facebook: 'Mostrar Facebook',
                  youtube: 'Mostrar YouTube',
                }) as [keyof typeof toggles, string][]).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-[#9ca3af] text-[10px]">{label}</span>
                    <Toggle on={toggles[key]} onToggle={() => setToggles(t => ({ ...t, [key]: !t[key] }))} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Secciones collapsables con toggle */}
          {(Object.entries({
            tecnicas: 'Habilidades técnicas',
            blandas: 'Habilidades blandas',
            trayectoria: 'Trayectoria profesional',
            formacion: 'Formación académica',
            proyectos: 'Proyectos',
          }) as [keyof typeof sectionToggles, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-white/8 bg-[#111420] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Toggle
                  on={sectionToggles[key]}
                  onToggle={() => setSectionToggles(t => ({ ...t, [key]: !t[key] }))}
                />
                <span className="text-[#e2e2e8] text-[11px] font-medium">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Mockup 3: Explorar portafolios — minimalista con animación de búsqueda ──
const ExploreMockup = () => {
  const cards = [
    { initial: 'C', name: 'Cristian Mendez', role: 'Desarrollador Fullstack', template: 'Dark', templateColor: '#7c6bec', skills: ['React', 'Node.js'] },
    { initial: 'V', name: 'Victor M. Terrazas', role: 'Desarrollador', template: 'Brutalista', templateColor: '#f59e0b', skills: ['JavaScript'] },
    { initial: 'O', name: 'Emanuel Onofre', role: 'Lic. en Ing. Sistemas', template: 'Corporate', templateColor: '#2dd4bf', skills: ['Python', 'SQL'] },
    { initial: 'C', name: 'crhistofer vera', role: 'Desarrollador', template: 'Profesional', templateColor: '#2563eb', skills: ['Vue', 'CSS'] },
  ];

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= cards.length + 1) return 0; // reset para el bucle
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b0f1a] shadow-2xl w-full">
      {/* Barra de búsqueda — replica ExploreSearchBar compact */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <div className="relative mb-3">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6278] pointer-events-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className="w-full pl-9 pr-4 py-2.5 bg-[#111420] border border-[#7c6bec]/40 rounded-xl text-[11px] text-[#5a6278] flex items-center shadow-[0_0_12px_rgba(124,107,236,0.1)]">
            <span className="text-[#7c6bec]">React</span>
            <span className="ml-1 text-[#5a6278]">· Frontend Dev · Bolivia</span>
            {/* Animación de cursor titilando para simular búsqueda activa */}
            <span className="w-[1px] h-[12px] bg-[#7c6bec] ml-1 animate-pulse" />
          </div>
        </div>
        {/* Filtros activos */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { label: 'React', color: '#7c6bec' },
            { label: 'Bolivia', color: '#7c6bec' },
            { label: 'Frontend', color: '#7c6bec' },
          ].map((f) => (
            <span
              key={f.label}
              className="text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
              style={{ background: `${f.color}22`, border: `1px solid ${f.color}50`, color: f.color }}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <p className="text-white text-[10px] font-bold">Resultados</p>
          {visibleCount < cards.length && (
            <span className="w-3 h-3 rounded-full border-2 border-[#7c6bec] border-t-transparent animate-spin" />
          )}
        </div>
      </div>

      {/* Grid de cards — minimalista */}
      <div className="p-3 grid grid-cols-2 gap-2">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`rounded-xl border border-white/8 bg-[#171B28] overflow-hidden transition-all duration-500 hover:border-[#7c6bec]/40 hover:-translate-y-0.5 cursor-pointer group ${
              i < visibleCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            {/* Preview mini */}
            <div
              className="h-12 relative transition-colors duration-500"
              style={{ background: `${c.templateColor}18` }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-8 h-1 rounded bg-current" style={{ color: c.templateColor }} />
              </div>
              <div
                className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider"
                style={{ background: `${c.templateColor}22`, border: `1px solid ${c.templateColor}55`, color: c.templateColor }}
              >
                {c.template}
              </div>
            </div>
            {/* Info */}
            <div className="p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: `${c.templateColor}25`, border: `1.5px solid ${c.templateColor}55`, color: c.templateColor }}
                >
                  {c.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-[#e5e7eb] text-[10px] font-semibold truncate">{c.name}</p>
                  <p className="text-[#6b7280] text-[9px] truncate">{c.role}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {c.skills.map((s) => (
                  <span key={s} className="text-[8px] px-1.5 py-0.5 rounded bg-[#7c6bec]/15 text-[#C9BEFF]">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Mockup 4: Estadísticas con animación en tiempo real ───────────────────────
const StatsMockup = () => {
  const baseValues = { visitas: 1482, proyectos: 438, contactos: 31 };
  const [values, setValues] = useState(baseValues);
  const [bars, setBars] = useState([25, 48, 35, 70, 52, 88, 62, 75, 58, 92, 68, 80, 44, 65]);
  const [trend, setTrend] = useState(28);
  const [pulse, setPulse] = useState(false);
  const tickRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      // Fluctúa los números ligeramente
      setValues({
        visitas: baseValues.visitas + Math.floor(Math.sin(tick * 0.4) * 18) + Math.floor(Math.random() * 6),
        proyectos: baseValues.proyectos + Math.floor(Math.sin(tick * 0.3 + 1) * 9) + Math.floor(Math.random() * 4),
        contactos: baseValues.contactos + (Math.random() > 0.88 ? 1 : 0),
      });

      // Actualiza la última barra con nuevo valor "en vivo"
      setBars(prev => {
        const next = [...prev];
        // Desplaza hacia la izquierda y agrega nueva barra
        if (tick % 4 === 0) {
          next.shift();
          next.push(Math.floor(30 + Math.random() * 65));
        } else {
          // Fluctúa la última barra
          next[next.length - 1] = Math.max(20, Math.min(98, next[next.length - 1] + (Math.random() > 0.5 ? 3 : -3)));
        }
        return next;
      });

      setTrend(Math.floor(26 + Math.sin(tick * 0.25) * 5));
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0f111a] shadow-2xl w-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.015]">
        <div className="flex items-center gap-2 text-[#C9BEFF]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Estadísticas del portafolio</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Indicador "en vivo" */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"/>
          <span className="text-[9px] text-emerald-400 font-semibold">En vivo</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Métricas animadas */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Visitas', value: values.visitas, color: '#C9BEFF', bg: 'bg-[#7c6bec]/10', border: 'border-[#7c6bec]/20' },
            { label: 'Proyectos', value: values.proyectos, color: '#2dd4bf', bg: 'bg-[#2dd4bf]/10', border: 'border-[#2dd4bf]/20' },
            { label: 'Contactos', value: values.contactos, color: '#34d399', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
          ].map((m) => (
            <div key={m.label} className={`${m.bg} border ${m.border} rounded-xl p-2.5 text-center transition-all duration-300 ${pulse ? 'scale-[1.02]' : 'scale-100'}`}>
              <p
                className="text-lg font-black leading-none tabular-nums transition-all duration-500"
                style={{ color: m.color }}
              >
                {fmt(m.value)}
              </p>
              <p className="text-[#5a6278] text-[9px] font-medium mt-1 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Gráfico de barras animado */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#5a6278]">Visitas por día</p>
            <span className="text-[8px] text-[#5a6278]">últimas 2 semanas</span>
          </div>
          <div className="flex items-end gap-[3px] h-16">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[3px] transition-all duration-700 ease-out"
                style={{
                  height: `${h}%`,
                  background: i === bars.length - 1
                    ? 'linear-gradient(to top, #34d399, #6ee7b7)'
                    : 'linear-gradient(to top, #7c6bec, #C9BEFF)',
                  opacity: i === bars.length - 1 ? 1 : (0.45 + (i / bars.length) * 0.55),
                  boxShadow: i === bars.length - 1 ? '0 0 8px rgba(52,211,153,0.5)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Proyectos más vistos */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#5a6278] mb-2">Proyectos más vistos</p>
          {[
            { nombre: 'Microservicios FastAPI', max: 280, current: 214 },
            { nombre: 'Dashboard Analytics', max: 280, current: 138 },
          ].map((p, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#9ca3af] text-[10px] truncate flex-1">{p.nombre}</span>
                <span className="text-[#C9BEFF] text-[10px] font-bold ml-2 tabular-nums">{p.current}</span>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(p.current / p.max) * 100}%`,
                    background: i === 0 ? 'linear-gradient(to right, #7c6bec, #C9BEFF)' : 'linear-gradient(to right, #5a6bcc, #8e80f5)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tendencia */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 px-3 py-2 transition-all duration-500">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span className="text-emerald-400 text-[10px] font-semibold tabular-nums">+{trend}% vs mes anterior</span>
        </div>
      </div>
    </div>
  );
};

// ── Datos de features ─────────────────────────────────────────────────────────

const features = [
  {
    badge: 'Portafolio con plantilla',
    badgeIcon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: 'Tu perfil completo, en una sola URL',
    subtitle: 'Proyectos, habilidades, experiencia y formación — organizados con una plantilla profesional',
    description:
      'Elige una plantilla y completa tu portafolio con toda la información que importa: habilidades técnicas por nivel, habilidades blandas, tu trayectoria laboral, formación académica y proyectos con tecnologías y demos.',
    bullets: [
      { text: 'Habilidades técnicas con nivel (Básico, Intermedio, Avanzado, Experto)' },
      { text: 'Habilidades blandas reconocidas por la industria' },
      { text: 'Experiencia laboral con fechas, empresa y cargo' },
      { text: 'Formación académica con institución y grado obtenido' },
      { text: 'Proyectos con descripción, tecnologías y enlace al repositorio' },
    ],
    mockup: <PortfolioTemplateMockup />,
    accentColor: '#C9BEFF',
    accentBg: 'bg-[#7c6bec]/10',
    accentBorder: 'border-[#7c6bec]/20',
  },
  {
    badge: 'Control de privacidad',
    badgeIcon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: 'Tú decides qué comparten y qué no',
    subtitle: 'Visibilidad granular por sección, sin borrar tu información',
    description:
      'Puedes publicar tu portafolio y decidir sección por sección qué es público y qué permanece privado. ¿Prefieres no mostrar tu experiencia laboral en una postulación específica? Ocúltala con un clic — sin perder los datos.',
    bullets: [
      { text: 'Portafolio completo público o privado con un solo botón' },
      { text: 'Visibilidad individual por sección: habilidades, experiencia, proyectos' },
      { text: 'La información oculta se conserva, solo deja de ser visible' },
      { text: 'Comparte tu URL pública con confianza, controlando tu narrativa' },
    ],
    mockup: <PrivacyMockup />,
    accentColor: '#f9a8d4',
    accentBg: 'bg-pink-500/10',
    accentBorder: 'border-pink-500/20',
    accentHex: '#f9a8d4',
  },
  {
    badge: 'Búsqueda y exploración',
    badgeIcon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: 'Descubre portafolios por lo que realmente importa',
    subtitle: 'Filtra por habilidades técnicas, blandas, grado académico y país',
    description:
      'Portly te permite explorar el directorio de portafolios públicos con filtros avanzados. Reclutadores pueden buscar por tecnología específica, grado académico o habilidades blandas. Desarrolladores pueden descubrir colegas y encontrar inspiración.',
    bullets: [
      { text: 'Búsqueda por nombre, profesión o descripción' },
      { text: 'Filtro por habilidad técnica: React, Python, Docker, AWS y más' },
      { text: 'Filtro por habilidad blanda: Liderazgo, Trabajo en Equipo, etc.' },
      { text: 'Filtro por grado académico y país de origen' },
      { text: 'Vista previa en vivo del portafolio antes de abrirlo' },
    ],
    mockup: <ExploreMockup />,
    accentColor: '#2dd4bf',
    accentBg: 'bg-[#2dd4bf]/10',
    accentBorder: 'border-[#2dd4bf]/20',
  },
  {
    badge: 'Estadísticas de visibilidad',
    badgeIcon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Visualiza cuántos ven tu portafolio',
    subtitle: 'Métricas reales para tomar decisiones informadas sobre tu carrera',
    description:
      'Deja de publicar en el vacío. Portly registra las visitas a tu portafolio y te muestra cuántas personas lo vieron, qué proyectos generaron más interés y cómo evoluciona tu visibilidad semana a semana.',
    bullets: [
      { text: 'Total de visitas por período: diario, semanal y mensual' },
      { text: 'Proyectos más vistos dentro del portafolio' },
      { text: 'Tendencia de crecimiento vs período anterior' },
      { text: 'Conteo de contactos generados desde el perfil' },
    ],
    mockup: <StatsMockup />,
    accentColor: '#34d399',
    accentBg: 'bg-emerald-400/10',
    accentBorder: 'border-emerald-400/20',
  },
];

// ── Componente Principal ──────────────────────────────────────────────────────

export const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-60 w-[500px] h-[500px] rounded-full bg-[#7c6bec]/4 blur-3xl animate-blob-pulse" />
        <div className="absolute bottom-1/4 -right-60 w-[500px] h-[500px] rounded-full bg-[#2dd4bf]/3 blur-3xl animate-blob-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header — sin chip */}
        <div className="reveal text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Todo lo que necesitas{' '}
            <span className="text-shimmer">en una plataforma</span>
          </h2>
          <p className="mt-4 text-[#9ca3af] text-lg max-w-xl mx-auto">
            Cada funcionalidad fue diseñada pensando en los desarrolladores que buscan
            destacar ante reclutadores, clientes o equipos de admisión.
          </p>
        </div>

        {/* Tab nav */}
        <div className="reveal flex overflow-x-auto gap-2 mb-12 pb-1 scrollbar-thin">
          {features.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide border transition-all duration-200 shrink-0 ${
                activeTab === i
                  ? 'bg-[#7c6bec]/15 border-[#7c6bec]/35 text-[#C9BEFF]'
                  : 'bg-transparent border-white/8 text-[#5a6278] hover:border-white/15 hover:text-[#9ca3af]'
              }`}
            >
              <span className={activeTab === i ? 'text-[#C9BEFF]' : 'text-[#5a6278]'}>{f.badgeIcon}</span>
              {f.badge}
            </button>
          ))}
        </div>

        {/* Feature detail */}
        {features.map((feature, i) =>
          i !== activeTab ? null : (
            <div key={i} className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Texto */}
              <div className="animate-slide-up opacity-0">
                <div className={`inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border ${feature.accentBorder} ${feature.accentBg}`}>
                  <span style={{ color: feature.accentHex || feature.accentColor }}>{feature.badgeIcon}</span>
                  <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: feature.accentHex || feature.accentColor }}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm font-semibold mb-4" style={{ color: feature.accentHex || feature.accentColor }}>
                  {feature.subtitle}
                </p>
                <p className="text-[#9ca3af] text-sm leading-relaxed mb-7">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className={`mt-1 w-5 h-5 rounded-full ${feature.accentBg} flex items-center justify-center shrink-0`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          style={{ color: feature.accentHex || feature.accentColor }}
                          strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-[#9ca3af] text-sm leading-relaxed">{b.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mockup */}
              <div className="animate-scale-in opacity-0">
                <div className="relative">
                  <div className={`absolute -inset-6 rounded-3xl ${feature.accentBg} blur-3xl opacity-50`} />
                  <div className="relative">{feature.mockup}</div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};
