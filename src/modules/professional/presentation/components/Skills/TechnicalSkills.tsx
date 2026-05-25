import { useState } from 'react';
import { useSkills } from '../../../application/useSkills';
import { Skill, SkillLevel } from '../../../domain/entities/Skill';
import SkillCard from '../Skills/SkillCard';
import SkillFormModal from '../Skills/SkillFormModal';
import DeleteSkillConfirmModal from '../Skills/DeleteSkillConfirmModal';
import SkillCardSkeleton from './SkillCardSkeleton';
import ViewSkillsModal from './ViewSkillsModal'; // nuevo modal

type ActionMode = 'edit' | 'delete' | null;

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const TechnicalSkills = () => {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(
    undefined
  );
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mode, setMode] = useState<ActionMode>(null);
  const [showViewModal, setShowViewModal] = useState(false); // para visualizar

  const handleOpenAdd = () => {
    setMode(null);
    setEditingSkill(undefined);
    setIsModalOpen(true);
  };

  const toggleMode = (newMode: 'edit' | 'delete') => {
    setMode((prev) => (prev === newMode ? null : newMode));
    if (newMode === 'delete' || newMode !== 'edit') {
      setEditingSkill(undefined);
    }
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
      setMode(null);
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
      setMode(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="lg:col-span-7 space-y-6 p-6 rounded-2xl">
        {/* Cabecera */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight">
              Habilidades técnicas
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              Consolida y gestiona tu stack tecnológico.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            {/* Agregar */}
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-4 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar
            </button>

            {skills.length > 0 && (
              <>
                {/* Visualizar */}
                <button
                  onClick={() => setShowViewModal(true)}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Visualizar
                </button>

                <button
                  onClick={() => toggleMode('edit')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                    mode === 'edit'
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20'
                  }`}
                >
                  <EditIcon />
                  Editar
                </button>

                <button
                  onClick={() => toggleMode('delete')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                    mode === 'delete'
                      ? 'bg-red-500/15 border-red-500/40 text-red-400'
                      : 'border-white/10 text-[#9ca3af] hover:text-red-400 hover:border-red-500/20'
                  }`}
                >
                  <TrashIcon />
                  Eliminar
                </button>
              </>
            )}
          </div>
        </header>

        {/* Indicador de modo activo */}
        {mode && skills.length > 0 && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border ${
              mode === 'edit'
                ? 'bg-white/5 border-white/10 text-[#9ca3af]'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {mode === 'edit' ? <EditIcon /> : <TrashIcon />}
            <span>
              {mode === 'edit'
                ? 'Da click a un ítem para editarlo'
                : 'Da click a un ítem para eliminarlo'}
            </span>
            <button
              onClick={() => setMode(null)}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SkillCardSkeleton />
            <SkillCardSkeleton />
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
            <h4 className="text-white text-lg font-bold mb-2">
              No tienes Habilidades Técnicas.
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
                mode={mode}
                onEdit={() => handleEditClick(skill)}
                onDelete={() => handleDeleteClick(skill)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modales */}
      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (mode !== 'edit') setEditingSkill(undefined);
        }}
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

      <ViewSkillsModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        skills={skills}
      />
    </>
  );
};
