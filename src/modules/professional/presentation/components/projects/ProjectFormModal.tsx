import { useState, useEffect, useRef } from 'react';
import { Project, GitHubRepo, ProjectEvidence } from '../../../domain/entities/Project';
import { HttpProjectRepository } from '../../../infrastructure/repositories/HttpProjectRepository';
import { httpClient } from '../../../../../infrastructure/http/httpClient';
import { DateRangeInput } from '../../../../../shared/components/DateRangeInput';
import TechTags from './TechTags';
import EvidenceUploader, { LocalEvidence } from './EvidenceUploader';
import GitHubImportDropdown from './GitHubImportDropdown';

const repo = new HttpProjectRepository();

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Project;
  onSuccess: () => void;
}

const emptyProject: Project = {
  nombre: '',
  descripcionCorta: '',
  descripcionDetallada: '',
  fechaInicio: '',
  fechaFin: '',
  esActual: false,
  tecnologias: [],
  visibilidad: 'publico',
  urlDemo: '',
  repositorios: [''],
  iconoUrl: null,
  evidencias: [],
};

export default function ProjectFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<Project>({ ...emptyProject });
  const [localEvidences, setLocalEvidences] = useState<LocalEvidence[]>([]);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const iconInputRef = useRef<HTMLInputElement>(null);

  const getBoliviaDate = () => {
    const formatter = new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === 'year')!.value;
    const month = parts.find((p) => p.type === 'month')!.value;
    const day = parts.find((p) => p.type === 'day')!.value;
    return `${year}-${month}-${day}`;
  };

  const today = getBoliviaDate();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        repositorios:
          initialData.repositorios?.length > 0
            ? initialData.repositorios
            : [''],
      });
      setIconPreview(initialData.iconoUrl || null);
    } else {
      setFormData({ ...emptyProject });
      setIconPreview(null);
      setLocalEvidences([]);
    }
  }, [initialData]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Icon upload (guarda el File para subirlo al guardar)
  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
      showToast('Tipo de archivo no permitido', 'error');
      return;
    }
    setIconFile(file);
    const url = URL.createObjectURL(file);
    setIconPreview(url);
  };

  // GitHub import
  const handleGitHubSelect = (ghRepo: GitHubRepo) => {
    const createdDate = ghRepo.created_at
      ? ghRepo.created_at.substring(0, 10)
      : '';
    const updatedDate = ghRepo.updated_at
      ? ghRepo.updated_at.substring(0, 10)
      : '';

    setFormData({
      ...formData,
      nombre: ghRepo.name,
      descripcionCorta: ghRepo.description || '',
      fechaInicio: createdDate,
      fechaFin: updatedDate,
      tecnologias: [
        ...new Set([
          ...formData.tecnologias,
          ...(ghRepo.languages || []),
          ...(ghRepo.topics || []),
        ]),
      ],
      repositorios: [ghRepo.html_url],
    });
  };

  // Repositories management
  const handleRepoChange = (index: number, value: string) => {
    const newRepos = [...formData.repositorios];
    newRepos[index] = value;
    setFormData({ ...formData, repositorios: newRepos });
  };

  const addRepo = () => {
    setFormData({
      ...formData,
      repositorios: [...formData.repositorios, ''],
    });
  };

  const removeRepo = (index: number) => {
    if (formData.repositorios.length <= 1) return;
    setFormData({
      ...formData,
      repositorios: formData.repositorios.filter((_, i) => i !== index),
    });
  };

  // Save handler: sube archivos al servidor antes de guardar el proyecto
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 1. Subir ícono si se seleccionó uno nuevo
      let finalIconUrl = formData.iconoUrl;
      if (iconFile) {
        const iconRes = await httpClient.uploadFile<{ url: string }>(
          '/api/profile/proyectos/icono',
          iconFile,
          'file',
          'Error al subir el ícono'
        );
        finalIconUrl = iconRes.url;
      }

      // 2. Subir evidencias nuevas (las que tienen File local)
      const uploadedEvidences: ProjectEvidence[] = [...formData.evidencias];
      for (const localEv of localEvidences) {
        const evRes = await httpClient.uploadFile<{
          idEvidenciaProyecto: number;
          nombreOriginal: string;
          enlaceEvidencia: string;
          formato: string;
          tamanoBytes: number;
        }>(
          '/api/profile/proyectos/evidencias',
          localEv.file,
          'file',
          'Error al subir evidencia'
        );
        uploadedEvidences.push({
          id: evRes.idEvidenciaProyecto,
          nombre: evRes.nombreOriginal,
          url: evRes.enlaceEvidencia,
          tipo: evRes.formato,
          pesoBytes: evRes.tamanoBytes,
        });
      }

      // 3. Guardar proyecto
      const projectToSave: Project = {
        ...formData,
        iconoUrl: finalIconUrl,
        evidencias: uploadedEvidences,
        repositorios: formData.repositorios.filter((r) => r.trim() !== ''),
      };

      if (initialData?.id) {
        await repo.update(projectToSave);
      } else {
        await repo.save(projectToSave);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      showToast('Error al guardar el proyecto', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setFormData({ ...emptyProject });
    setLocalEvidences([]);
    setIconPreview(null);
    onClose();
  };

  const isFormValid = () => {
    return formData.nombre.trim() !== '' && formData.fechaInicio !== '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <style
        dangerouslySetInnerHTML={{
          __html: `.date-input::-webkit-calendar-picker-indicator { color: white; }`,
        }}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 rounded-xl text-white text-sm font-medium shadow-2xl transition-all ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-[#0f111a] w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-[24px] border border-white/10 p-8 shadow-2xl scrollbar-thin scrollbar-thumb-[#2c2f48]">
        <h2 className="text-white text-2xl font-bold mb-6">
          {initialData ? 'Editar Proyecto' : 'Agregar Proyecto'}
        </h2>

        <div className="space-y-8">
          {/* Section 1: Basic info + GitHub import */}
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-white text-lg font-semibold">
                Información del proyecto
              </h3>
              <GitHubImportDropdown
                onSelect={handleGitHubSelect}
                onToast={showToast}
              />
            </div>

            <div className="flex gap-6">
              {/* Icon upload */}
              <div className="shrink-0">
                <label className="text-[#9ca3af] text-sm block mb-2">
                  Ícono
                </label>
                <div
                  onClick={() => iconInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl bg-[#1a1c29] border border-white/10 flex items-center justify-center cursor-pointer hover:border-[#6c63ff]/40 transition-colors overflow-hidden"
                >
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Ícono del proyecto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                </div>
                <input
                  ref={iconInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  onChange={handleIconSelect}
                  className="hidden"
                />
              </div>

              {/* Name + Short description */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Nombre del proyecto *
                  </label>
                  <input
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#6c63ff] text-sm"
                    placeholder="Ej. Aether Chat App"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Descripción corta
                  </label>
                  <input
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#6c63ff] text-sm"
                    placeholder="Una línea que resume tu proyecto"
                    value={formData.descripcionCorta}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descripcionCorta: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Period */}
          <section>
            <h3 className="text-white text-lg font-semibold mb-4">
              Periodo del proyecto
            </h3>
            <DateRangeInput
              formData={formData}
              today={today}
              setFormData={setFormData}
              dateFields={{
                startDateField: 'fechaInicio',
                endDateField: 'fechaFin',
                isActiveField: 'esActual',
              }}
              labels={{
                startDateLabel: 'Fecha de inicio *',
                endDateLabel: 'Fecha de finalización',
                currentJobLabel: 'Actual',
              }}
              checkboxId="projectCurrent"
            />
          </section>

          {/* Section 3: Narrative & details */}
          <section>
            <h3 className="text-white text-lg font-semibold mb-4">
              Narrativa y detalles
            </h3>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <label className="text-[#9ca3af] text-sm">
                  Descripción detallada
                </label>
                <span className="text-[#6b7280] text-xs">
                  {formData.descripcionDetallada.length}/2000
                </span>
              </div>
              <textarea
                maxLength={2000}
                className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white h-28 resize-none text-sm focus:border-[#6c63ff] outline-none"
                placeholder="Describe en detalle tu proyecto, su propósito y los problemas que resuelve..."
                value={formData.descripcionDetallada}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descripcionDetallada: e.target.value,
                  })
                }
              />
            </div>

            {/* Tech tags */}
            <div>
              <label className="text-[#9ca3af] text-sm block mb-3">
                Tecnologías usadas
              </label>
              <div className="bg-[#1a1c29] border border-white/10 rounded-xl p-3.5">
                <TechTags
                  technologies={formData.tecnologias}
                  onChange={(techs) =>
                    setFormData({ ...formData, tecnologias: techs })
                  }
                />
              </div>
            </div>
          </section>

          {/* Section 4: Config & links */}
          <section>
            <h3 className="text-white text-lg font-semibold mb-1">
              Configuración y enlaces
            </h3>
            <p className="text-[#6b7280] text-xs mb-4">
              Gestiona la visibilidad y las conexiones externas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visibility */}
              <div>
                <label className="text-[#9ca3af] text-sm flex items-center gap-1.5 mb-3">
                  Visibilidad
                  <span
                    className="text-[#6b7280] cursor-help"
                    title="Define si tu proyecto será visible en portafolios públicos"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </span>
                </label>
                <div className="flex bg-[#1a1c29] rounded-xl border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, visibilidad: 'publico' })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all focus:outline-none outline-none focus:ring-0 focus:ring-offset-0 active:outline-none border ${
                      formData.visibilidad === 'publico'
                        ? 'bg-[#6c63ff]/20 text-[#bdbefe] border-[#6c63ff]/40 rounded-xl'
                        : 'border-transparent text-[#6b7280] hover:text-white rounded-xl'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Público
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, visibilidad: 'privado' })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all focus:outline-none outline-none focus:ring-0 focus:ring-offset-0 active:outline-none border ${
                      formData.visibilidad === 'privado'
                        ? 'bg-[#6c63ff]/20 text-[#bdbefe] border-[#6c63ff]/40 rounded-xl'
                        : 'border-transparent text-[#6b7280] hover:text-white rounded-xl'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Privado
                  </button>
                </div>
              </div>

              {/* Demo URL */}
              <div>
                <label className="text-[#9ca3af] text-sm block mb-3">
                  URL de demo
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c63ff]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </span>
                  <input
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 pl-10 text-white outline-none focus:border-[#6c63ff] text-sm"
                    placeholder="https://demo.dashboard.com"
                    value={formData.urlDemo}
                    onChange={(e) =>
                      setFormData({ ...formData, urlDemo: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Repositories */}
            <div className="mt-6">
              <label className="text-[#9ca3af] text-sm block mb-3">
                Repositorios de código
              </label>
              <div className="space-y-3">
                {formData.repositorios.map((repoUrl, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c63ff]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </span>
                      <input
                        className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 pl-10 text-white outline-none focus:border-[#6c63ff] text-sm"
                        placeholder="https://github.com/user/repo"
                        value={repoUrl}
                        onChange={(e) =>
                          handleRepoChange(index, e.target.value)
                        }
                      />
                    </div>
                    {formData.repositorios.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRepo(index)}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
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
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRepo}
                className="text-[#bdbefe] text-sm mt-3 hover:text-white transition-colors"
              >
                + Añadir otro repositorio
              </button>
            </div>
          </section>

          {/* Section 5: Evidence & gallery */}
          <section>
            <h3 className="text-white text-lg font-semibold mb-1">
              Evidencias y galería
            </h3>
            <p className="text-[#6b7280] text-xs mb-4">
              Sube capturas de pantalla, diagramas o documentos relevantes.
            </p>
            <EvidenceUploader
              evidences={localEvidences}
              onChange={setLocalEvidences}
              onToast={showToast}
              existingEvidences={formData.evidencias}
              onRemoveExisting={(index) => {
                const newEvidences = [...formData.evidencias];
                newEvidences.splice(index, 1);
                setFormData({ ...formData, evidencias: newEvidences });
              }}
            />
          </section>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleCancel}
            className="px-8 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid() || isLoading}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] text-sm font-bold hover:brightness-110 shadow-[0_0_15px_rgba(108,99,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#471499] border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'GUARDAR Y CERRAR'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
