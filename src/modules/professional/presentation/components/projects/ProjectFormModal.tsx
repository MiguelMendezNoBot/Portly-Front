import { useState, useEffect, useRef } from 'react';
import { Project, GitHubRepo, ProjectEvidence, ProjectDocument } from '../../../domain/entities/Project';
import { HttpProjectRepository } from '../../../infrastructure/repositories/HttpProjectRepository';
import { httpClient } from '../../../../../infrastructure/http/httpClient';
import { DateRangeInput } from '../../../../../shared/components/DateRangeInput';
import TechTags from './TechTags';
import EvidenceUploader, { LocalEvidence } from './EvidenceUploader';
import DocumentUploader, { LocalDocument } from './DocumentUploader';


const repo = new HttpProjectRepository();

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Project;
  onSuccess: () => void;
  existingProjects?: Project[];
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
  iconoUrl: null,
  evidencias: [],
  documentos: [],
  enlaces: [{ titulo: '', url: '' }],
};

export default function ProjectFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  existingProjects,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<Project>({ ...emptyProject });
  const [localEvidences, setLocalEvidences] = useState<LocalEvidence[]>([]);
  const [localDocuments, setLocalDocuments] = useState<LocalDocument[]>([]);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

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
        enlaces: initialData.enlaces || [],
      });
      setIconPreview(initialData.iconoUrl || null);
    } else {
      setFormData({ ...emptyProject });
      setIconPreview(null);
      setLocalEvidences([]);
      setLocalDocuments([]);
    }
  }, [initialData]);

  // Reset duplicate warning when name changes
  useEffect(() => {
    setDuplicateWarning(false);
  }, [formData.nombre]);

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


  // Links management
  const handleLinkChange = (index: number, field: 'titulo' | 'url', value: string) => {
    const newLinks = [...formData.enlaces];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, enlaces: newLinks });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      enlaces: [...formData.enlaces, { titulo: '', url: '' }],
    });
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      enlaces: formData.enlaces.filter((_, i) => i !== index),
    });
  };

  // Save handler: sube archivos al servidor antes de guardar el proyecto
  const handleSave = async () => {
    const isDuplicate = existingProjects?.some(
      (p) =>
        p.nombre.trim().toLowerCase() === formData.nombre.trim().toLowerCase() &&
        p.id !== initialData?.id
    );

    if (isDuplicate && !duplicateWarning) {
      setDuplicateWarning(true);
      return;
    }

    setIsLoading(true);
    try {
      // Ejecutar todas las subidas en paralelo para optimizar la velocidad
      const [iconRes, newEvidences, newDocuments] = await Promise.all([
        // 1. Promesa del ícono
        iconFile
          ? httpClient.uploadFile<{ url: string }>(
              '/api/profile/proyectos/icono',
              iconFile,
              'file',
              'Error al subir el ícono'
            )
          : Promise.resolve(null),
          
        // 2. Promesas de evidencias
        Promise.all(
          localEvidences.map(async (localEv) => {
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
            return {
              id: evRes.idEvidenciaProyecto,
              nombre: evRes.nombreOriginal,
              url: evRes.enlaceEvidencia,
              tipo: evRes.formato,
              pesoBytes: evRes.tamanoBytes,
            };
          })
        ),

        // 3. Promesas de documentos
        Promise.all(
          localDocuments.map(async (localDoc) => {
            const docRes = await httpClient.uploadFile<{
              idDocumentoProyecto: number;
              nombreOriginal: string;
              urlDescarga: string;
              formato: string;
              tamanoBytes: number;
            }>(
              '/api/profile/proyectos/documentos',
              localDoc.file,
              'file',
              'Error al subir documento'
            );
            return {
              id: docRes.idDocumentoProyecto,
              nombre: docRes.nombreOriginal,
              urlDescarga: docRes.urlDescarga,
              tipo: docRes.formato,
              pesoBytes: docRes.tamanoBytes,
            };
          })
        ),
      ]);

      const finalIconUrl = iconRes ? iconRes.url : formData.iconoUrl;
      const uploadedEvidences = [...formData.evidencias, ...newEvidences];
      const uploadedDocuments = [...(formData.documentos || []), ...newDocuments];

      // 4. Guardar proyecto
      const projectToSave: Project = {
        ...formData,
        iconoUrl: finalIconUrl,
        evidencias: uploadedEvidences,
        documentos: uploadedDocuments,
        enlaces: formData.enlaces.filter(
          (l) => l.titulo.trim() !== '' && l.url.trim() !== ''
        ),
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
    setLocalDocuments([]);
    setIconPreview(null);
    onClose();
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isFormValid = () => {
    return (
      formData.nombre.trim() !== '' &&
      formData.descripcionCorta.trim() !== '' &&
      formData.enlaces.every(
        (l) =>
          (l.titulo.trim() === '' && l.url.trim() === '') ||
          (l.titulo.trim() !== '' && l.url.trim() !== '' && isValidUrl(l.url))
      )
    );
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
            <h3 className="text-white text-lg font-semibold mb-6">
              Información del proyecto
            </h3>

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
                  <div className="relative">
                    <input
                      className={`w-full border rounded-xl p-3.5 text-sm transition-colors ${
                        initialData
                          ? 'bg-[#1a1c29]/60 border-white/5 text-[#6b7280] cursor-not-allowed select-none'
                          : 'bg-[#1a1c29] border-white/10 text-white outline-none focus:border-[#6c63ff]'
                      }`}
                      placeholder="Ej. Aether Chat App"
                      value={formData.nombre}
                      disabled={!!initialData}
                      readOnly={!!initialData}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                    />
                    {initialData && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[#6b7280]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Descripción *
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
                startDateLabel: 'Fecha de inicio',
                endDateLabel: 'Fecha de finalización',
                currentJobLabel: 'Actual',
              }}
              checkboxId="projectCurrent"
            />
          </section>

          {/* Section 3: Herramientas */}
          <section>
            <h3 className="text-white text-lg font-semibold mb-4">
              Herramientas
            </h3>

            {/* Tech tags */}
            <div>
              <label className="text-[#9ca3af] text-sm block mb-3">
                Herramientas que se utilizaron para desarrollar el proyecto
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
              Enlaces
            </h3>
            <p className="text-[#6b7280] text-xs mb-4">
              Gestiona la visibilidad y las conexiones externas.
            </p>

              <div className="space-y-4 mt-2">
                {formData.enlaces.map((link, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Título */}
                      <div>
                        <input
                          className={`w-full bg-[#1a1c29] border rounded-xl p-3.5 text-white outline-none focus:border-[#6c63ff] text-sm ${
                            link.url.trim() !== '' && link.titulo.trim() === ''
                              ? 'border-red-500'
                              : 'border-white/10'
                          }`}
                          placeholder="Título del enlace"
                          value={link.titulo}
                          onChange={(e) =>
                            handleLinkChange(index, 'titulo', e.target.value)
                          }
                        />
                        {link.url.trim() !== '' && link.titulo.trim() === '' && (
                          <p className="text-red-500 text-xs mt-1.5 ml-1">Título obligatorio</p>
                        )}
                      </div>
                      
                      {/* URL */}
                      <div>
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
                            className={`w-full bg-[#1a1c29] border rounded-xl p-3.5 pl-10 text-white outline-none focus:border-[#6c63ff] text-sm ${
                              (link.titulo.trim() !== '' && link.url.trim() === '') || (link.url && !isValidUrl(link.url))
                                ? 'border-red-500'
                                : 'border-white/10'
                            }`}
                            placeholder="https://tuenlace.com"
                            value={link.url}
                            onChange={(e) =>
                              handleLinkChange(index, 'url', e.target.value)
                            }
                          />
                        </div>
                        {link.titulo.trim() !== '' && link.url.trim() === '' && (
                          <p className="text-red-500 text-xs mt-1.5 ml-1">URL obligatoria</p>
                        )}
                        {link.url && !isValidUrl(link.url) && (
                          <p className="text-red-500 text-xs mt-1.5 ml-1">URL inválida</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-3 mt-0.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
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
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addLink}
                  className="text-[#bdbefe] text-sm mt-3 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>+</span> {formData.enlaces.length > 0 ? 'Añadir otro enlace' : 'Añadir enlace'}
                </button>
              </div>
          </section>

          {/* Section 5: Evidence & gallery */}
          <section>
            <h3 className="text-white text-lg font-semibold mb-1">
              Evidencias y galería
            </h3>
            <p className="text-[#6b7280] text-xs mb-4">
              Sube capturas de pantalla o imágenes relevantes.
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

          {/* Section 6: Documents */}
          <section>
            <h3 className="text-white text-lg font-semibold mb-1">
              Documentos adjuntos
            </h3>
            <p className="text-[#6b7280] text-xs mb-4">
              Sube PDFs, archivos de Word o documentos adicionales.
            </p>
            <DocumentUploader
              documents={localDocuments}
              onChange={setLocalDocuments}
              onToast={showToast}
              existingDocuments={formData.documentos || []}
              onRemoveExisting={(index) => {
                const newDocs = [...(formData.documentos || [])];
                newDocs.splice(index, 1);
                setFormData({ ...formData, documentos: newDocs });
              }}
            />
          </section>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-white/10">
          {duplicateWarning ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col gap-3 animate-fade-in w-full">
              <div className="flex items-start gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 mt-0.5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-amber-400 text-sm font-medium leading-relaxed">
                  Ya existe otro proyecto con el nombre "{formData.nombre}". <br />
                  ¿Está seguro que desea añadir el proyecto de todas formas?
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setDuplicateWarning(false)}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Sí, añadir'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-8 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </div>
      </div>
    </div>
  );
}
