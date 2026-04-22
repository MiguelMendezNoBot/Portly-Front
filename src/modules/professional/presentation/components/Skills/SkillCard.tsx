import { useState, useRef, useEffect } from 'react';
import { Skill } from '../../../domain/entities/Skill';
import { LevelIcon } from './icons/LevelIcon';
import { TechIcon } from './icons/TechIcon';

export default function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative bg-[#1a1a2e] rounded-2xl border border-white/5 hover:border-[#6b72ff]/40 transition-all duration-300 shadow-md grid grid-cols-[36px_1fr_1px_130px] items-stretch">

      {/* Menú de tres puntos — columna izquierda */}
      <div className="relative flex items-center" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-full px-2 flex items-center justify-center text-[#4b4f6b] hover:text-[#9ca3af] hover:bg-white/5 rounded-l-2xl transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-full mt-1 w-40 bg-[#0f111a] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => { onEdit(); setMenuOpen(false); }}
              className="w-full text-left px-4 py-3 text-white hover:bg-[#6b72ff] text-sm font-medium flex items-center gap-3 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5L20 7l-9 9-4 1 1-4 9-9z" />
              </svg>
              EDITAR
            </button>
            <button
              onClick={() => { onDelete(); setMenuOpen(false); }}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white text-sm font-medium flex items-center gap-3 border-t border-white/5 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              ELIMINAR
            </button>
          </div>
        )}
      </div>

      {/* Ícono + Nombre — columna flexible (1fr) */}
      <div className="flex items-center gap-2  py-3 min-w-0">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
          <TechIcon name={skill.name} />
        </div>
        <h3 className="text-white font-bold text-xs truncate">{skill.name}</h3>
      </div>

      {/* Separador vertical — columna de 1px */}
      <div className="bg-white/10 my-3" />

      {/* Nivel de dominio — columna fija 130px */}
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
