export interface ComplaintItem {
  id: number;
  reason: string;
  description: string;
  createdAt: string;
  reportedBy: string;
  reporterName?: string;
  reporterAvatar?: string;
}

export interface Revision {
  resultado: string;
  fecha: string;
  adminId: string;
}

export interface ComplaintGroup {
  id: number;
  portfolioId: string;
  portfolioTitle: string;
  portfolioPublicUrl: string;
  ownerUserId: string;
  ownerUserName: string;
  ownerUserStatus: 'activo' | 'suspendido' | 'restringido';
  status: 'pendiente' | 'revisado';
  complaints: ComplaintItem[];
  revision: Revision | null;
}

export interface Suspension {
  id?: number;
  userId: string;
  motivo: string;
  fechaSuspension: string;
  adminId: string;
  motivoCancelacion: string | null;
}
