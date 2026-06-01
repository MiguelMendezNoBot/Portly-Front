import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useExplore } from '../../application/useExplore';
import ExploreSearchBar from '../components/ExploreSearchBar';
import ExplorePortfolioCard from '../components/ExplorePortfolioCard';
import ExplorePagination from '../components/ExplorePagination';
import type {
  ExplorePortfolio,
  ExploreSearchParams,
} from '../../domain/entities/ExplorePortfolio';

// ─── Inline Portfolio Viewer ──────────────────────────────────────────────────
// Re-uses the same data-fetch logic as PortfolioPublicPage but embeds inside
// the Explore layout so we don't open a new tab.

function InlinePortfolioViewer({
  portfolioId,
  onBack,
}: {
  portfolioId: string;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0f111a] animate-fade-in flex flex-col">
      {/* Premium floating back button */}
      <div className="absolute top-6 left-6 z-[110]">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:border-src-6b72ff/50 hover:bg-black/60 transition-all duration-300 shadow-2xl"
        >
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-src-6b72ff/20 transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-wide uppercase">
            Volver a Explorar
          </span>
        </button>
      </div>

      <div className="flex-1 w-full h-full overflow-hidden">
        <iframe
          src={`/p/${portfolioId}?from=explore`}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-[#171B28] border border-white/8 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-white/5" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-white/8 rounded-lg w-3/4" />
        <div className="flex items-center gap-2.5 mt-2">
          <div className="w-8 h-8 rounded-full bg-white/8 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 bg-white/8 rounded w-1/2" />
            <div className="h-2.5 bg-white/5 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const { portfolioId } = useParams<{ portfolioId?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial params from URL
  const initialParams: ExploreSearchParams = {
    q: searchParams.get('q') ?? undefined,
    sort: (searchParams.get('sort') as 'recientes' | 'nombre') ?? 'recientes',
    page: Number(searchParams.get('page') ?? 1),
    nacionalidad: searchParams.get('nacionalidad') ?? undefined,
    habilidadesBlandas: searchParams.get('habilidadesBlandas') ?? undefined,
    habilidadesTecnicas: searchParams.get('habilidadesTecnicas') ?? undefined,
    gradoAcademico: searchParams.get('gradoAcademico') ?? undefined,
  };

  const {
    portfolios,
    loading,
    error,
    total,
    page,
    totalPages,
    search,
    goToPage,
    refetch,
    currentParams,
  } = useExplore(initialParams);

  const isViewing = Boolean(portfolioId);
  const hasQuery = Boolean(currentParams.q?.trim());

  // Refetch when returning from a portfolio view
  const wasViewing = useRef(isViewing);
  useEffect(() => {
    if (wasViewing.current && !isViewing) {
      refetch();
    }
    wasViewing.current = isViewing;
  }, [isViewing, refetch]);

  // Sync URL params when search changes
  const syncUrlParams = useCallback(
    (params: ExploreSearchParams, currentPage: number) => {
      const next = new URLSearchParams();
      if (params.q) next.set('q', params.q);
      if (params.sort && params.sort !== 'recientes')
        next.set('sort', params.sort);
      if (params.nacionalidad) next.set('nacionalidad', params.nacionalidad);
      if (params.habilidadesBlandas)
        next.set('habilidadesBlandas', params.habilidadesBlandas);
      if (params.habilidadesTecnicas)
        next.set('habilidadesTecnicas', params.habilidadesTecnicas);
      if (params.gradoAcademico) next.set('gradoAcademico', params.gradoAcademico);
      if (currentPage > 1) next.set('page', String(currentPage));
      setSearchParams(next, { replace: true });
    },
    [setSearchParams]
  );

  const handleSearch = useCallback(
    (params: ExploreSearchParams) => {
      search(params);
      syncUrlParams(params, 1);
    },
    [search, syncUrlParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      goToPage(newPage);
      syncUrlParams(currentParams, newPage);
    },
    [goToPage, currentParams, syncUrlParams]
  );

  const handleCardClick = useCallback(
    (portfolio: ExplorePortfolio) => {
      navigate(`/explorar/${portfolio.id}`);
    },
    [navigate]
  );

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Fixed section title for results label
  const sectionTitle = 'Resultados';

  return (
    <div className="relative min-h-full flex flex-col animate-fade-in">
      {/* ── Viewing a specific portfolio ──────────────────────────────────────── */}
      {isViewing ? (
        <InlinePortfolioViewer portfolioId={portfolioId!} onBack={handleBack} />
      ) : (
        /* ── Search + results ────────────────────────────────────────────────── */
        <div className="flex flex-col gap-6 pt-1 pb-8">
          {/* Always show Hero search */}
          <div className="py-2">
            <ExploreSearchBar
              initialParams={currentParams}
              onSearch={handleSearch}
              compact={false}
            />
          </div>

          {/* Section header */}
          <div className="flex flex-col gap-1 px-1 mt-4 pb-3 border-b border-white/5">
            <h2 className="text-white text-xl font-bold flex items-baseline gap-3">
              {sectionTitle}
              <span className="text-[#C9BEFF] text-sm font-semibold">
                ({total})
              </span>
            </h2>
            <p className="text-[#9ca3af] text-xs">
              Descubre el talento y los proyectos destacados de nuestra comunidad
            </p>
          </div>

          {/* Error state */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-red-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-white font-semibold">
                Error al cargar portafolios
              </p>
              <p className="text-[#5a6278] text-sm max-w-xs">{error}</p>
            </div>
          )}

          {/* Grid */}
          {!error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                  ? Array.from({ length: 9 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : portfolios.map((p) => (
                      <ExplorePortfolioCard
                        key={p.id}
                        portfolio={p}
                        query={currentParams.q}
                        onClick={handleCardClick}
                      />
                    ))}
              </div>

              {/* Empty state */}
              {!loading && portfolios.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[280px] gap-4 text-center px-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#7c6bec]/10 flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      className="text-[#7c6bec]"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      Sin resultados
                    </p>
                    <p className="text-white/40 text-sm mt-1 max-w-xs leading-relaxed">
                      No se encontró portafolios. Intenta realizar otra búsqueda.
                    </p>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <ExplorePagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
