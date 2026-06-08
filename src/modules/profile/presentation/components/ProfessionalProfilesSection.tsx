import { useState } from 'react';
import { useProfessionalProfiles } from '../../application/useProfessionalProfiles';
import type {
  ProfessionalProfile,
  CreateProfessionalProfileDTO,
} from '../../domain/professionalProfile.entity';
import ProfessionalProfileFormModal from './ProfessionalProfileFormModal';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';

type ActionMode = 'edit' | 'delete' | null;

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function ProfessionalProfilesSection() {
  const {
    profiles,
    loading,
    addProfile,
    updateProfile,
    deleteProfile,
    uploadPhoto,
  } = useProfessionalProfiles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProfessionalProfile | undefined>();
  const [deleting, setDeleting] = useState<ProfessionalProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mode, setMode] = useState<ActionMode>(null);

  const handleOpenAdd = () => {
    setMode(null);
    setEditing(undefined);
    setIsModalOpen(true);
  };

  const toggleMode = (newMode: 'edit' | 'delete') => {
    setMode((prev) => (prev === newMode ? null : newMode));
  };

  const handleCardClick = (profile: ProfessionalProfile) => {
    if (mode === 'edit') {
      setEditing(profile);
      setIsModalOpen(true);
    } else if (mode === 'delete') {
      setDeleting(profile);
    }
  };

  const handleSave = async (dto: CreateProfessionalProfileDTO) => {
    setIsSaving(true);
    try {
      if (editing) {
        await updateProfile(editing.id, dto);
      } else {
        await addProfile(dto);
      }
      setMode(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteProfile(deleting.id);
      setDeleting(null);
      setMode(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="space-y-6 p-6 rounded-2xl">
        {/* Cabecera */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight">
              Mis perfiles profesionales
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              Crea identidades distintas y elige una al crear cada portafolio.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-4 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar
            </button>

            {profiles.length > 0 && (
              <>
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
        {mode && profiles.length > 0 && (
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
                ? 'Da click a un perfil para editarlo'
                : 'Da click a un perfil para eliminarlo'}
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
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-2 border-[#6b72ff]/30 border-t-[#6b72ff] rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
            <h4 className="text-white text-lg font-bold mb-2">
              Aún no tienes perfiles profesionales.
            </h4>
            <p className="text-[#9ca3af] text-sm">
              Crea distintas identidades (titular, descripción y foto) y elige
              cuál mostrar al crear cada portafolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profiles.map((profile) => {
              const borderClass =
                mode === null
                  ? 'border-white/5'
                  : mode === 'edit'
                    ? 'border-[#6b72ff]/40 hover:border-[#6b72ff]/70 cursor-pointer'
                    : 'border-red-500/40 hover:border-red-500/70 cursor-pointer';
              return (
                <div
                  key={profile.id}
                  onClick={() => handleCardClick(profile)}
                  className={`relative group bg-[#1a1a2e] rounded-2xl border transition-all duration-300 shadow-md flex items-center gap-3 p-4 ${borderClass}`}
                >
                  {mode && (
                    <div
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${
                        mode === 'edit'
                          ? 'bg-[#6b72ff]/20 text-[#C9BEFF]'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {mode === 'edit' ? <EditIcon /> : <TrashIcon />}
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0d1117] border border-white/10 flex items-center justify-center shrink-0">
                    {profile.fotoUrl ? (
                      <img src={profile.fotoUrl} alt={profile.etiqueta} className="w-full h-full object-cover" />
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21a7.5 7.5 0 0113 0" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{profile.etiqueta}</h3>
                    <p className="text-[#a7aab9] text-xs truncate">
                      {profile.titularProfesional || 'Sin titular'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ProfessionalProfileFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (mode !== 'edit') setEditing(undefined);
        }}
        onSave={handleSave}
        onUploadPhoto={uploadPhoto}
        initialData={editing}
        isSaving={isSaving}
        existingRecords={profiles}
      />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar perfil profesional?"
        description={`Se eliminará "${deleting?.etiqueta ?? ''}". Los portafolios que lo usaban volverán a mostrar tu perfil general.`}
        confirmText="ELIMINAR"
        cancelText="CANCELAR"
        confirmColor="red"
        isLoading={isDeleting}
        icon={
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        }
      />
    </>
  );
}
