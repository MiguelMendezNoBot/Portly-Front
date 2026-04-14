import { useState, useEffect } from 'react';
import { HttpExperienceRepository } from '../../../infrastructure/repositories/HttpExperienceRepository';
import { Experience } from '../../../domain/entities/Experience';
import ExperienceFormModal from './ExperienceFormModal';
import { ExperienceSkeleton } from './ExperienceSkeleton';
import { DeleteConfirmModal } from './DeleteConfirmModal';

const repository = new HttpExperienceRepository();

export default function TrayectoriaSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: undefined as number | undefined,
    title: '',
  });
  const [editingExperience, setEditingExperience] = useState<
    Experience | undefined
  >();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await repository.getAll();
      setExperiences(data);
    } catch (error) {
      console.error(error);
    } finally {
      // Pequeño delay opcional para que el skeleton sea visible si el server es muy rápido
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await repository.delete(deleteModal.id);
      setDeleteModal({ ...deleteModal, isOpen: false });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenAdd = () => {
    setEditingExperience(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    const confirmDelete = window.confirm(
      '¿Estás seguro de eliminar esta experiencia?'
    );
    if (confirmDelete) {
      try {
        await repository.delete(id);
        await loadData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <section className="flex flex-col gap-6 w-full animate-fade-in bg-[#171B28] p-4 rounded-2xl">
        <header className="flex flex-col gap-4">
          <div>
            <h3 className="text-white text-2xl font-bold">
              Trayectoria Profesional
            </h3>
            <p className="text-[#9ca3af] text-sm mt-1">
              Gestiona tu historial laboral y destaca tus logros clave para los
              reclutadores.
            </p>
          </div>
        </header>

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
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 relative group transition-all hover:bg-[#1f2233]"
              >
                {/* Botones Editar / Eliminar */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingExperience(exp);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors flex flex-col items-center gap-1"
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
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <span className="text-[10px] text-gray-400">Editar</span>
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        id: exp.id,
                        title: exp.cargo,
                      })
                    }
                    className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors flex flex-col items-center gap-1"
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
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span className="text-[10px] text-gray-400 hover:text-red-400">
                      Eliminar
                    </span>
                  </button>
                </div>

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
            ))
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleOpenAdd}
            className="bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:bg-[#5a52d5] text-[#0D0096] py-3 px-8 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm"
          >
            AGREGAR NUEVA EXPERIENCIA
          </button>
        </div>
      </section>

      {isModalOpen && (
        <ExperienceFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingExperience}
          onSuccess={loadData}
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
    </>
  );
}
