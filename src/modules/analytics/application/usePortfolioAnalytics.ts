import { useState, useEffect, useCallback } from 'react';
import type { PortfolioAnalytics, AnalyticsPeriod } from '../domain/entities/PortfolioAnalytics';
import type { AnalyticsRepository } from '../domain/repositories/AnalyticsRepository';
import { HttpAnalyticsRepository } from '../infrastructure/repositories/HttpAnalyticsRepository';

const repository: AnalyticsRepository = new HttpAnalyticsRepository();

export function usePortfolioAnalytics(portfolioId: string | null, period: AnalyticsPeriod) {
  const [data, setData] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!portfolioId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await repository.getPortfolioAnalytics(portfolioId, period);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar analíticas');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [portfolioId, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, reload: fetchAnalytics };
}
