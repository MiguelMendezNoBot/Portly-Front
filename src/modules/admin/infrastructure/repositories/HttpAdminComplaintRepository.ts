// src/modules/admin/infrastructure/repositories/HttpAdminComplaintRepository.ts

import { ComplaintGroup, Revision, Suspension } from "../../domain/entities/Complaint";

const BASE_URL = 'http://localhost:8080/api/admin';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export class HttpAdminComplaintRepository {
  async getAll(): Promise<ComplaintGroup[]> {
    const res = await fetch(`${BASE_URL}/denuncias`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener denuncias');
    return res.json();
  }

  async getById(id: number): Promise<ComplaintGroup> {
    const res = await fetch(`${BASE_URL}/denuncias/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener detalle de denuncia');
    return res.json();
  }

  async updateStatus(id: number, data: { status: string; revision?: Revision }): Promise<ComplaintGroup> {
    const res = await fetch(`${BASE_URL}/denuncias/${id}/revisar`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ resultado: data.revision?.resultado || '' }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return res.json();
  }

  async createSuspension(suspension: Omit<Suspension, 'id'>): Promise<Suspension> {
    const res = await fetch(`${BASE_URL}/usuarios/${suspension.userId}/suspender`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ motivo: suspension.motivo }),
    });
    if (!res.ok) throw new Error('Error al crear suspensión');
    return res.json().then(data => data.suspension);
  }

  async updateDenunciasByUser(userId: string, ownerUserStatus: string): Promise<void> {
    // Ya no es necesario que el frontend haga esto, el backend lo maneja en la transacción de suspensión.
    // Dejamos el método vacío para no romper interfaces si existen, o simplemente un return vacío.
    return Promise.resolve();
  }
}