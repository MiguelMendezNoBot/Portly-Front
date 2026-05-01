export type TemplateSectionType =
  | 'hero'
  | 'about'
  | 'skills'
  | 'softskills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'contact';

export interface TemplateSection {
  type: TemplateSectionType;
  title?: string;
  visible: boolean;
  order: number;
}

export interface TemplateSchema {
  sections: TemplateSection[];
  colorScheme: string;
  fontFamily: string;
}

export interface Template {
  id: string;
  nombre: string;
  descripcion: string;
  tags: string[];
  previewImageUrl: string;
  previewUrl?: string;
  stats: {
    secciones: number;
    impacto: string;
    tiempoConfiguracion: string;
  };
  schema: TemplateSchema;
}
