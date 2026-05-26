// src/modules/admin/infrastructure/repositories/HttpAdminSuspendedUserRepository.ts

import { SuspendedUser } from '../../domain/entities/SuspendedUser';

const BASE = 'http://localhost:8080/api/admin';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export class HttpAdminSuspendedUserRepository {
  async getAll(): Promise<SuspendedUser[]> {
    const res = await fetch(`${BASE}/usuarios-suspendidos`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener usuarios suspendidos');
    return res.json();
  }

  async reactivateUser(userId: string): Promise<void> {
    const res = await fetch(`${BASE}/usuarios/${userId}/reactivar`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al reactivar usuario');
  }
}