import { SkillLevel } from './entities/Skill';

export const SKILL_LEVELS: SkillLevel[] = [
  'Básico',
  'Intermedio',
  'Avanzado',
  'Maestro',
  'Experto',
];

export const LEVEL_DESCRIPTIONS: Record<SkillLevel, string> = {
  Básico:
    'indica que conoces los fundamentos teóricos y has realizado ejercicios prácticos iniciales.',
  Intermedio:
    'indica que puedes construir funcionalidades autónomas y resolver problemas técnicos comunes.',
  Avanzado:
    'indica que dominas patrones de diseño complejos y puedes optimizar el rendimiento de aplicaciones.',
  Maestro:
    'indica que posees un dominio total de la herramienta, contribuyes a su ecosistema o puedes mentorizar a otros expertos.',
  Experto: 'indica que has liderado proyectos complejos con esta tecnología.',
};

// Catálogo predefinido de habilidades (simulado)
export const PREDEFINED_SKILLS: string[] = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Docker',
  'Kubernetes',
  'AWS',
  'MongoDB',
  'PostgreSQL',
  'GraphQL',
  'Tailwind CSS',
  'Figma',
  'Scrum',
  'Otro', // Esta opción habilita el input libre
];
