import { useState, useEffect, useCallback } from 'react';
import type { GlobalAnalytics, AnalyticsPeriod } from '../domain/entities/PortfolioAnalytics';
import type { AnalyticsRepository } from '../domain/repositories/AnalyticsRepository';
import { HttpAnalyticsRepository } from '../infrastructure/repositories/HttpAnalyticsRepository';

const repository: AnalyticsRepository = new HttpAnalyticsRepository();

export function useGlobalAnalytics(period: AnalyticsPeriod) {
  const [data, setData] = useState<GlobalAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await repository.getGlobalAnalytics(period);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar analíticas globales');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, reload: fetchAnalytics };
}
