export interface Project {
  id?: number;
  nombre: string;
  descripcionCorta: string;
  descripcionDetallada: string;
  fechaInicio: string;
  fechaFin: string | null;
  esActual: boolean;
  tecnologias: string[];
  visibilidad: 'publico' | 'privado';
  iconoUrl: string | null;
  evidencias: ProjectEvidence[];
  enlaces: ProjectLink[];
}

export interface ProjectLink {
  titulo: string;
  url: string;
}

export interface ProjectEvidence {
  id?: number;
  nombre: string;
  url: string;
  tipo: string;
  pesoBytes: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  languages: string[];
  topics: string[];
}
