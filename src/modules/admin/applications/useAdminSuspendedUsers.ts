// src/modules/admin/applications/useAdminSuspendedUsers.ts

import { useState, useEffect, useCallback } from 'react';
import { SuspendedUser } from '../domain/entities/SuspendedUser';
import { HttpAdminSuspendedUserRepository } from '../infrastructure/repositories/HttpAdminSuspendedUserRepository';

const repo = new HttpAdminSuspendedUserRepository();

export function useAdminSuspendedUsers() {
  const [users, setUsers] = useState<SuspendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repo.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios suspendidos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reactivateUser = async (userId: string) => {
    await repo.reactivateUser(userId);
    await load(); // refrescar lista
  };

  return { users, isLoading, error, reactivateUser, reload: load };
}