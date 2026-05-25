import { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '../domain/entities/DashboardStats';
import { HttpAdminDashboardRepository } from '../infrastructure/repositories/HttpAdminDashboardRepository';

const repository = new HttpAdminDashboardRepository();

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repository.getDashboardStats();
      setStats(data);
    } catch {
      setError('No se pudo cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, isLoading, error, reload: loadStats };
}
