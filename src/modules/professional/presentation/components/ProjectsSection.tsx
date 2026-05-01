import { useState, useEffect } from 'react';
import { Project } from '../../domain/entities/Project';
import { HttpProjectRepository } from '../../infrastructure/repositories/HttpProjectRepository';
import ProjectCard from './projects/ProjectCard';
import ProjectFormModal from './projects/ProjectFormModal';
import DeleteProjectModal from './projects/DeleteProjectModal';
import ProjectSkeleton from './projects/ProjectSkeleton';

const repository = new HttpProjectRepository();

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

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<ActionMode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: undefined as number | undefined,
    name: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await repository.getAll();
      setProjects(data);
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
    setEditingProject(undefined);
    setIsModalOpen(true);
  };

  const toggleMode = (target: 'edit' | 'delete') => {
    setMode((prev) => (prev === target ? null : target));
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (project: Project) => {
    setDeleteModal({
      isOpen: true,
      id: project.id,
      name: project.nombre,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await repository.delete(deleteModal.id);
      setDeleteModal({ isOpen: false, id: undefined, name: '' });
      loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-6 w-full animate-fade-in">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h3 className="text-white text-2xl font-bold">Tus Proyectos</h3>
            <p className="text-[#9ca3af] text-sm mt-1">
              Gestiona y publica tus últimos trabajos.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            {/* Agregar */}
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-4 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar
            </button>

            {projects.length > 0 && (
              <>
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
        {mode && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border ${
            mode === 'edit'
              ? 'bg-white/5 border-white/10 text-[#9ca3af]'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
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

        {/* Content */}
        <div className="space-y-6">
          {isLoading ? (
            <ProjectSkeleton />
          ) : projects.length === 0 ? (
            <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
              <div className="w-16 h-16 bg-[#1a1c29] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="1.5"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4 className="text-white text-lg font-bold mb-2">
                Tu portafolio de proyectos está vacío.
              </h4>
              <p className="text-[#9ca3af] text-sm mb-6 max-w-md mx-auto">
                Agrega tus proyectos personales o importa desde GitHub para
                destacar tu trabajo y atraer mejores oportunidades.
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                mode={mode}
                onClick={() => {
                  if (mode === 'edit') handleEdit(project);
                  else if (mode === 'delete') handleDeleteRequest(project);
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* Form Modal */}
      {isModalOpen && (
        <ProjectFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingProject}
          onSuccess={loadData}
          existingProjects={projects}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteProjectModal
        isOpen={deleteModal.isOpen}
        projectName={deleteModal.name}
        onClose={() =>
          setDeleteModal({ isOpen: false, id: undefined, name: '' })
        }
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
