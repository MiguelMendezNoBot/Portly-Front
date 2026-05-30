// src/modules/admin/infrastructure/repositories/HttpAppealRepository.ts

import { Appeal } from '../../domain/entities/Appeal';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/admin';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export class HttpAppealRepository {
  async getAll(): Promise<Appeal[]> {
    const res = await fetch(`${BASE_URL}/apelaciones`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener apelaciones');
    return res.json();
  }

  async getById(id: number): Promise<Appeal> {
    const res = await fetch(`${BASE_URL}/apelaciones/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener detalle de apelación');
    return res.json();
  }

  async approve(id: number, adminId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/apelaciones/${id}/aprobar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ adminId }),
    });
    if (!res.ok) throw new Error('Error al aprobar apelación');
    return res.json();
  }

  async reject(id: number, adminId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/apelaciones/${id}/rechazar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ adminId }),
    });
    if (!res.ok) throw new Error('Error al rechazar apelación');
    return res.json();
  }
}
