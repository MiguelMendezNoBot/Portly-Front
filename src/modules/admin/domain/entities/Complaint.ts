
export interface ComplaintItem {
  id: number;
  reason: string;
  description: string;
  createdAt: string;
  reportedBy: string;
}

export interface Revision {
  resultado: string;
  fecha: string;
  adminId: string;
}

export interface ComplaintGroup {
  id: number;
  portfolioId: number;
  portfolioTitle: string;
  portfolioPublicUrl: string;
  ownerUserId: number;
  ownerUserName: string;
  ownerUserStatus: 'activo' | 'suspendido';
  status: 'pendiente' | 'revisado';
  complaints: ComplaintItem[];
  revision: Revision | null;
}

export interface Suspension {
  id?: number;
  userId: number;
  motivo: string;
  fechaSuspension: string;
  adminId: string;
  motivoCancelacion: string | null;
}