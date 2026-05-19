import { useState, useEffect, useRef } from 'react';
import type { ExploreSearchParams } from '../../domain/entities/ExplorePortfolio';

interface ExploreSearchBarProps {
  initialParams: ExploreSearchParams;
  onSearch: (params: ExploreSearchParams) => void;
  compact?: boolean;
}

export default function ExploreSearchBar({
  initialParams,
  onSearch,
  compact = false,
}: ExploreSearchBarProps) {
  const [q, setQ] = useState(initialParams.q ?? '');
  const [sort, setSort] = useState<'recientes' | 'nombre'>(
    initialParams.sort ?? 'recientes'
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external changes (e.g., URL param load)
  useEffect(() => {
    setQ(initialParams.q ?? '');
    setSort(initialParams.sort ?? 'recientes');
  }, [initialParams.q, initialParams.sort]);

  const handleSearch = (newQ: string, newSort: 'recientes' | 'nombre') => {
    onSearch({ q: newQ, sort: newSort });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQ(val);
    handleSearch(val, sort);
  };

  const handleSortChange = (newSort: 'recientes' | 'nombre') => {
    setSort(newSort);
    handleSearch(q, newSort);
  };

  const handleClear = () => {
    setQ('');
    handleSearch('', sort);
    inputRef.current?.focus();
  };

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-end gap-3 w-full">
        {/* Search input compact */}
        <div className="flex-1 flex flex-col gap-1.5 w-full">
          <label className="text-[11px] uppercase font-bold tracking-wider text-[#5a6278]">
            Buscar
          </label>
          <div className="relative w-full">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6278] pointer-events-none">
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={handleInputChange}
              placeholder="Buscar portafolios, personas, profesiones…"
              className="w-full pl-10 pr-10 py-2.5 bg-[#171B28] border border-white/10 rounded-xl text-white placeholder-[#5a6278] text-sm focus:outline-none focus:border-[#7c6bec]/50 transition-all"
            />
            {q && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6278] hover:text-white transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
          <label className="text-[11px] uppercase font-bold tracking-wider text-[#5a6278]">
            Ordenar
          </label>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleSortChange('recientes')}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                sort === 'recientes'
                  ? 'bg-[#7c6bec]/15 border-[#7c6bec]/40 text-[#C9BEFF]'
                  : 'border-white/10 text-[#5a6278] hover:text-white hover:border-white/20'
              }`}
            >
              Recientes
            </button>
            <button
              onClick={() => handleSortChange('nombre')}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                sort === 'nombre'
                  ? 'bg-[#7c6bec]/15 border-[#7c6bec]/40 text-[#C9BEFF]'
                  : 'border-white/10 text-[#5a6278] hover:text-white hover:border-white/20'
              }`}
            >
              A → Z
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hero (expanded) version
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Descubre{' '}
          <span className="bg-gradient-to-r from-[#7c6bec] to-[#c4bef8] bg-clip-text text-transparent">
            portafolios
          </span>
        </h1>
        <p className="text-[#6b7280] text-base mt-3">
          Encuentra profesionales por nombre, portafolio o especialidad
        </p>
      </div>

      {/* Big search input */}
      <div className="relative w-full flex flex-col gap-1.5">
        <label className="text-[11px] uppercase font-bold tracking-wider text-[#5a6278] pl-1">
          Buscar
        </label>
        <div className="relative w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5a6278] pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={handleInputChange}
            placeholder="Buscar por nombre de portafolio, persona o profesión…"
            className="w-full pl-14 pr-14 py-4 bg-[#171B28] border border-white/10 rounded-2xl text-white placeholder-[#5a6278] text-base focus:outline-none focus:border-[#7c6bec]/50 focus:shadow-[0_0_0_3px_rgba(124,107,236,0.12)] transition-all shadow-lg"
            autoFocus
          />
          {q && (
            <button
              onClick={handleClear}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5a6278] hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Sort pills */}
      <div className="flex gap-2.5 items-center">
        <span className="text-[11px] uppercase font-bold tracking-wider text-[#5a6278] mr-1">
          Ordenar
        </span>
        <button
          onClick={() => handleSortChange('recientes')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            sort === 'recientes'
              ? 'bg-[#7c6bec]/15 border-[#7c6bec]/40 text-[#C9BEFF]'
              : 'border-white/10 text-[#5a6278] hover:text-white hover:border-white/20'
          }`}
        >
          Más recientes
        </button>
        <button
          onClick={() => handleSortChange('nombre')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            sort === 'nombre'
              ? 'bg-[#7c6bec]/15 border-[#7c6bec]/40 text-[#C9BEFF]'
              : 'border-white/10 text-[#5a6278] hover:text-white hover:border-white/20'
          }`}
        >
          Nombre A → Z
        </button>
      </div>
    </div>
  );
}
