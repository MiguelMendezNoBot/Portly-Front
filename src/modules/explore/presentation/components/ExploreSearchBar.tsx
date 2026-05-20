import { useState, useEffect, useRef } from 'react';
import type { ExploreSearchParams } from '../../domain/entities/ExplorePortfolio';

const NATIONALITIES = [
  'Bolivia',
  'Argentina',
  'Chile',
  'Colombia',
  'México',
  'Perú',
  'Brasil',
  'Ecuador',
  'Paraguay',
  'Uruguay',
  'Venezuela',
  'Panamá',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'Nicaragua',
  'Costa Rica',
  'Cuba',
  'República Dominicana',
  'Puerto Rico',
  'España',
  'Estados Unidos',
  'Canadá',
  'Francia',
  'Alemania',
  'Italia',
  'Reino Unido',
  'Portugal',
  'Japón',
  'China',
  'India',
  'Rusia',
  'Australia',
  'Sudáfrica',
  'Otra',
];

const NIVELES = [
  'Técnico superior',
  'Técnico medio',
  'Licenciatura',
  'Maestria',
  'Doctorado',
  'Postdoctorado',
  'Especialidad',
];

const PREDEFINED_TECH_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Docker',
  'Kubernetes',
  'AWS',
  'MongoDB',
  'PostgreSQL',
  'GraphQL',
  'Tailwind CSS',
  'Figma',
  'Scrum',
];

