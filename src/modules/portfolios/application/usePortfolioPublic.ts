import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '../../../infrastructure/http/httpClient';
import type { PortfolioPublicData } from '../domain/entities/PortfolioPublicData';

export function usePortfolioPublic(portfolioId: string | undefined) {
  const [data, setData] = useState<PortfolioPublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(() => {
    if (!portfolioId) return;
    setLoading(true);
    setError(null);
    // GET público — intentamos enviar el token si existe para que el dueño pueda verlo aunque sea privado
    httpClient
      .getAuth<PortfolioPublicData>(
        `/api/portafolios/${portfolioId}/publica`,
        'No se pudo cargar el portafolio'
      )
      .then(setData)
      .catch((err) => setError(err?.message || 'Error al cargar el portafolio'))
      .finally(() => setLoading(false));
  }, [portfolioId]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return { data, loading, error, refetch: fetchPortfolio };
}
