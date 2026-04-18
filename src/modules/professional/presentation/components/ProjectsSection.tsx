import { useState, useEffect } from 'react';
import { Project } from '../../domain/entities/Project';
import { HttpProjectRepository } from '../../infrastructure/repositories/HttpProjectRepository';
import ProjectCard from './projects/ProjectCard';
import ProjectFormModal from './projects/ProjectFormModal';
import DeleteProjectModal from './projects/DeleteProjectModal';
import ProjectSkeleton from './projects/ProjectSkeleton';

const repository = new HttpProjectRepository();

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    setEditingProject(undefined);
    setIsModalOpen(true);
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
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-white text-2xl font-bold">Tus Proyectos</h3>
            <p className="text-[#9ca3af] text-sm mt-1">
              Gestiona y publica tus últimos trabajos.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-3 px-6 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap self-start sm:self-auto"
          >
            AÑADIR NUEVO PROYECTO PERSONAL
          </button>
        </header>

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
                onEdit={() => handleEdit(project)}
                onDelete={() => handleDeleteRequest(project)}
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
