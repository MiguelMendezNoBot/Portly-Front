import { Skill } from '../../../domain/entities/Skill';
import { LevelIcon } from './icons/LevelIcon';
import { TechIcon } from './icons/TechIcon';

interface SkillCardProps {
  skill: Skill;
  mode: 'edit' | 'delete' | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SkillCard({
  skill,
  mode,
  onEdit,
  onDelete,
}: SkillCardProps) {
  const isCardClickable = mode !== null;

  const borderClass = !isCardClickable
    ? 'border-white/5 hover:border-[#6b72ff]/40'
    : mode === 'edit'
      ? 'border-[#6b72ff]/40 hover:border-[#6b72ff]/70'
      : 'border-red-500/40 hover:border-red-500/70';

  const handleCardClick = () => {
    if (!isCardClickable) return;
    if (mode === 'edit') onEdit();
    if (mode === 'delete') onDelete();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative group bg-[#1a1a2e] rounded-2xl border transition-all duration-300 shadow-md grid grid-cols-[36px_1fr_1px_130px] items-stretch ${
        isCardClickable ? 'cursor-pointer' : ''
      } ${borderClass}`}
    >
      {/* Columna izquierda con icono de modo (aparece solo al hover) */}
      <div className="flex items-center justify-center pl-1">
        {mode && (
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${
              mode === 'edit' ? 'bg-[#6b72ff]/20' : 'bg-red-500/20'
            }`}
          >
            {mode === 'edit' ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9BEFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Ícono + Nombre */}
      <div className="flex items-center gap-2 py-3 min-w-0">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
          <TechIcon name={skill.name} />
        </div>
        <h3 className="text-white font-bold text-xs truncate">{skill.name}</h3>
      </div>

      {/* Separador vertical */}
      <div className="bg-white/10 my-3" />

      {/* Nivel de dominio */}
      <div className="flex flex-col items-center justify-center gap-1 px-3 py-3">
        <span className="text-[#a7aab9] text-[11px] font-semibold whitespace-nowrap">
          Nivel de dominio
        </span>
        <div className="flex items-center gap-2">
          <LevelIcon level={skill.level} size="w-6 h-6" />
          <span className="text-[#ac8144] text-sm font-bold whitespace-nowrap">
            {skill.level}
          </span>
        </div>
      </div>
    </div>
  );
}
