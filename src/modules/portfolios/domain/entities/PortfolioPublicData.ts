import type { TemplateSchema } from './Template';

export interface PortfolioPublicUser {
  nombre: string;
  apellido: string;
  profesion?: string;
  descripcion?: string;
  avatarUrl?: string;
  email?: string;
  telefono?: string;
  pais?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  github?: string;
}

export interface PortfolioPublicSkill {
  id: string;
  name: string;
  level: string;
}

export interface PortfolioPublicSoftSkill {
  id: number;
  nombreHabilidad: string;
}

export interface PortfolioPublicExperience {
  id?: number;
  nombreEmpresa: string;
  cargo: string;
  modalidadTrabajo?: string;
  fechaInicio: string;
  fechaFin: string | null;
  actualmenteTrabajando: boolean;
  descripcion: string;
  funcionesPrincipales?: string[];
  logros?: string[];
  correoJefe?: string;
  numeroJefe?: string;
  cargoJefe?: string;
}

export interface PortfolioPublicEnlace {
  titulo: string;
  url: string;
}

export interface PortfolioPublicDocumento {
  id: number;
  nombre: string;
  urlDescarga: string;
  formato: string;
  pesoBytes: number;
}

export interface PortfolioPublicProject {
  id?: number;
  nombre: string;
  descripcionCorta: string;
  descripcionDetallada: string;
  tecnologias: string[];
  urlDemo: string;
  iconoUrl: string | null;
  evidencias?: string[];
  enlaces?: PortfolioPublicEnlace[];
  documentos?: PortfolioPublicDocumento[];
}

export interface PortfolioPublicFormacion {
  idFormacionAcademica?: number;
  institucion: string;
  carrera: string;
  fechaInicio: string;
  fechaFinalizacion: string | null;
  actualmenteEstudiando: boolean;
  nivel: string;
  descripcion?: string;
}

export interface PortfolioPublicData {
  id: string;
  nombre: string;
  visibilidad: string;
  templateNombre: string;
  templateSchema: TemplateSchema;
  hasPendingReport?: boolean;
  usuario: PortfolioPublicUser;
  skills: PortfolioPublicSkill[];
  softSkills: PortfolioPublicSoftSkill[];
  experiencias: PortfolioPublicExperience[];
  proyectos: PortfolioPublicProject[];
  formaciones: PortfolioPublicFormacion[];
}
