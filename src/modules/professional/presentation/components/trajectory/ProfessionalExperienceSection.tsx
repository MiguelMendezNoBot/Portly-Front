import { useState, useEffect } from 'react';
import { HttpExperienceRepository } from '../../../infrastructure/repositories/HttpExperienceRepository';
import { Experience } from '../../../domain/entities/Experience';
import ExperienceFormModal from './ExperienceFormModal';
import { ExperienceSkeleton } from './ExperienceSkeleton';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import ViewExperienceModal from './ViewExperienceModal'; // nuevo modal

const repository = new HttpExperienceRepository();

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
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function TrayectoriaSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<ActionMode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: undefined as number | undefined,
    title: '',
  });
  const [editingExperience, setEditingExperience] = useState<
    Experience | undefined
  >();
  const [showViewModal, setShowViewModal] = useState(false); // para visualizar

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await repository.getAll();
      setExperiences(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setMode(null);
    setEditingExperience(undefined);
    setIsModalOpen(true);
  };

  const toggleMode = (target: 'edit' | 'delete') => {
    setMode((prev) => (prev === target ? null : target));
  };

  const handleEditFromCard = (exp: Experience) => {
    setEditingExperience(exp);
    setIsModalOpen(true);
  };

  const handleDeleteRequestFromCard = (exp: Experience) => {
    setDeleteModal({
      isOpen: true,
      id: exp.id,
      title: exp.cargo,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await repository.delete(deleteModal.id);
      setDeleteModal({ ...deleteModal, isOpen: false });
      setMode(null);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSuccess = () => {
    loadData();
    setMode(null);
  };

  return (
    <>
      <section className="flex flex-col gap-6 w-full animate-fade-in bg-[#171B28] p-4 rounded-2xl">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h3 className="text-white text-2xl font-bold">
              Trayectoria Profesional
            </h3>
            <p className="text-[#9ca3af] text-sm mt-1">
              Gestiona tu historial laboral y destaca tus logros clave para los
              reclutadores.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
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

            {experiences.length > 0 && (
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

                {/* Editar */}
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

                {/* Eliminar */}
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
        {mode && experiences.length > 0 && (
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
        <div className="space-y-4">
          {isLoading ? (
            <ExperienceSkeleton />
          ) : experiences.length === 0 ? (
            <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
              <h4 className="text-white text-lg font-bold mb-2">
                Tu trayectoria profesional está vacía.
              </h4>
              <p className="text-[#9ca3af] text-sm mb-6">
                Agrega tus experiencias laborales para destacar tu crecimiento y
                atraer mejores oportunidades. ¡Empieza ahora mismo!
              </p>
            </div>
          ) : (
            experiences.map((exp) => {
              const isClickable = mode !== null;

              const handleCardClick = () => {
                if (!isClickable) return;
                if (mode === 'edit') handleEditFromCard(exp);
                if (mode === 'delete') handleDeleteRequestFromCard(exp);
              };

              return (
                <div
                  key={exp.id}
                  onClick={handleCardClick}
                  className={`relative group bg-[#2D3449] p-6 rounded-2xl border transition-all hover:bg-[#1f2233] ${
                    isClickable
                      ? mode === 'edit'
                        ? 'border-[#6b72ff]/40 hover:border-[#6b72ff]/70 cursor-pointer'
                        : 'border-red-500/40 hover:border-red-500/70 cursor-pointer'
                      : 'border-white/5'
                  }`}
                >
                  {/* Icono de modo (solo en hover) */}
                  {mode === 'edit' && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-7 h-7 rounded-full bg-[#6b72ff]/20 flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#C9BEFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {mode === 'delete' && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#f87171"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <h4 className="text-white text-lg font-bold pr-24 max-w-[380px]">
                    {exp.cargo}
                  </h4>
                  <p className="text-[#A8E8FF] text-sm font-medium mt-1 max-w-[380px]">
                    {exp.nombreEmpresa} • {exp.fechaInicio} -{' '}
                    {exp.actualmenteTrabajando ? 'Present' : exp.fechaFin}
                  </p>
                  <p className="text-[#9ca3af] text-sm mt-4 leading-relaxed pr-2">
                    {exp.descripcion}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>

      {isModalOpen && (
        <ExperienceFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingExperience}
          onSuccess={handleFormSuccess}
          existingExperiences={experiences}
        />
      )}

      {deleteModal.isOpen && (
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title={deleteModal.title}
          onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
          onConfirm={confirmDelete}
        />
      )}

      <ViewExperienceModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        experiences={experiences}
      />
    </>
  );
}
