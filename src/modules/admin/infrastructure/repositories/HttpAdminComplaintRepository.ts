// src/modules/admin/infrastructure/repositories/HttpAdminComplaintRepository.ts

import { ComplaintGroup, Revision, Suspension } from "../../domain/entities/Complaint";

const BASE_URL = 'http://localhost:8000/admin';

export class HttpAdminComplaintRepository {
  async getAll(): Promise<ComplaintGroup[]> {
    const res = await fetch(`${BASE_URL}/denuncias`);
    if (!res.ok) throw new Error('Error al obtener denuncias');
    return res.json();
  }

  async getById(id: number): Promise<ComplaintGroup> {
    const res = await fetch(`${BASE_URL}/denuncias/${id}`);
    if (!res.ok) throw new Error('Error al obtener detalle de denuncia');
    return res.json();
  }

  async updateStatus(id: number, data: { status: string; revision?: Revision }): Promise<ComplaintGroup> {
    const res = await fetch(`${BASE_URL}/denuncias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return res.json();
  }

  // Ahora solo recibe motivo, sin duración
  async createSuspension(suspension: Omit<Suspension, 'id'>): Promise<Suspension> {
    const res = await fetch(`${BASE_URL}/suspensiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(suspension),
    });
    if (!res.ok) throw new Error('Error al crear suspensión');
    return res.json();
  }

  async updateDenunciasByUser(userId: number, ownerUserStatus: string): Promise<void> {
    const all = await this.getAll();
    const denunciasToUpdate = all.filter(d => d.ownerUserId === userId);
    await Promise.all(
      denunciasToUpdate.map(d =>
        fetch(`${BASE_URL}/denuncias/${d.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerUserStatus }),
        })
      )
    );
  }
}