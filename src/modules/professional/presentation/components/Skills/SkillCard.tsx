import { useState, useRef, useEffect } from 'react';
import { Skill } from '../../../domain/entities/Skill';

interface SkillCardProps {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative bg-src-1a1a2e rounded-xl p-5 flex items-center justify-between border border-white/5 hover:border-src-6b72ff/30 transition-all shadow-md">
      <div className="flex-1">
        <h3 className="text-white font-medium text-lg">{skill.name}</h3>
        <p className="text-src-9ca3af text-sm mt-1">{skill.level}</p>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 rounded-full bg-src-0d1117 hover:bg-src-2a2d3e text-src-9ca3af hover:text-white flex items-center justify-center transition-colors"
          aria-label="Opciones de habilidad"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-36 bg-src-0f111a rounded-xl shadow-2xl border border-white/10 overflow-hidden z-30">
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="w-full text-left px-4 py-2.5 text-white hover:bg-src-2a2d3e transition-colors text-sm flex items-center gap-2"
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
                setMenuOpen(false);
                onDelete();
              }}
              className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-src-2a2d3e hover:text-red-300 transition-colors text-sm flex items-center gap-2 border-t border-white/5"
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
