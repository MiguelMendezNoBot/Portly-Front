// src/modules/admin/applications/useAdminAppeal.ts

import { useState, useEffect, useCallback } from 'react';
import { HttpAppealRepository } from '../infrastructure/repositories/HttpAppealRepository';
import { Appeal } from '../domain/entities/Appeal';

const repo = new HttpAppealRepository();

export function useAdminAppeal() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await repo.getAll();
      setAppeals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  return { appeals, isLoading, error, refetch: fetchAppeals };
}
