import { useState, useMemo, useEffect } from 'react';

// ─── Catálogo de habilidades blandas con sus iconos SVG ────────────────────

interface SoftSkillDefinition {
  name: string;
  icon: React.ReactNode;
}

const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
    <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
    <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
    <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
    <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
    <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
  </svg>
);

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.501 12.116 0c3.526 2.502 4.124 6.937 1.8 10.374c-2.324 3.437 -7.128 5.107 -11.116 4l-6.2 1.9" />
  </svg>
);

const UsersGroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
    <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M17 10h2a2 2 0 0 1 2 2v1" />
    <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const HandshakeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
  </svg>
);

const LightbulbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
    <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
    <line x1="9.7" y1="17" x2="14.3" y2="17" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
  </svg>
);

const ScaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 20l10 0" />
    <path d="M12 4l0 16" />
    <path d="M3 10l18 0" />
    <path d="M3 10l2 -4" />
    <path d="M21 10l-2 -4" />
    <path d="M3 10l2 4" />
    <path d="M21 10l-2 4" />
  </svg>
);

const PresentationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 4l18 0" />
    <path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" />
    <path d="M12 16l0 4" />
    <path d="M9 20l6 0" />
    <path d="M8 12l3 -3l2 2l3 -3" />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
  </svg>
);

export const SOFT_SKILLS_CATALOG: SoftSkillDefinition[] = [
  { name: 'Pensamiento Crítico', icon: <BrainIcon /> },
  { name: 'Empatía', icon: <HeartIcon /> },
  { name: 'Liderazgo', icon: <UsersIcon /> },
  { name: 'Comunicación Asertiva', icon: <MessageCircleIcon /> },
  { name: 'Trabajo en Equipo', icon: <UsersGroupIcon /> },
  { name: 'Gestión del Tiempo', icon: <ClockIcon /> },
  { name: 'Negociación', icon: <HandshakeIcon /> },
  { name: 'Creatividad', icon: <LightbulbIcon /> },
  { name: 'Adaptabilidad', icon: <RefreshIcon /> },
  { name: 'Resolución de Conflictos', icon: <ScaleIcon /> },
  { name: 'Presentación', icon: <PresentationIcon /> },
  { name: 'Motivación', icon: <StarIcon /> },
];

// ─── Componente Modal ───────────────────────────────────────────────────────

interface SoftSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skill: string) => void;
  /** Habilidades que el usuario ya tiene agregadas (para deshabilitarlas o marcarlas) */
  existingSkills?: string[];
}

export default function SoftSkillsModal({
  isOpen,
  onClose,
  onAdd,
  existingSkills = [],
}: SoftSkillsModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setSearch('');
    }
  }, [isOpen]);

  const filteredSkills = useMemo(
    () =>
      SOFT_SKILLS_CATALOG.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const toggleSkill = (name: string) => {
    if (existingSkills.includes(name)) return;
    setSelected((prev) => (prev === name ? null : name));
  };

  const handleAdd = () => {
    if (selected) {
      onAdd(selected);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-4">
          <h2 className="text-white text-2xl font-bold mb-5">
            Agregar Habilidad
          </h2>

          {/* Buscador */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-4 w-4 h-4 text-[#6b7280] pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
            <input
              type="text"
              placeholder="Buscar habilidades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1d2e] border border-white/10 text-white rounded-2xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b72ff]/40 transition-all placeholder:text-[#6b7280]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 text-[#6b7280] hover:text-white transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Lista scrollable */}
        <div className="overflow-y-auto flex-1 px-6 pb-2 space-y-1 custom-scrollbar">
          {filteredSkills.length === 0 ? (
            <div className="text-center py-10 text-[#6b7280] text-sm">
              No se encontraron habilidades
            </div>
          ) : (
            filteredSkills.map((skill) => {
              const isAlreadyAdded = existingSkills.includes(skill.name);
              const isChecked = selected === skill.name;

              return (
                <button
                  key={skill.name}
                  type="button"
                  onClick={() => toggleSkill(skill.name)}
                  disabled={isAlreadyAdded}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 text-left group ${
                    isAlreadyAdded
                      ? 'opacity-50 cursor-not-allowed bg-white/5'
                      : isChecked
                        ? 'bg-[#6b72ff]/20 border border-[#6b72ff]/40'
                        : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Ícono con color morado */}
                    <span
                      className={`transition-colors duration-200 ${
                        isAlreadyAdded
                          ? 'text-[#6b7280]'
                          : isChecked
                            ? 'text-[#8b5cf6]'
                            : 'text-[#6b72ff]'
                      }`}
                    >
                      {skill.icon}
                    </span>
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isAlreadyAdded
                          ? 'text-[#6b7280]'
                          : isChecked
                            ? 'text-white'
                            : 'text-[#d1d5db]'
                      }`}
                    >
                      {skill.name}
                    </span>
                  </div>

                  {/* Checkbox / Indicador */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-200 ${
                      isAlreadyAdded
                        ? 'border-[#4b5563] bg-transparent'
                        : isChecked
                          ? 'bg-[#6b72ff] border-[#6b72ff]'
                          : 'border-[#4b5563] group-hover:border-[#6b72ff]/60'
                    }`}
                  >
                    {isChecked && !isAlreadyAdded && (
                      <svg
                        className="w-3 h-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    )}
                    {isAlreadyAdded && (
                      <svg
                        className="w-3 h-3 text-[#6b7280]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 space-y-3">
          <button
            onClick={handleAdd}
            disabled={!selected}
            className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-200 ${
              selected
                ? 'bg-gradient-to-r from-[#bdbefe] to-[#a092ec] text-[#0D0096] shadow-[0_0_20px_rgba(108,99,255,0.4)] active:scale-95'
                : 'bg-[#1a1d2e] text-[#9ca3af] hover:bg-white/5 border border-white/5 cursor-not-allowed'
            }`}
          >
            AÑADIR HABILIDAD
          </button>
          <button
            onClick={handleClose}
            className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest text-white hover:bg-white/5 border border-white/10 transition-all duration-200 active:scale-95"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
