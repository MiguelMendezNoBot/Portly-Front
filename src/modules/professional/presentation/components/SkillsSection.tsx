import { useState } from 'react';
import { useSkills } from '../../application/useSkills';
import { Skill, SkillLevel } from '../../domain/entities/Skill';
import SkillCard from './Skills/SkillCard';
import SkillFormModal from './Skills/SkillFormModal';
import DeleteSkillConfirmModal from './Skills/DeleteSkillConfirmModal';
import { PlusIcon } from './icons'; // Asumo existe, si no usar SVG inline

export default function SkillsSection() {
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

  if (loading) {
    return (
      <div className="bg-src-1a1a2e p-8 rounded-2xl border border-white/5 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-src-6b72ff border-t-transparent"></div>
        <p className="text-src-9ca3af mt-4">Cargando habilidades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y botón agregar */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-semibold">
          Habilidades técnicas
        </h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-src-6b72ff hover:bg-src-585fe6 text-white font-medium transition-colors shadow-md"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar habilidad
        </button>
      </div>

      {/* Lista de habilidades */}
      {skills.length === 0 ? (
        <div className="bg-src-1a1a2e p-12 rounded-2xl border border-white/5 text-center">
          <p className="text-src-9ca3af">
            Aún no has agregado habilidades técnicas.
          </p>
          <p className="text-src-6b7280 text-sm mt-2">
            Haz clic en "Agregar habilidad" para comenzar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() => handleEditClick(skill)}
              onDelete={() => handleDeleteClick(skill)}
            />
          ))}
        </div>
      )}

      {/* Modal de agregar/editar */}
      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
        initialData={editingSkill}
        isSaving={isSaving}
      />

      {/* Modal de confirmación eliminar */}
      <DeleteSkillConfirmModal
        isOpen={!!deletingSkill}
        onClose={() => setDeletingSkill(null)}
        onConfirm={handleConfirmDelete}
        skillName={deletingSkill?.name || ''}
        isLoading={isDeleting} // Añadir esta prop al componente
      />
    </div>
  );
}
