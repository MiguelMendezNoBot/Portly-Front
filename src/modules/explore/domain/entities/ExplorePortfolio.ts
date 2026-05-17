export interface ExplorePortfolioPropietario {
  nombre: string;
  apellido: string;
  profesion?: string;
  descripcion?: string;
  avatarUrl?: string;
}

export interface ExplorePortfolio {
  id: string;
  nombre: string;
  templateNombre: string;
  previewImageUrl?: string;
  propietario: ExplorePortfolioPropietario;
  createdAt: string;
}

export interface ExploreSearchParams {
  q?: string;
  sort?: 'recientes' | 'nombre';
  page?: number;
  limit?: number;
}

export interface ExploreSearchResult {
  portfolios: ExplorePortfolio[];
  total: number;
  page: number;
  totalPages: number;
}
