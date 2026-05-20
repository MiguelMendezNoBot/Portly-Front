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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                          {project.evidencias.map((ev, i) => (
                            <img
                              key={i}
                              src={ev.url}
                              alt={ev.nombre}
                              className="w-16 h-16 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 hover:border-[#6c63ff]/40 transition-all"
                              onClick={() => setSelectedImage(ev.url)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documentos */}
                    {project.documentos && project.documentos.length > 0 && (
                      <div>
                        <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                          Documentos ({project.documentos.length})
                        </p>
                        <div className="space-y-1.5">
                          {project.documentos.map((doc, i) => {
                            const ext = doc.tipo?.toLowerCase() || doc.nombre?.split('.').pop()?.toLowerCase() || '';
                            const isPdf = ext === 'pdf';
                            const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

                            return (
                              <a
                                key={i}
                                href={`${baseUrl}${doc.urlDescarga}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 bg-[#0f111a] border border-white/5 rounded-xl p-2.5 hover:border-[#6c63ff]/30 transition-colors group"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isPdf ? 'bg-red-500/15' : 'bg-blue-500/15'
                                }`}>
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={isPdf ? '#ef4444' : '#3b82f6'}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-xs font-medium truncate group-hover:text-[#a3a6ff] transition-colors">
                                    {doc.nombre}
                                  </p>
                                  <p className="text-[#6b7280] text-[10px] mt-0.5">
                                    {ext.toUpperCase()}
                                    {doc.pesoBytes ? ` • ${(doc.pesoBytes / (1024 * 1024)).toFixed(1)} MB` : ''}
                                  </p>
                                </div>
                                <div className="shrink-0 text-[#6b7280] group-hover:text-[#6c63ff] transition-colors">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                                </div>
                              </a>
                            );
                          })}
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

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Detalle"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
