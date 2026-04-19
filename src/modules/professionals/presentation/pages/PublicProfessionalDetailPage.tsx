import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../../../../infrastructure/http/httpClient';

interface SkillDto       { nombre: string; nivel: string; }
interface ExperienciaDto { empresa: string; cargo: string; fechaInicio?: string; fechaFin?: string; descripcion?: string; esEmpleoActual?: boolean; }
interface FormacionDto   { institucion: string; carrera: string; nivel?: string; fechaInicio?: string; fechaFinalizacion?: string; actualmenteEstudiando?: boolean; }

interface PublicProfessional {
  idUsuario: string;
  nombre: string;
  apellido: string;
  email?: string;
  titularProfesional?: string;
  acercaDeMi?: string;
  enlaceFoto?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  habilidadesTecnicas?: SkillDto[];
  habilidadesBlandas?: string[];
  trayectoria?: ExperienciaDto[];
  formacion?: FormacionDto[];
}

const LEVEL_COLOR: Record<string, string> = {
  Maestro:    'text-purple-400',
  Experto:    'text-blue-400',
  Avanzado:   'text-teal-400',
  Intermedio: 'text-yellow-400',
  Básico:     'text-slate-400',
};

function fmt(d?: string | null) {
  if (!d) return '';
  const [y, m] = d.split('-');
  return `${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][+m-1]} ${y}`;
}

function PersonIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function SocialBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-[#171B28] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all">
      {children}
    </a>
  );
}

export default function PublicProfessionalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [p, setP] = useState<PublicProfessional | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    httpClient.get<PublicProfessional>(`/api/public/profesionales/${id}`)
      .then(setP)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0b0f24] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
    </div>
  );

  if (notFound || !p) return (
    <div className="min-h-screen bg-[#0b0f24] flex flex-col items-center justify-center gap-4">
      <p className="text-slate-400">Profesional no encontrado.</p>
      <button onClick={() => navigate('/profesionales')} className="text-src-9fa2ff text-sm hover:underline">← Volver</button>
    </div>
  );

  const avatar = p.enlaceFoto
    ? <img src={p.enlaceFoto} alt={p.nombre} className="w-full h-full object-cover" />
    : <PersonIcon />;

  const hasSocials = p.youtube || p.facebook || p.instagram;
  const hasTrayectoria = p.trayectoria && p.trayectoria.length > 0;
  const hasTecnicas = p.habilidadesTecnicas && p.habilidadesTecnicas.length > 0;
  const hasBlandas = p.habilidadesBlandas && p.habilidadesBlandas.length > 0;
  const hasFormacion = p.formacion && p.formacion.length > 0;
  const hasRightCol = hasTecnicas || hasBlandas || hasFormacion;

  return (
    <div className="min-h-screen bg-[#0d1120] text-white pb-16">
      {/* Back */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <button type="button" onClick={() => navigate('/profesionales')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a profesionales
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 flex flex-col gap-7">

        {/* ── Profile header ── */}
        <div className="flex items-start gap-5">
          <div className="w-[72px] h-[72px] rounded-full bg-[#1a1f3a] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            {avatar}
          </div>

          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-extrabold leading-tight">
                  {p.nombre} {p.apellido}
                </h1>
                {p.email && <p className="text-src-9fa2ff text-sm mt-0.5">{p.email}</p>}
                {p.titularProfesional && <p className="text-src-9fa2ff text-sm mt-0.5">{p.titularProfesional}</p>}
              </div>

              {hasSocials && (
                <div className="flex items-center gap-2 shrink-0">
                  {p.youtube && (
                    <SocialBtn href={p.youtube}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5v-7l6.25 3.5-6.25 3.5z"/></svg>
                    </SocialBtn>
                  )}
                  {p.facebook && (
                    <SocialBtn href={p.facebook}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
                    </SocialBtn>
                  )}
                  {p.instagram && (
                    <SocialBtn href={p.instagram}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </SocialBtn>
                  )}
                </div>
              )}
            </div>

            {p.acercaDeMi && (
              <p className="text-slate-400 text-sm leading-relaxed mt-3 break-words">{p.acercaDeMi}</p>
            )}
          </div>
        </div>

        {/* ── Two-column grid (mirrors preview modal) ── */}
        {(hasTrayectoria || hasRightCol) && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">

            {/* Left — Trayectoria */}
            {hasTrayectoria && (
              <div className="bg-[#141829] rounded-[16px] p-5">
                <h2 className="text-white font-extrabold text-lg mb-4">Trayectoria Profesional</h2>
                <div className="flex flex-col gap-5">
                  {p.trayectoria!.map((exp, i) => (
                    <div key={i}>
                      <p className="text-white font-bold text-sm">{exp.cargo}</p>
                      <p className="text-src-9fa2ff text-xs mt-0.5">
                        {exp.empresa}
                        {exp.fechaInicio && ` • ${fmt(exp.fechaInicio)} - ${exp.esEmpleoActual ? 'Presente' : fmt(exp.fechaFin)}`}
                      </p>
                      {exp.descripcion && (
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">{exp.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right — Skills + Education */}
            {hasRightCol && (
              <div className="flex flex-col gap-5">

                {hasTecnicas && (
                  <div>
                    <h2 className="text-white font-bold text-sm mb-3">Habilidades técnicas</h2>
                    <div className="flex flex-col gap-2">
                      {p.habilidadesTecnicas!.map((sk, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-src-e5e7f6 text-sm">{sk.nombre}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${LEVEL_COLOR[sk.nivel] ?? 'text-slate-400'}`}>
                            {sk.nivel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasBlandas && (
                  <div>
                    <h2 className="text-white font-bold text-sm mb-3">Habilidades blandas</h2>
                    <div className="flex flex-wrap gap-2">
                      {p.habilidadesBlandas!.map((sk, i) => (
                        <span key={i} className="bg-[#171B28] border border-white/10 text-src-e5e7f6 text-xs px-3 py-1 rounded-full">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasFormacion && (
                  <div>
                    <h2 className="text-white font-bold text-sm mb-3">Formación académica</h2>
                    <div className="flex flex-col gap-2">
                      {p.formacion!.map((edu, i) => (
                        <div key={i} className="bg-[#171B28] border border-white/5 rounded-[10px] px-4 py-3">
                          <p className="text-white text-xs font-semibold">{edu.carrera}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {edu.institucion}
                            {edu.fechaInicio && ` • ${fmt(edu.fechaInicio)}`}
                            {edu.actualmenteEstudiando ? '' : edu.fechaFinalizacion ? ` - ${fmt(edu.fechaFinalizacion)}` : ''}
                          </p>
                          {edu.nivel && <p className="text-slate-500 text-[10px] mt-0.5">{edu.nivel}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