const SOFT_SKILLS = [
  'Pensamiento Crítico',
  'Empatía',
  'Liderazgo',
  'Comunicación Asertiva',
  'Trabajo en Equipo',
  'Gestión del Tiempo',
  'Negociación',
  'Creatividad',
  'Adaptabilidad',
  'Resolución de Conflictos',
  'Presentación',
  'Motivación',
];

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: FilterSelectProps) {
  const active = value !== '';
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#1a1c29] border ${
          active
            ? 'border-[#7c6bec] text-white'
            : 'border-white/10 text-[#9ca3af]'
        } rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6c63ff] transition-colors appearance-none cursor-pointer hover:border-white/30`}
        style={{ backgroundImage: 'none' }}
      >
        <option value="" className="text-[#6b7280]">
          {label}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#1a1c29] text-white">
            {o}
          </option>
        ))}
      </select>
      {/* chevron icon */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
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
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

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
  const [filters, setFilters] = useState({
    nacionalidad: initialParams.nacionalidad ?? '',
    habilidadesBlandas: initialParams.habilidadesBlandas ?? '',
    habilidadesTecnicas: initialParams.habilidadesTecnicas ?? '',
    gradoAcademico: initialParams.gradoAcademico ?? '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQ(initialParams.q ?? '');
    setSort(initialParams.sort ?? 'recientes');
    setFilters({
      nacionalidad: initialParams.nacionalidad ?? '',
      habilidadesBlandas: initialParams.habilidadesBlandas ?? '',
      habilidadesTecnicas: initialParams.habilidadesTecnicas ?? '',
      gradoAcademico: initialParams.gradoAcademico ?? '',
    });
  }, [
    initialParams.q,
    initialParams.sort,
    initialParams.nacionalidad,
    initialParams.habilidadesBlandas,
    initialParams.habilidadesTecnicas,
    initialParams.gradoAcademico,
  ]);

  const triggerSearch = (
    newQ: string,
    newSort: 'recientes' | 'nombre',
    newFilters: typeof filters
  ) => {
    onSearch({
      q: newQ || undefined,
      sort: newSort,
      nacionalidad: newFilters.nacionalidad || undefined,
      habilidadesBlandas: newFilters.habilidadesBlandas || undefined,
      habilidadesTecnicas: newFilters.habilidadesTecnicas || undefined,
      gradoAcademico: newFilters.gradoAcademico || undefined,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQ(val);
    triggerSearch(val, sort, filters);
  };

  const handleSortChange = (newSort: 'recientes' | 'nombre') => {
    setSort(newSort);
    triggerSearch(q, newSort, filters);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    triggerSearch(q, sort, nextFilters);
  };

  const handleClearAll = () => {
    const cleared = {
      nacionalidad: '',
      habilidadesBlandas: '',
      habilidadesTecnicas: '',
      gradoAcademico: '',
    };
    setQ('');
    setFilters(cleared);
    triggerSearch('', sort, cleared);
    inputRef.current?.focus();
  };

  const handleClearSelectFilters = () => {
    const cleared = {
      nacionalidad: '',
      habilidadesBlandas: '',
      habilidadesTecnicas: '',
      gradoAcademico: '',
    };
    setFilters(cleared);
    triggerSearch(q, sort, cleared);
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== '') || q !== '';

  const hasActiveSelectFilters =
    Object.values(filters).some((v) => v !== '');

  if (compact) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {/* Search + sort row */}
        <div className="flex flex-col sm:flex-row items-end gap-3 w-full">
          <div className="flex-1 relative w-full">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6278] pointer-events-none">
              <svg
                width="15"
                height="15"
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
              placeholder="Buscar portafolios…"
              className="w-full pl-10 pr-9 py-2.5 bg-[#171B28] border border-white/10 rounded-xl text-white placeholder-[#5a6278] text-sm focus:outline-none focus:border-[#7c6bec]/50 transition-all"
            />
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6278] hover:text-white transition-colors"
              >
                <svg
                  width="13"
                  height="13"
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
        {/* Filter selects compact */}
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label="País"
            value={filters.nacionalidad}
            onChange={(v) => handleFilterChange('nacionalidad', v)}
            options={NATIONALITIES}
            placeholder="País"
          />
          <FilterSelect
            label="Grado"
            value={filters.gradoAcademico}
            onChange={(v) => handleFilterChange('gradoAcademico', v)}
            options={NIVELES}
            placeholder="Grado"
          />
          <FilterSelect
            label="Habilidad técnica"
            value={filters.habilidadesTecnicas}
            onChange={(v) => handleFilterChange('habilidadesTecnicas', v)}
            options={PREDEFINED_TECH_SKILLS}
            placeholder="Habilidad técnica"
          />
          <FilterSelect
            label="Habilidad blanda"
            value={filters.habilidadesBlandas}
            onChange={(v) => handleFilterChange('habilidadesBlandas', v)}
            options={SOFT_SKILLS}
            placeholder="Habilidad blanda"
          />
        </div>
      </div>
    );
  }

  // ── Hero (expanded) version ──────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Descubre{' '}
          <span className="bg-gradient-to-r from-[#7c6bec] to-[#c4bef8] bg-clip-text text-transparent">
            portafolios
          </span>
        </h1>
        <p className="text-[#6b7280] text-base mt-3">
          Encuentra la inspiración ideal buscando por nombre, autor o profesión.
        </p>
      </div>

      {/* Search input */}
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
          placeholder="Busca por nombre, creador o profesión..."
          className="w-full pl-14 pr-14 py-4 bg-[#171B28] border border-white/10 rounded-2xl text-white placeholder-[#5a6278] text-base focus:outline-none focus:border-[#7c6bec]/50 focus:shadow-[0_0_0_3px_rgba(124,107,236,0.12)] transition-all shadow-lg"
          autoFocus
        />
      </div>

      {/* Filter selects – always visible */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[13px] uppercase font-bold tracking-wider text-[#7c6bec] bg-[#7c6bec]/10 px-4 py-1.5 rounded-full border border-[#7c6bec]/20 shadow-sm">
            Filtros de Búsqueda
          </span>
          {hasActiveSelectFilters && (
            <button
              onClick={handleClearSelectFilters}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-full hover:bg-red-500/10 flex items-center gap-1"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          <FilterSelect
            label="Nacionalidad"
            value={filters.nacionalidad}
            onChange={(v) => handleFilterChange('nacionalidad', v)}
            options={NATIONALITIES}
            placeholder="Nacionalidad"
          />
          <FilterSelect
            label="Grado académico"
            value={filters.gradoAcademico}
            onChange={(v) => handleFilterChange('gradoAcademico', v)}
            options={NIVELES}
            placeholder="Grado académico"
          />
          <FilterSelect
            label="Habilidad técnica"
            value={filters.habilidadesTecnicas}
            onChange={(v) => handleFilterChange('habilidadesTecnicas', v)}
            options={PREDEFINED_TECH_SKILLS}
            placeholder="Habilidad técnica"
          />
          <FilterSelect
            label="Habilidad blanda"
            value={filters.habilidadesBlandas}
            onChange={(v) => handleFilterChange('habilidadesBlandas', v)}
            options={SOFT_SKILLS}
            placeholder="Habilidad blanda"
          />
        </div>
      </div>
    </div>
  );
}
