// HeroMockup — replica fiel del diseño de ViewPortfolioListModal / portafolio real de Portly

const LEVEL_COLOR: Record<string, string> = {
  Básico:     'bg-slate-500/20 text-slate-300',
  Intermedio: 'bg-blue-500/20 text-blue-300',
  Avanzado:   'bg-violet-500/20 text-violet-300',
  Experto:    'bg-emerald-500/20 text-emerald-300',
};

export const HeroMockup = () => {
  return (
    <div className="relative w-full max-w-[420px]">
      {/* Glow exterior */}
      <div className="absolute -inset-6 rounded-3xl bg-[#7c6bec]/12 blur-3xl -z-10 animate-blob-pulse" />

      {/* Tarjeta principal: simula el panel de detalle de portafolio */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f111a] shadow-[0_32px_80px_rgba(0,0,0,0.7)]">

        {/* Barra de título del modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-[#C9BEFF]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-widest">Portafolio de Daniela Torres</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '500px' }}>

          {/* Perfil del usuario — exactamente como DetailPanel */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#7c6bec]/20 border border-white/5 flex items-center justify-center shrink-0">
              <span className="text-[#C9BEFF] font-bold text-sm">D</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm">Daniela Torres</p>
              <p className="text-[#9ca3af] text-xs">Desarrolladora Full Stack</p>
            </div>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/15 text-emerald-400">
              Público
            </span>
          </div>

          {/* Habilidades Técnicas */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">Habilidades Técnicas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'React', level: 'Avanzado' },
                { name: 'TypeScript', level: 'Intermedio' },
                { name: 'Node.js', level: 'Avanzado' },
                { name: 'Docker', level: 'Básico' },
                { name: 'PostgreSQL', level: 'Experto' },
              ].map((s) => (
                <span key={s.name} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLOR[s.level]}`}>
                  {s.name}<span className="opacity-60 ml-1">· {s.level}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Habilidades Blandas */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">Habilidades Blandas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Liderazgo', 'Comunicación Asertiva', 'Trabajo en Equipo', 'Adaptabilidad'].map((s) => (
                <span key={s} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300">{s}</span>
              ))}
            </div>
          </div>

          {/* Experiencia */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">Experiencia</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { cargo: 'Frontend Developer', empresa: 'TechNova Labs', periodo: 'Ene 2023 — Actualidad' },
                { cargo: 'Desarrolladora Jr.', empresa: 'Agencia Digital Flux', periodo: 'Mar 2021 — Dic 2022' },
              ].map((exp, i) => (
                <div key={i} className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3">
                  <p className="text-white text-xs font-bold">{exp.cargo}</p>
                  <p className="text-[#9ca3af] text-[11px]">{exp.empresa}</p>
                  <p className="text-[#5a6278] text-[10px] mt-1">{exp.periodo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Proyectos */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">Proyectos</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { nombre: 'Sistema de Inventario', desc: 'App full-stack para gestión de inventario en tiempo real.', techs: ['React', 'Node.js', 'PostgreSQL'] },
                { nombre: 'API REST Segura', desc: 'API con autenticación JWT, roles y documentación Swagger.', techs: ['TypeScript', 'Express', 'Docker'] },
              ].map((p, i) => (
                <div key={i} className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded bg-[#7c6bec]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#8e80f5" strokeWidth="2">
                        <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-bold">{p.nombre}</p>
                      <p className="text-[#9ca3af] text-[11px] mt-0.5 line-clamp-1">{p.desc}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.techs.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[#7c6bec]/15 text-[#C9BEFF]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formación */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">Formación Académica</span>
            </div>
            <div className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3">
              <p className="text-white text-xs font-bold">Ingeniería en Sistemas</p>
              <p className="text-[#9ca3af] text-[11px]">Universidad Mayor de San Simón</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#7c6bec]/15 text-[#C9BEFF]">Licenciatura</span>
                <span className="text-[#5a6278] text-[10px]">Agosto 2023 — En curso</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge flotante: publicado — top right */}
      <div className="animate-float absolute -top-5 -right-5 hidden sm:flex items-center gap-2 bg-[#0f111a]/95 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-2xl">
        <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-white text-[11px] font-bold leading-tight">Portafolio publicado</p>
          <p className="text-[#5a6278] text-[9px]">Visible para reclutadores</p>
        </div>
      </div>

      {/* Badge flotante: visitas — bottom left */}
      <div className="animate-float-alt absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2 bg-[#0f111a]/95 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-2xl">
        <div className="w-7 h-7 rounded-xl bg-[#7c6bec]/20 border border-[#7c6bec]/30 flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9BEFF" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div>
          <p className="text-white text-[11px] font-bold leading-tight">312 visitas este mes</p>
          <p className="text-[#7c6bec] text-[9px] font-semibold">Subio un 34% esta semana</p>
        </div>
      </div>
    </div>
  );
};
