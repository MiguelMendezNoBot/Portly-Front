import { TechnicalSkills } from './Skills/TechnicalSkills';

export default function SkillsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 max-w-7xl mx-auto">
      {/* SECCIÓN TÉCNICA*/}
      <TechnicalSkills />

      {/* SECCIÓN DEV 2 (PLACEHOLDER) */}
      <section className="lg:col-span-4 bg-[#0f111a] rounded-3xl p-8 border border-white/5 h-fit self-start">
        <h2 className="text-white text-xl font-bold mb-4">
          Habilidades blandas
        </h2>
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
          <span className="text-[#6b7280] font-mono text-xs uppercase tracking-[0.2em] mb-2">
            Dev 2 Area
          </span>
          <p className="text-[#4b5563] text-center text-sm px-4">
            Espacio reservado para la gestión de soft skills.
          </p>
        </div>
      </section>
    </div>
  );
}
