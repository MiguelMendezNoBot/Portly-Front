import { useState, useMemo } from 'react';
import { SOFT_SKILLS_CATALOG } from './SoftSkillsModal';

interface Skill {
  id: number;
  nombreHabilidad: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
}

export default function ViewSoftSkillsModal({ isOpen, onClose, skills }: Props) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    return [...skills].sort((a, b) => {
      const diff = a.nombreHabilidad.localeCompare(b.nombreHabilidad);
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [skills, sortOrder]);

  const getIcon = (skillName: string) => {
    const found = SOFT_SKILLS_CATALOG.find((s) => s.name === skillName);
    return found?.icon ?? null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[24px] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f111a] px-8 pt-8 pb-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-bold">Habilidades Blandas</h2>
              <p className="text-[#9ca3af] text-xs mt-0.5">
                {skills.length} habilidad{skills.length !== 1 ? 'es' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all text-xs font-medium"
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
        </div>

        <div style={{ maxHeight: '400px' }} className="overflow-y-auto custom-scrollbar">
          <div className="px-8 py-5 flex flex-col gap-3">
            {sorted.length === 0 ? (
              <div className="text-center py-6 text-[#6b7280] text-sm">
                No tienes habilidades blandas añadidas.
              </div>
            ) : (
              sorted.map((skill) => {
                const icon = getIcon(skill.nombreHabilidad);
                return (
                  <div
                    key={skill.id}
                    className="bg-[#171B28] rounded-2xl border border-white/5 p-4 flex items-center gap-3 transition-colors hover:bg-[#1f2233]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#2c2f48] flex items-center justify-center border border-white/5 shrink-0 [&>svg]:w-5 [&>svg]:h-5 text-[#6b72ff]">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">
                        {skill.nombreHabilidad}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
