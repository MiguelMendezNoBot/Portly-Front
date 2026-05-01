export interface Portfolio {
  id: string;
  nombre: string;
  visibilidad: 'PUBLICO' | 'PRIVADO';
  templateId: string;
  publicUrl: string;
  previewImageUrl?: string;
  createdAt: string;
}

export interface CreatePortfolioDto {
  templateId: string;
  nombre: string;
  visibilidad: 'PUBLICO' | 'PRIVADO';
}
