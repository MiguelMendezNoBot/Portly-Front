import { useState, useMemo } from 'react';
import { Project } from '../../../domain/entities/Project';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
};

export default function ViewProjectsModal({ isOpen, onClose, projects }: Props) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const sorted = useMemo(() => {
    return [...projects].sort((a, b) => {
      const dateA = a.fechaInicio ?? '';
      const dateB = b.fechaInicio ?? '';
      const diff = dateA.localeCompare(dateB);
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [projects, sortOrder]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-lg max-h-[85vh] flex flex-col rounded-[24px] border border-white/10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">Proyectos</h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">
              {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Botón de orden */}
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all text-xs font-medium"
              title={sortOrder === 'asc' ? 'Orden ascendente por fecha' : 'Orden descendente por fecha'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {sortOrder === 'asc' ? (
                  <>
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </>
                ) : (
                  <>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </>
                )}
              </svg>
              {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="overflow-y-auto px-8 py-5 space-y-3 scrollbar-thin scrollbar-thumb-[#2c2f48]">
          {sorted.map((project) => {
            const isExpanded = expandedId === project.id;
            return (
              <div
                key={project.id}
                className="bg-[#171B28] rounded-2xl border border-white/5 overflow-hidden"
              >
                {/* Card header — siempre visible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : (project.id ?? null))}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  {/* Icono del proyecto */}
                  {project.iconoUrl ? (
                    <img
                      src={project.iconoUrl}
                      alt={project.nombre}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-[#2c2f48] flex items-center justify-center text-[#6c63ff] shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{project.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {/* Fechas */}
                      {(project.fechaInicio || project.esActual) && (
                        <p className="text-[#9ca3af] text-xs">
                          {project.fechaInicio ? formatDate(project.fechaInicio) : ''}
                          {project.fechaInicio && (project.fechaFin || project.esActual) ? ' — ' : ''}
                          {project.esActual ? (
                            <span className="inline-block bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                              Actual
                            </span>
                          ) : project.fechaFin ? formatDate(project.fechaFin) : null}
                        </p>
                      )}

                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-[#6b7280] shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Detalle expandible */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                    {/* Descripción */}
                    {(project.descripcionCorta || project.descripcionDetallada) && (
                      <p className="text-[#9ca3af] text-xs leading-relaxed">
                        {project.descripcionCorta || project.descripcionDetallada}
                      </p>
                    )}

                    {/* Tecnologías */}
                    {project.tecnologias && project.tecnologias.length > 0 && (
                      <div>
                        <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                          Herramientas
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tecnologias.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-[#6c63ff]/15 text-[#a3a6ff] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide"
                            >
                              #{tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evidencias (imágenes) */}
                    {project.evidencias && project.evidencias.length > 0 && (
                      <div>
                        <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                          Evidencias ({project.evidencias.length})
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {project.evidencias.slice(0, 3).map((ev, i) => (
                            <img
                              key={i}
                              src={ev.url}
                              alt={ev.nombre}
                              className="w-16 h-16 object-cover rounded-lg border border-white/10"
                            />
                          ))}
                          {project.evidencias.length > 3 && (
                            <div className="w-16 h-16 rounded-lg bg-[#2c2f48] flex items-center justify-center text-[#9ca3af] text-xs font-bold">
                              +{project.evidencias.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Enlace(s) */}
                    {project.enlaces && project.enlaces.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.enlaces.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#a3a6ff] text-xs font-medium hover:underline"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            {link.titulo}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
