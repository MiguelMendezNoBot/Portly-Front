import { TechnicalSkills } from './Skills/TechnicalSkills';
import { SoftSkills } from './Skills/SoftSkills';

export default function SkillsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 max-w-7xl mx-auto">
      {/* SECCIÓN TÉCNICA */}
      <TechnicalSkills />

      {/* SECCIÓN HABILIDADES BLANDAS */}
      <SoftSkills />
    </div>
  );
}
