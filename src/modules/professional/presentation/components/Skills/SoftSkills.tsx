import { useState } from 'react';
import SoftSkillsModal, { SOFT_SKILLS_CATALOG } from './SoftSkillsModal';
import { useSoftSkills } from '../../../application/useSoftSkills';
import DeleteSkillConfirmModal from './DeleteSkillConfirmModal';

type ActionMode = 'delete' | null;

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

export const SoftSkills = () => {
  const { skills, loading, addSkill, deleteSkill } = useSoftSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ActionMode>(null);
  
  // For deletion modal
  const [deletingSkill, setDeletingSkill] = useState<{ id: number, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddSkill = async (skillName: string) => {
    try {
      await addSkill({ nombreHabilidad: skillName });
    } catch (error) {
      console.error("Error al añadir habilidad blanda:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSkill) return;
    setIsDeleting(true);
    try {
      await deleteSkill(deletingSkill.id);
      setDeletingSkill(null);
      setMode(null);
    } catch (error) {
      console.error("Error al eliminar habilidad blanda:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /** Busca el ícono asignado en el catálogo */
  const getIcon = (skillName: string) => {
    const found = SOFT_SKILLS_CATALOG.find((s) => s.name === skillName);
    return found?.icon ?? null;
  };

  return (
    <>
      <section className="lg:col-span-4 bg-[#171B28] rounded-3xl p-6 border border-white/5 h-fit self-start space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight">
              Habilidades blandas
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              Rasgos de personalidad y comunicación.
            </p>
          </div>
          {loading ? null : (
            <div className="text-[#C9BEFF] text-xs">
              {skills.length} Activas
            </div>
          )}
        </div>

        {/* Barra de acciones */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={() => {
              setMode(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-4 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar
          </button>

          {skills.length > 0 && (
            <button
              onClick={() => setMode(prev => (prev === 'delete' ? null : 'delete'))}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                mode === 'delete'
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : 'border-white/10 text-[#9ca3af] hover:text-red-400 hover:border-red-500/20'
              }`}
            >
              <TrashIcon />
              Eliminar
            </button>
          )}
        </div>

        {/* Indicador de modo activo */}
        {mode === 'delete' && skills.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-red-500/10 border-red-500/20 text-red-400">
            <TrashIcon />
            <span>Da click a un ítem para eliminarlo</span>
            <button
              onClick={() => setMode(null)}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Lista apilada de habilidades */}
        {loading ? (
          <div className="text-center p-8 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
            <p className="text-[#9ca3af] text-sm animate-pulse">Cargando habilidades...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
            <h4 className="text-white text-lg font-bold mb-2">
              No tienes Habilidades Blandas.
            </h4>
            <p className="text-[#9ca3af] text-sm mb-6">
              Agrega tus habilidades blandas para destacar tu perfil ante los
              reclutadores. Cuantas más habilidades relevantes agregues, más
              atractivo será tu perfil.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {skills.map((skill) => {
              const icon = getIcon(skill.nombreHabilidad);
              const isDeleteMode = mode === 'delete';
              return (
                <div
                  key={skill.id}
                  onClick={() => {
                    if (isDeleteMode && skill.id) {
                      setDeletingSkill({ id: skill.id, name: skill.nombreHabilidad });
                    }
                  }}
                  className={`group flex items-center justify-between py-3 px-2 first:pt-2 last:pb-2 transition-all duration-200 ${
                    isDeleteMode 
                      ? 'cursor-pointer hover:bg-red-500/10 rounded-lg'
                      : ''
                  }`}
                >
                  {/* Ícono del catálogo + nombre */}
                  <div className="flex items-center gap-3">
                    <span className={`flex-shrink-0 transition-colors duration-200 ${
                      isDeleteMode ? 'text-[#6b72ff] group-hover:text-red-400' : 'text-[#6b72ff] group-hover:text-[#a092ec]'
                    }`}>
                      {icon}
                    </span>
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      isDeleteMode ? 'text-[#d1d5db] group-hover:text-red-300' : 'text-[#d1d5db] group-hover:text-white'
                    }`}>
                      {skill.nombreHabilidad}
                    </span>
                  </div>

                  {/* Icono de papelera en la derecha en modo eliminar (siempre visible) */}
                  {isDeleteMode && (
                    <span className="text-red-400 mr-2">
                      <TrashIcon />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <SoftSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSkill}
        existingSkills={skills.map(s => s.nombreHabilidad)}
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
