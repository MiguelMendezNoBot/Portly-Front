export interface PortfolioItemVisibilidad {
  showProjects?: boolean;
  techSkillItems?: Record<string, boolean>;
  softSkillItems?: Record<string, boolean>;
  experienceItems?: Record<string, boolean>;
  educationItems?: Record<string, boolean>;
  projectItems?: Record<string, boolean>;
}

export interface Portfolio {
  id: string;
  nombre: string;
  visibilidad: 'PUBLICO' | 'PRIVADO';
  templateId: string;
  publicUrl: string;
  previewImageUrl?: string;
  createdAt: string;
  itemVisibilidad?: PortfolioItemVisibilidad;
}

export interface CreatePortfolioDto {
  templateId: string;
  nombre: string;
  visibilidad: 'PUBLICO' | 'PRIVADO';
}

export interface UpdateVisibilidadDto {
  showProjects?: boolean;
  techSkillItems?: Record<string, boolean>;
  softSkillItems?: Record<string, boolean>;
  experienceItems?: Record<string, boolean>;
  educationItems?: Record<string, boolean>;
  projectItems?: Record<string, boolean>;
}
