import { useState, useEffect, useCallback, useRef } from 'react';
import { exploreRepository } from '../infrastructure/repositories/HttpExploreRepository';
import type {
  ExplorePortfolio,
  ExploreSearchParams,
} from '../domain/entities/ExplorePortfolio';

export interface UseExploreReturn {
  portfolios: ExplorePortfolio[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  search: (params: ExploreSearchParams) => void;
  goToPage: (page: number) => void;
  currentParams: ExploreSearchParams;
}

const LIMIT = 12;

export function useExplore(initialParams?: ExploreSearchParams): UseExploreReturn {
  const [portfolios, setPortfolios] = useState<ExplorePortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams?.page ?? 1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentParams, setCurrentParams] = useState<ExploreSearchParams>(
    initialParams ?? {}
  );

  // Debounce ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cache simple en memoria por sesión
  const cache = useRef<Map<string, { portfolios: ExplorePortfolio[]; total: number; totalPages: number }>>(
    new Map()
  );

  const fetchPortfolios = useCallback(
    async (params: ExploreSearchParams, targetPage: number) => {
      const cacheKey = JSON.stringify({ ...params, page: targetPage });

      if (cache.current.has(cacheKey)) {
        const cached = cache.current.get(cacheKey)!;
        setPortfolios(cached.portfolios);
        setTotal(cached.total);
        setTotalPages(cached.totalPages);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await exploreRepository.search({
          ...params,
          page: targetPage,
          limit: LIMIT,
        });
        setPortfolios(result.portfolios);
        setTotal(result.total);
        setTotalPages(result.totalPages);
        cache.current.set(cacheKey, {
          portfolios: result.portfolios,
          total: result.total,
          totalPages: result.totalPages,
        });
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || 'Error al buscar portafolios');
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchPortfolios(currentParams, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useCallback(
    (params: ExploreSearchParams) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const newPage = 1;
        setCurrentParams(params);
        setPage(newPage);
        fetchPortfolios(params, newPage);
      }, 300);
    },
    [fetchPortfolios]
  );

  const goToPage = useCallback(
    (targetPage: number) => {
      setPage(targetPage);
      fetchPortfolios(currentParams, targetPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentParams, fetchPortfolios]
  );

  return {
    portfolios,
    loading,
    error,
    total,
    page,
    totalPages,
    search,
    goToPage,
    currentParams,
  };
}
