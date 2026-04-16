export type SkillLevel =
  | 'Básico'
  | 'Intermedio'
  | 'Avanzado'
  | 'Maestro'
  | 'Experto';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  // Opcional: campo para indicar si fue creada por el usuario (no del catálogo)
  isCustom?: boolean;
}

// DTO para crear/actualizar
export interface SkillPayload {
  name: string;
  level: SkillLevel;
}
