import { useState, useEffect, useRef } from 'react';
import { GitHubRepo } from '../../../domain/entities/Project';
import { HttpGitHubRepository } from '../../../infrastructure/repositories/HttpGitHubRepository';

const githubRepo = new HttpGitHubRepository();

const ITEMS_PER_PAGE = 5;

interface GitHubImportDropdownProps {
  onSelect: (repo: GitHubRepo) => void;
  onToast: (message: string, type: 'success' | 'error') => void;
}

/** Formatea estrellas: 1200 → "1.2k" */
function formatStars(count: number): string {
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(count);
}

/** Formatea fecha ISO → "12 oct 2024" */
function formatDate(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function GitHubImportDropdown({
  onSelect,
  onToast,
}: GitHubImportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchRepos = async () => {
    setIsLoading(true);
    try {
      const data = await githubRepo.getRepos();
      setRepos(data);
    } catch (error: { status?: number } | unknown) {
      const err = error as { status?: number };
      if (err?.status === 404 || err?.status === 400) {
        onToast('Usted no tiene una cuenta de GitHub vinculada', 'error');
        setIsOpen(false);
      } else {
        onToast('Error al obtener repositorios de GitHub', 'error');
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    setPage(1);
    setSearch('');
    await fetchRepos();
  };

  const handleRefresh = async () => {
    setPage(1);
    setSearch('');
    await fetchRepos();
  };

  const handleSelect = (repo: GitHubRepo) => {
    onSelect(repo);
    setIsOpen(false);
    setSearch('');
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / ITEMS_PER_PAGE));
  const paginatedRepos = filteredRepos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 bg-[#1a1c29] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white hover:border-[#6c63ff]/40 transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        IMPORTAR DESDE GITHUB
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto sm:right-0 mt-2 w-[calc(100vw-6rem)] sm:w-[480px] md:w-[700px] bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header: Search + Count */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="relative flex-1 max-w-[320px]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar repositorio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1c29] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm outline-none focus:border-[#6c63ff] placeholder:text-[#6b7280]"
                autoFocus
              />
            </div>
            <span className="text-[#6b7280] text-xs ml-4 whitespace-nowrap">
              {filteredRepos.length} repositorios encontrados
            </span>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_70px] sm:grid-cols-[180px_90px_1fr_90px] gap-2 px-4 py-2.5 border-b border-white/5 text-[#6b7280] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Nombre del repositorio</span>
            <span className="text-right sm:text-left">Estrellas</span>
            <span className="hidden sm:inline">Descripción</span>
            <span className="text-right hidden sm:inline">Fecha</span>
          </div>

          {/* Rows */}
          <div className="min-h-[200px]">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-5 h-5 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[#9ca3af] text-xs mt-2">
                  Cargando repositorios...
                </p>
              </div>
            ) : paginatedRepos.length === 0 ? (
              <div className="p-8 text-center text-[#9ca3af] text-sm">
                {search
                  ? 'No se encontraron repositorios'
                  : 'No hay repositorios disponibles'}
              </div>
            ) : (
              paginatedRepos.map((repo) => (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => handleSelect(repo)}
                  className="w-full grid grid-cols-[1fr_70px] sm:grid-cols-[180px_90px_1fr_90px] gap-2 items-center px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 text-left"
                >
                  {/* Name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6c63ff"
                      strokeWidth="2"
                      className="shrink-0"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-white text-sm font-medium truncate">
                      {repo.name}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center justify-end sm:justify-start gap-1 text-[#7367f0] text-sm">
                    <span>★</span>
                    <span>{formatStars(repo.stargazers_count || 0)}</span>
                  </div>

                  {/* Description */}
                  <p className="text-[#9ca3af] text-xs truncate hidden sm:block">
                    {repo.description || '—'}
                  </p>

                  {/* Date */}
                  <span className="text-[#6b7280] text-xs text-right whitespace-nowrap hidden sm:block">
                    {formatDate(repo.updated_at)}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Footer: Refresh + Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-xs font-bold uppercase tracking-wider bg-[#6c63ff]/20 text-[#bdbefe] hover:bg-[#6c63ff]/30 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
            >
              Refrescar lista
            </button>

            <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="hover:text-white transition-colors disabled:opacity-30 text-sm"
              >
                ‹
              </button>
              <span className="font-medium">
                Pag {page} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="hover:text-white transition-colors disabled:opacity-30 text-sm"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
