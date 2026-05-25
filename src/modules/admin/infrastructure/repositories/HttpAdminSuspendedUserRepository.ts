// src/modules/admin/infrastructure/repositories/HttpAdminSuspendedUserRepository.ts

import { SuspendedUser } from '../../domain/entities/SuspendedUser';

const BASE = 'http://localhost:8000/admin';

export class HttpAdminSuspendedUserRepository {
  async getAll(): Promise<SuspendedUser[]> {
    const res = await fetch(`${BASE}/usuarios-suspendidos`);
    if (!res.ok) throw new Error('Error al obtener usuarios suspendidos');
    return res.json();
  }

  async reactivateUser(userId: number): Promise<void> {
    // 1. Obtener la suspensión activa (sin motivoCancelacion)
    const suspensionesRes = await fetch(`${BASE}/suspensiones?userId=${userId}&motivoCancelacion=`);
    if (!suspensionesRes.ok) throw new Error('Error al buscar suspensión activa');
    const suspensiones: any[] = await suspensionesRes.json();
    if (suspensiones.length === 0) throw new Error('No se encontró una suspensión activa para este usuario');

    const suspensionActiva = suspensiones[0];

    // 2. Eliminar la suspensión
    const deleteRes = await fetch(`${BASE}/suspensiones/${suspensionActiva.id}`, { method: 'DELETE' });
    if (!deleteRes.ok) throw new Error('Error al eliminar la suspensión');

    // 3. Actualizar todas las denuncias del usuario a "activo"
    const denunciasRes = await fetch(`${BASE}/denuncias`);
    if (!denunciasRes.ok) throw new Error('Error al obtener denuncias');
    const denuncias: any[] = await denunciasRes.json();

    const denunciasDelUsuario = denuncias.filter(d => d.ownerUserId === userId);
    await Promise.all(
      denunciasDelUsuario.map(d =>
        fetch(`${BASE}/denuncias/${d.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerUserStatus: 'activo' }),
        })
      )
    );
  }
}