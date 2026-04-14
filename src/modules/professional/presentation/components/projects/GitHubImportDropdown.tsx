import { useState, useEffect, useRef } from 'react';
import { GitHubRepo } from '../../../domain/entities/Project';
import { HttpGitHubRepository } from '../../../infrastructure/repositories/HttpGitHubRepository';

const githubRepo = new HttpGitHubRepository();

interface GitHubImportDropdownProps {
  onSelect: (repo: GitHubRepo) => void;
  onToast: (message: string, type: 'success' | 'error') => void;
}

export default function GitHubImportDropdown({
  onSelect,
  onToast,
}: GitHubImportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleOpen = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

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

  const handleSelect = (repo: GitHubRepo) => {
    onSelect(repo);
    setIsOpen(false);
    setSearch('');
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

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
        Importar desde GitHub
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-white/5">
            <input
              type="text"
              placeholder="Buscar repositorio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1c29] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#6c63ff] placeholder:text-[#6b7280]"
              autoFocus
            />
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="w-5 h-5 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[#9ca3af] text-xs mt-2">
                  Cargando repositorios...
                </p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-4 text-center text-[#9ca3af] text-sm">
                {search
                  ? 'No se encontraron repositorios'
                  : 'No hay repositorios disponibles'}
              </div>
            ) : (
              filteredRepos.map((repo) => (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => handleSelect(repo)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <p className="text-white text-sm font-medium truncate">
                    {repo.name}
                  </p>
                  {repo.description && (
                    <p className="text-[#6b7280] text-xs mt-0.5 truncate">
                      {repo.description}
                    </p>
                  )}
                  {repo.languages && repo.languages.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {repo.languages.slice(0, 3).map((lang) => (
                        <span
                          key={lang}
                          className="text-[10px] bg-[#6c63ff]/15 text-[#a3a6ff] px-2 py-0.5 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
