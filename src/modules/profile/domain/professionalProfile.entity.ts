export interface ProfessionalProfile {
  id: string;
  etiqueta: string;
  titularProfesional: string;
  acercaDeMi: string;
  fotoUrl?: string;
}

export interface CreateProfessionalProfileDTO {
  etiqueta: string;
  titularProfesional?: string;
  acercaDeMi?: string;
  fotoUrl?: string;
}

export type UpdateProfessionalProfileDTO = CreateProfessionalProfileDTO;
