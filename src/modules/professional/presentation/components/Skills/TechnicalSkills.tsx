import { useState } from 'react';
import { useSkills } from '../../../application/useSkills';
import { Skill, SkillLevel } from '../../../domain/entities/Skill';
import SkillCard from '../Skills/SkillCard';
import SkillFormModal from '../Skills/SkillFormModal';
import DeleteSkillConfirmModal from '../Skills/DeleteSkillConfirmModal';
import { PlusIcon } from '../icons'; // Asumo existe, si no usar SVG inline
import SkillCardSkeleton from './SkillCardSkeleton';

export const TechnicalSkills = () => {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(
    undefined
  );
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleAddClick = () => {
    setEditingSkill(undefined);
    setIsModalOpen(true);
  };
  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };
  const handleDeleteClick = (skill: Skill) => {
    setDeletingSkill(skill);
  };

  const handleSaveSkill = async (name: string, level: SkillLevel) => {
    setIsSaving(true);
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, { name, level });
      } else {
        await addSkill({ name, level });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSkill) return;
    setIsDeleting(true);
    try {
      await deleteSkill(deletingSkill.id);
      setDeletingSkill(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="lg:col-span-7 space-y-6 bg-[#171B28] p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight">
              Habilidades técnicas
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              Consolida y gestiona tu stack tecnológico.
            </p>
          </div>
          {loading ? null : (
            <div className="text-[#C9BEFF] text-xs">
              {skills.length} Activas
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Renderizamos varios skeletons para llenar el espacio */}
            <SkillCardSkeleton />
            <SkillCardSkeleton />
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
            <h4 className="text-white text-lg font-bold mb-2">
              No tienes Habilidades Tecnicas.
            </h4>
            <p className="text-[#9ca3af] text-sm mb-6">
              Agrega tus habilidades técnicas para destacar tu perfil ante los
              reclutadores. Cuantas más habilidades relevantes agregues, más
              atractivo será tu perfil.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={() => handleEditClick(skill)}
                onDelete={() => setDeletingSkill(skill)}
              />
            ))}
          </div>
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleAddClick}
            className="bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:bg-[#5a52d5] text-[#0D0096] py-3 px-8 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm"
          >
            AGREGAR HABILIDAD
          </button>
        </div>
      </section>

      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
        initialData={editingSkill}
        isSaving={isSaving}
      />

      <DeleteSkillConfirmModal
        isOpen={!!deletingSkill}
        onClose={() => setDeletingSkill(null)}
        onConfirm={handleConfirmDelete}
        skillName={deletingSkill?.name || ''}
        isLoading={isDeleting}
      />
    </>
  );
};
