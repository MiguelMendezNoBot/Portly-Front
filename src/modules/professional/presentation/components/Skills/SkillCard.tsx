import { useState, useRef, useEffect } from 'react';
import { Skill } from '../../../domain/entities/Skill';
import GlowIcon from './icons/GlowIcon';
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
    <div className="group relative bg-[#1a1a2e] rounded-2xl p-5 flex items-center justify-between border border-white/5 hover:border-[#6b72ff]/40 transition-all duration-300 shadow-md">
      <div className="flex items-center gap-4">
        {/* Contenedor del Logo de Tecnología */}
        <div className="w-12 h-12 rounded-xl  flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
          <TechIcon name={skill.name} />
        </div>

        <div>
          <h3 className="text-white font-bold text-lg">{skill.name}</h3>
          {/* Nivel con su Icono SVG al lado */}
          <div className="flex items-center gap-1.5">
            <LevelIcon level={skill.level} />
            <p className="text-[#ac8144] text-xs font-bold uppercase tracking-wider">
              {skill.level}
            </p>
          </div>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-[#9ca3af] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-12 w-40 bg-[#0f111a] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                onEdit();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-[#6b72ff] text-sm font-medium flex items-center gap-3 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9M16.5 3.5L20 7l-9 9-4 1 1-4 9-9z" />
              </svg>
              Editar
            </button>
            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white text-sm font-medium flex items-center gap-3 border-t border-white/5 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
