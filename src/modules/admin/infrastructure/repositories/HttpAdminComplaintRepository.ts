import { DenunciaAgrupada } from "../../domain/entities/Complaint";

const BASE_URL = 'http://localhost:8000/admin';

export class HttpAdminDenunciaRepository {
  async getAll(): Promise<DenunciaAgrupada[]> {
    const res = await fetch(`${BASE_URL}/denuncias`);
    if (!res.ok) throw new Error('Error al obtener denuncias');
    return res.json();
  }

  async getById(id: number): Promise<DenunciaAgrupada> {
    const res = await fetch(`${BASE_URL}/denuncias/${id}`);
    if (!res.ok) throw new Error('Error al obtener detalle de denuncia');
    return res.json();
  }

  async updateStatus(id: number, status: string): Promise<DenunciaAgrupada> {
    const res = await fetch(`${BASE_URL}/denuncias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return res.json();
  }
}