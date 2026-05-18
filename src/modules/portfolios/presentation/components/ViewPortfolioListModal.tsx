import { useState, useMemo, useEffect } from 'react';
import type { Portfolio } from '../../domain/entities/Portfolio';
import type { PortfolioPublicData } from '../../domain/entities/PortfolioPublicData';
import { httpClient } from '../../../../infrastructure/http/httpClient';

interface ViewPortfolioListModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const LEVEL_COLOR: Record<string, string> = {
  Básico: 'bg-slate-500/20 text-slate-300',
  Intermedio: 'bg-blue-500/20 text-blue-300',
  Avanzado: 'bg-violet-500/20 text-violet-300',
  Maestro: 'bg-amber-500/20 text-amber-300',
  Experto: 'bg-emerald-500/20 text-emerald-300',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[#7c6bec]">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">
        {label}
      </span>
    </div>
  );
}

function EmptyTag({ label }: { label: string }) {
  return <p className="text-[#5a6278] text-xs italic">{label}</p>;
}

function DetailPanel({ portfolioId }: { portfolioId: string }) {
  const [data, setData] = useState<PortfolioPublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    httpClient
      .getAuth<PortfolioPublicData>(`/api/portafolios/${portfolioId}/publica`, '')
      .then(setData)
      .catch((e) => setError(e?.message || 'Error al cargar datos'))
      .finally(() => setLoading(false));
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-[#9ca3af] text-sm">{error ?? 'No se encontraron datos.'}</p>
      </div>
    );
  }

  const { usuario, skills, softSkills, experiencias, proyectos, formaciones } = data;

  return (
    <div className="overflow-y-auto flex flex-col gap-5 px-6 py-5 scrollbar-thin scrollbar-thumb-[#2c2f48] flex-1">

      {/* ── Perfil del usuario ────────────── */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        {usuario.avatarUrl ? (
          <img src={usuario.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#7c6bec]/20 border border-white/5 flex items-center justify-center shrink-0">
            <span className="text-[#C9BEFF] font-bold text-sm">
              {usuario.nombre?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">
            {usuario.nombre} {usuario.apellido}
          </p>
          {usuario.profesion && (
            <p className="text-[#9ca3af] text-xs truncate">{usuario.profesion}</p>
          )}
        </div>
      </div>

      {/* ── Habilidades Técnicas ────────────── */}
      <div>
        <SectionTitle
          label="Habilidades Técnicas"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
          }
        />
        {skills.length === 0 ? (
          <EmptyTag label="Sin habilidades técnicas" />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLOR[s.level] ?? 'bg-white/10 text-white'}`}
              >
                {s.name}
                <span className="opacity-60 ml-1">· {s.level}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Habilidades Blandas ────────────── */}
      <div>
        <SectionTitle
          label="Habilidades Blandas"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
        />
        {softSkills.length === 0 ? (
          <EmptyTag label="Sin habilidades blandas" />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {softSkills.map((s) => (
              <span key={s.id} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300">
                {s.nombreHabilidad}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Experiencia ────────────── */}
      <div>
        <SectionTitle
          label="Experiencia"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
        {experiencias.length === 0 ? (
          <EmptyTag label="Sin experiencias registradas" />
        ) : (
          <div className="flex flex-col gap-2.5">
            {experiencias.map((exp, i) => (
              <div key={exp.id ?? i} className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3">
                <p className="text-white text-xs font-bold">{exp.cargo}</p>
                <p className="text-[#9ca3af] text-[11px]">{exp.nombreEmpresa}</p>
                <p className="text-[#5a6278] text-[10px] mt-1">
                  {formatDate(exp.fechaInicio)} — {exp.actualmenteTrabajando ? 'Actualidad' : formatDate(exp.fechaFin)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Proyectos ────────────── */}
      <div>
        <SectionTitle
          label="Proyectos"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
            </svg>
          }
        />
        {proyectos.length === 0 ? (
          <EmptyTag label="Sin proyectos registrados" />
        ) : (
          <div className="flex flex-col gap-2.5">
            {proyectos.map((p, i) => (
              <div key={p.id ?? i} className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3">
                <div className="flex items-start gap-2">
                  {p.iconoUrl ? (
                    <img src={p.iconoUrl} alt="" className="w-6 h-6 rounded object-cover shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-[#7c6bec]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8e80f5" strokeWidth="2">
                        <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold truncate">{p.nombre}</p>
                    <p className="text-[#9ca3af] text-[11px] mt-0.5 line-clamp-2">{p.descripcionCorta}</p>
                    {p.tecnologias.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.tecnologias.slice(0, 4).map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[#7c6bec]/15 text-[#C9BEFF]">{t}</span>
                        ))}
                        {p.tecnologias.length > 4 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#5a6278]">+{p.tecnologias.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Formación Académica ────────────── */}
      <div>
        <SectionTitle
          label="Formación Académica"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          }
        />
        {formaciones.length === 0 ? (
          <EmptyTag label="Sin formación registrada" />
        ) : (
          <div className="flex flex-col gap-2.5">
            {formaciones.map((f, i) => (
              <div key={f.idFormacionAcademica ?? i} className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3">
                <p className="text-white text-xs font-bold">{f.carrera}</p>
                <p className="text-[#9ca3af] text-[11px]">{f.institucion}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#7c6bec]/15 text-[#C9BEFF]">{f.nivel}</span>
                  <span className="text-[#5a6278] text-[10px]">
                    {formatDate(f.fechaInicio)} — {f.actualmenteEstudiando ? 'En curso' : formatDate(f.fechaFinalizacion)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer bottom */}
      <div className="h-2" />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ViewPortfolioListModal({
  isOpen,
  onClose,
  portfolios,
}: ViewPortfolioListModalProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Reset selected when modal closes
  useEffect(() => {
    if (!isOpen) setSelectedPortfolioId(null);
  }, [isOpen]);

  const sorted = useMemo(() => {
    return [...portfolios].sort((a, b) => {
      const diff = a.id.localeCompare(b.id);
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [portfolios, sortOrder]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const paginatedPortfolios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage]);

  if (!isOpen) return null;

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      {/* Contenedor principal — se expande si hay detalle abierto */}
      <div
        className={`bg-[#0f111a] flex flex-col md:flex-row rounded-[24px] border border-white/10 shadow-2xl w-full transition-all duration-300 ease-in-out ${
          selectedPortfolioId ? 'max-w-4xl' : 'max-w-lg'
        } max-h-[88vh]`}
      >
        {/* ──────────── Panel izquierdo: lista ──────────── */}
        <div className={`flex flex-col overflow-hidden transition-all duration-300 ${selectedPortfolioId ? 'w-full md:w-80 shrink-0' : 'w-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/5 flex-shrink-0">
            <div>
              <h2 className="text-white text-xl font-bold">Listado de Portafolios</h2>
              <p className="text-[#9ca3af] text-xs mt-0.5">
                {portfolios.length} portafolio{portfolios.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sort */}
              <button
                onClick={() => {
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all text-xs font-medium"
                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {sortOrder === 'asc' ? (
                    <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                  ) : (
                    <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>
                  )}
                </svg>
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </button>

              {/* Close */}
              <button
                onClick={() => { setSelectedPortfolioId(null); onClose(); }}
                className="p-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all"
                aria-label="Cerrar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="overflow-y-auto px-6 py-5 space-y-2.5 scrollbar-thin scrollbar-thumb-[#2c2f48] flex-1">
            {paginatedPortfolios.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-[#9ca3af] text-sm">No hay portafolios disponibles.</p>
              </div>
            ) : (
              paginatedPortfolios.map((p) => {
                const isSelected = selectedPortfolioId === p.id;
                return (
                  <div
                    key={p.id}
                    className={`group rounded-2xl border overflow-hidden flex items-center gap-3 px-4 py-3.5 transition-all ${
                      isSelected
                        ? 'bg-[#7c6bec]/12 border-[#7c6bec]/40'
                        : 'bg-[#171B28] border-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* Ícono */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[#7c6bec]/30 text-[#C9BEFF]' : 'bg-[#7c6bec]/15 text-[#8e80f5]'}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{p.nombre}</p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5 inline-block ${
                          p.visibilidad === 'PUBLICO'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {p.visibilidad === 'PUBLICO' ? 'Público' : 'Privado'}
                      </span>
                    </div>

                    {/* Botón ojo */}
                    <button
                      onClick={() => setSelectedPortfolioId((prev) => (prev === p.id ? null : p.id))}
                      title={isSelected ? 'Cerrar detalle' : 'Ver información'}
                      className={`p-2 rounded-xl border transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#7c6bec]/20 border-[#7c6bec]/40 text-[#C9BEFF]'
                          : 'border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {isSelected ? (
                        /* ojo cerrado */
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        /* ojo abierto */
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 flex-shrink-0 rounded-bl-[24px]">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="text-[#9ca3af] text-xs font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* ──────────── Panel derecho: detalle completo ──────────── */}
        {selectedPortfolioId && (
          <div className="flex flex-col flex-1 border-t md:border-t-0 md:border-l border-white/5 overflow-hidden rounded-b-[24px] md:rounded-b-none md:rounded-r-[24px] min-w-0 animate-fade-in">
            {/* Header detalle */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2 text-[#C9BEFF]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {selectedPortfolio?.nombre}
                </span>
              </div>
              <button
                onClick={() => setSelectedPortfolioId(null)}
                className="p-1.5 rounded-lg border border-white/5 text-[#9ca3af] hover:text-white hover:border-white/15 transition-all"
                aria-label="Cerrar detalle"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Contenido del detalle */}
            <DetailPanel portfolioId={selectedPortfolioId} />
          </div>
        )}
      </div>
    </div>
  );
}
