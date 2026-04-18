import { useState } from 'react';
import SoftSkillsModal, { SOFT_SKILLS_CATALOG } from './SoftSkillsModal';
import { useSoftSkills } from '../../../application/useSoftSkills';

export const SoftSkills = () => {
  const { skills, loading, addSkill, deleteSkill } = useSoftSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSkills = async (finalSelectedSkills: string[]) => {
    const currentSkillNames = skills.map((s) => s.nombreHabilidad);
    
    // Skills to add
    const toAdd = finalSelectedSkills.filter((name) => !currentSkillNames.includes(name));
    
    // Skills to remove
    const toRemoveNames = currentSkillNames.filter((name) => !finalSelectedSkills.includes(name));
    const toRemoveIds = skills
      .filter((s) => toRemoveNames.includes(s.nombreHabilidad))
      .map((s) => s.id!);

    // Disparar las solicitudes en paralelo
    const addPromises = toAdd.map((skillName) => {
      return addSkill({ nombreHabilidad: skillName }).catch((error) => {
        console.error("Error al añadir habilidad blanda:", error);
      });
    });

    const removePromises = toRemoveIds.map((id) => {
      return deleteSkill(id).catch((error) => {
        console.error("Error al eliminar habilidad blanda:", error);
      });
    });
    
    await Promise.all([...addPromises, ...removePromises]);
  };

  const handleRemoveSkill = async (id: number) => {
    try {
      await deleteSkill(id);
    } catch (error) {
      console.error("Error al eliminar habilidad blanda:", error);
    }
  };

  /** Busca el ícono asignado en el catálogo */
  const getIcon = (skillName: string) => {
    const found = SOFT_SKILLS_CATALOG.find((s) => s.name === skillName);
    return found?.icon ?? null;
  };

  return (
    <>
      <section className="lg:col-span-4 bg-[#171B28] rounded-3xl p-8 border border-white/5 h-fit self-start">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight">
              Habilidades blandas
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              Rasgos de personalidad y habilidades de comunicación.
            </p>
          </div>

          {/* Botón "+" */}
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Agregar habilidad blanda"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1e213a] border border-white/10 flex items-center justify-center text-[#9ca3af] hover:bg-[#6b72ff]/20 hover:text-white hover:border-[#6b72ff]/50 transition-all duration-200 active:scale-95 shadow-md mt-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
          </button>
        </div>

        {/* Lista apilada de habilidades */}
        {loading ? (
          <div className="text-center p-8 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
            <p className="text-[#9ca3af] text-sm animate-pulse">Cargando habilidades...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center p-8 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
            <p className="text-[#9ca3af] text-sm">
              Agrega tus habilidades blandas para destacar tu perfil.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {skills.map((skill) => {
              const icon = getIcon(skill.nombreHabilidad);
              return (
                <div
                  key={skill.id}
                  className="group flex items-center justify-between py-3 first:pt-0 last:pb-0 transition-all duration-200"
                >
                  {/* Ícono del catálogo + nombre */}
                  <div className="flex items-center gap-3">
                    <span className="text-[#6b72ff] flex-shrink-0 group-hover:text-[#a092ec] transition-colors duration-200">
                      {icon}
                    </span>
                    <span className="text-[#d1d5db] text-sm font-medium group-hover:text-white transition-colors duration-200">
                      {skill.nombreHabilidad}
                    </span>
                  </div>

                  {/* Botón eliminar - aparece al hover */}
                  <button
                    onClick={() => handleRemoveSkill(skill.id!)}
                    aria-label={`Eliminar ${skill.nombreHabilidad}`}
                    className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-full bg-white/5 hover:bg-red-500/20 text-[#6b7280] hover:text-red-400 transition-all duration-200 flex-shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <path d="M18 6l-12 12" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <SoftSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSkills}
        existingSkills={skills.map(s => s.nombreHabilidad)}
      />
    </>
  );
};
