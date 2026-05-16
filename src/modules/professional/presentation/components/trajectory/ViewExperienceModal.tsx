import { useState, useMemo } from 'react';
import { Experience } from '../../../domain/entities/Experience';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experiences: Experience[];
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
};

export default function ViewExperienceModal({
  isOpen,
  onClose,
  experiences,
}: Props) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const sorted = useMemo(() => {
    return [...experiences].sort((a, b) => {
      const dateA = a.fechaInicio ?? '';
      const dateB = b.fechaInicio ?? '';
      const diff = dateA.localeCompare(dateB);
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [experiences, sortOrder]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-lg max-h-[85vh] flex flex-col rounded-[24px] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">Experiencias</h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">
              {experiences.length} experiencia
              {experiences.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all text-xs font-medium"
              title={
                sortOrder === 'asc'
                  ? 'Orden ascendente por fecha'
                  : 'Orden descendente por fecha'
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all"
              aria-label="Cerrar"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista con scroll solo cuando excede */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-5 space-y-3 scrollbar-thin scrollbar-thumb-[#2c2f48]">
          {sorted.map((exp) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="bg-[#171B28] rounded-2xl border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : (exp.id ?? null))
                  }
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#2c2f48] flex items-center justify-center text-[#6c63ff] shrink-0">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 7l-8 4-8-4V6l8 4 8-4v1z" />
                      <path d="M4 12l8 4 8-4" />
                      <path d="M4 18l8 4 8-4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">
                      {exp.cargo}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-[#9ca3af] text-xs">
                        {exp.nombreEmpresa}
                      </p>
                      {(exp.fechaInicio ||
                        exp.fechaFin ||
                        exp.actualmenteTrabajando) && (
                        <p className="text-[#9ca3af] text-xs">
                          {exp.fechaInicio ? formatDate(exp.fechaInicio) : ''}
                          {exp.fechaInicio &&
                          (exp.fechaFin || exp.actualmenteTrabajando)
                            ? ' — '
                            : ''}
                          {exp.actualmenteTrabajando ? (
                            <span className="inline-block bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                              Actual
                            </span>
                          ) : exp.fechaFin ? (
                            formatDate(exp.fechaFin)
                          ) : null}
                        </p>
                      )}
                    </div>
                  </div>
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

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                    {exp.descripcion && (
                      <p className="text-[#9ca3af] text-xs leading-relaxed">
                        {exp.descripcion}
                      </p>
                    )}
                    {exp.funcionesPrincipales &&
                      exp.funcionesPrincipales.length > 0 && (
                        <div>
                          <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                            Funciones principales
                          </p>
                          <ul className="list-disc list-inside text-[#9ca3af] text-xs space-y-1">
                            {exp.funcionesPrincipales.map((fn, i) => (
                              <li key={i}>{fn}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {exp.logros && exp.logros.length > 0 && (
                      <div>
                        <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                          Logros
                        </p>
                        <ul className="list-disc list-inside text-[#9ca3af] text-xs space-y-1">
                          {exp.logros.map((logro, i) => (
                            <li key={i}>{logro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.funcionesPrincipales &&
                      exp.funcionesPrincipales.length > 0 && (
                        <div>
                          <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                            Funciones principales
                          </p>
                          <ul className="list-disc list-inside text-[#9ca3af] text-xs space-y-1">
                            {exp.funcionesPrincipales.map((fn, i) => (
                              <li key={i}>{fn}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {exp.logros && exp.logros.length > 0 && (
                      <div>
                        <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                          Logros
                        </p>
                        <ul className="list-disc list-inside text-[#9ca3af] text-xs space-y-1">
                          {exp.logros.map((logro, i) => (
                            <li key={i}>{logro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Solo muestra referencia profesional si existe al menos un dato */}
                    {exp.referenciaProfesional &&
                      (exp.referenciaProfesional.correoJefe ||
                        exp.referenciaProfesional.numeroJefe ||
                        exp.referenciaProfesional.cargoJefe) && (
                        <div className="text-[#9ca3af] text-xs">
                          <p className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                            Referencia profesional
                          </p>
                          {exp.referenciaProfesional.correoJefe && (
                            <p>Email: {exp.referenciaProfesional.correoJefe}</p>
                          )}
                          {exp.referenciaProfesional.numeroJefe && (
                            <p>
                              Teléfono: {exp.referenciaProfesional.numeroJefe}
                            </p>
                          )}
                          {exp.referenciaProfesional.cargoJefe && (
                            <p>Cargo: {exp.referenciaProfesional.cargoJefe}</p>
                          )}
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
