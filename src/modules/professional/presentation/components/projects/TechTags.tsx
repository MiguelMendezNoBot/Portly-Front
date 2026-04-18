import { useState } from 'react';

interface TechTagsProps {
  technologies: string[];
  onChange: (technologies: string[]) => void;
}

export default function TechTags({ technologies, onChange }: TechTagsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAdd = () => {
    const trimmed = newTag.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      onChange([...technologies, trimmed]);
    }
    setNewTag('');
    setIsAdding(false);
  };

  const handleRemove = (index: number) => {
    onChange(technologies.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Escape') {
      setNewTag('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {technologies.map((tech, index) => (
        <span
          key={index}
          className="flex items-center gap-1.5 bg-[#6c63ff]/20 text-[#bdbefe] px-3 py-1.5 rounded-full text-sm font-medium"
        >
          {tech}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-[#bdbefe] hover:text-white transition-colors ml-0.5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </span>
      ))}

      {isAdding ? (
        <input
          autoFocus
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="Ej. React"
          className="bg-transparent border border-pink-400/60 rounded-full px-3 py-1.5 text-white text-sm outline-none w-28 placeholder:text-pink-300/40"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="text-[#bdbefe] text-sm hover:text-white transition-colors cursor-pointer"
        >
          + Añadir tecnología
        </button>
      )}
    </div>
  );
}
