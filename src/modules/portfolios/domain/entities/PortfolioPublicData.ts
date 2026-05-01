import type { TemplateSchema } from './Template';

export interface PortfolioPublicUser {
  nombre: string;
  apellido: string;
  profesion?: string;
  descripcion?: string;
  avatarUrl?: string;
  email?: string;
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
  fechaInicio: string;
  fechaFin: string | null;
  actualmenteTrabajando: boolean;
  descripcion: string;
}

export interface PortfolioPublicProject {
  id?: number;
  nombre: string;
  descripcionCorta: string;
  descripcionDetallada: string;
  tecnologias: string[];
  urlDemo: string;
  iconoUrl: string | null;
}

export interface PortfolioPublicFormacion {
  idFormacionAcademica?: number;
  institucion: string;
  carrera: string;
  fechaInicio: string;
  fechaFinalizacion: string | null;
  actualmenteEstudiando: boolean;
  nivel: string;
}

export interface PortfolioPublicData {
  id: string;
  nombre: string;
  visibilidad: string;
  templateNombre: string;
  templateSchema: TemplateSchema;
  usuario: PortfolioPublicUser;
  skills: PortfolioPublicSkill[];
  softSkills: PortfolioPublicSoftSkill[];
  experiencias: PortfolioPublicExperience[];
  proyectos: PortfolioPublicProject[];
  formaciones: PortfolioPublicFormacion[];
}
