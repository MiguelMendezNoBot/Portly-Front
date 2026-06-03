import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '../../../infrastructure/http/httpClient';
import { DashboardStats } from '../domain/entities/DashboardStats';
import { countSuspendedAccounts } from '../domain/userAccountStatus';
import { HttpAdminDashboardRepository } from '../infrastructure/repositories/HttpAdminDashboardRepository';

const repository = new HttpAdminDashboardRepository();

interface AdminUserForStats {
  estado?: string;
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [data, users] = await Promise.all([
        repository.getDashboardStats(),
        httpClient
          .getAuth<AdminUserForStats[]>('/api/admin/users')
          .catch(() => null),
      ]);

      const cuentasSuspendidas =
        users !== null ? countSuspendedAccounts(users) : data.cuentasSuspendidas;

      setStats({ ...data, cuentasSuspendidas });
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
