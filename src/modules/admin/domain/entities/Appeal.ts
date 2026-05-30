// src/modules/admin/domain/entities/Appeal.ts

export interface Appeal {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  motivo: string;
  fechaApelacion: string;
  estadoCuenta: string; // 'restringido' o 'suspendido'
  estadoApelacion: 'pendiente' | 'aprobada' | 'rechazada';
  fechaResolucion?: string;
  adminId?: string;
}
