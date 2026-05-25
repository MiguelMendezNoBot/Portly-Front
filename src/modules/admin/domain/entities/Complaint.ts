export interface DenunciaIndividual {
  id: number;
  reason: string;
  description: string;
  createdAt: string; // ISO string o formato DD/MM/YYYY, lo trataremos como string
  reportedBy: string;
}

export interface DenunciaAgrupada {
  id: number;
  portfolioId: number;
  portfolioTitle: string;
  ownerUserId: number;
  ownerUserName: string;
  complaintCount: number;
  latestReason: string;
  status: 'pendiente' | 'revisado' | 'suspendido';
  complaints: DenunciaIndividual[];
}