import { useState, useEffect } from 'react';
import {
  ActualizacionAcademica,
  ActualizacionAcademicaRequest,
} from '../../../domain/entities/ActualizacionAcademica';

export const TIPOS_ACTUALIZACION = [
  'Taller',
  'Seminario',
  'Conferencia',
  'Curso',
  'Diplomado',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ActualizacionAcademica;
  onSave: (data: ActualizacionAcademicaRequest, id?: number) => Promise<void>;
  existingRecords?: ActualizacionAcademica[];
}

interface FormState {
  institucion: string;
  tipo: string;
  titulo: string;
  fechaInicio: string;
  fechaFinalizacion: string;
  aunNoLoFinalice: boolean;
  descripcion: string;
}

const EMPTY_FORM: FormState = {
  institucion: '',
  tipo: '',
  titulo: '',
  fechaInicio: '',
  fechaFinalizacion: '',
  aunNoLoFinalice: false,
  descripcion: '',
};

const getToday = () => {
  const formatter = new Intl.DateTimeFormat('es-BO', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  const y = parts.find((p) => p.type === 'year')!.value;
  const m = parts.find((p) => p.type === 'month')!.value;
  const d = parts.find((p) => p.type === 'day')!.value;
  return `${y}-${m}-${d}`;
};

export default function ActualizacionAcademicaFormModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  existingRecords = [],
}: Props) {
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<ActualizacionAcademicaRequest | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = getToday();

  useEffect(() => {
    if (initialData) {
      setFormData({
        institucion: initialData.institucion,
        tipo: initialData.tipo,
        titulo: initialData.titulo,
        fechaInicio: initialData.fechaInicio ?? '',
        fechaFinalizacion: initialData.fechaFinalizacion ?? '',
        aunNoLoFinalice: initialData.aunNoLoFinalice,
        descripcion: initialData.descripcion ?? '',
      });
      setCharCount(initialData.descripcion?.length ?? 0);
    } else {
      setFormData(EMPTY_FORM);
      setCharCount(0);
    }
    setErrors({});
    setShowDuplicateWarning(false);
    setPendingRequest(null);
    setShowSuccess(false);
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.institucion.trim()) {
      newErrors.institucion = 'La institución es obligatoria.';
    } else if (formData.institucion.length > 100) {
      newErrors.institucion = 'El texto no puede superar los 100 caracteres.';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'Debes seleccionar un tipo.';
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio.';
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = 'El texto no puede superar los 100 caracteres.';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria.';
    } else if (formData.fechaInicio > today) {
      newErrors.fechaInicio = 'No se puede elegir una fecha mayor a la fecha actual.';
    }

    if (!formData.aunNoLoFinalice) {
      if (!formData.fechaFinalizacion) {
        newErrors.fechaFinalizacion = 'Indica la fecha de finalización o marca "Aún no lo finalicé".';
      } else if (formData.fechaFinalizacion > today) {
        newErrors.fechaFinalizacion = 'No se puede elegir una fecha mayor a la fecha actual.';
      } else if (formData.fechaInicio && formData.fechaFinalizacion < formData.fechaInicio) {
        newErrors.fechaFinalizacion = 'No se puede elegir una fecha de finalización menor que la fecha de inicio.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isDuplicate = (request: ActualizacionAcademicaRequest): boolean => {
    return existingRecords.some((rec) => {
      if (rec.idActualizacionAcademica === initialData?.idActualizacionAcademica) return false;
      return (
        rec.institucion.trim().toLowerCase() === request.institucion.toLowerCase() &&
        rec.tipo === request.tipo &&
        rec.titulo.trim().toLowerCase() === request.titulo.toLowerCase()
      );
    });
  };

  const buildRequest = (): ActualizacionAcademicaRequest => ({
    institucion: formData.institucion.trim(),
    tipo: formData.tipo,
    titulo: formData.titulo.trim(),
    fechaInicio: formData.fechaInicio,
    fechaFinalizacion: formData.aunNoLoFinalice ? null : formData.fechaFinalizacion || null,
    aunNoLoFinalice: formData.aunNoLoFinalice,
    descripcion: formData.descripcion.trim(),
  });

  const executeSave = async (request: ActualizacionAcademicaRequest) => {
    setIsLoading(true);
    try {
      await onSave(request, initialData?.idActualizacionAcademica);
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    const request = buildRequest();
    if (isDuplicate(request)) {
      setPendingRequest(request);
      setShowDuplicateWarning(true);
      return;
    }
    await executeSave(request);
  };

  const handleForceSave = async () => {
    if (!pendingRequest) return;
    setShowDuplicateWarning(false);
    await executeSave(pendingRequest);
  };

  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <style
        dangerouslySetInnerHTML={{
          __html: `.date-input-aa::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; }`,
        }}
      />

      {/* Modal principal */}
      <div className="bg-[#0f111a] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[24px] border border-white/10 p-8 shadow-2xl scrollbar-thin scrollbar-thumb-[#2c2f48] relative">

        {/* Toast de éxito */}
        {showSuccess && (
          <div className="absolute inset-x-8 top-6 z-10 flex items-center gap-3 bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-3 animate-fade-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-green-400 text-sm font-medium">Se guardó con éxito</span>
          </div>
        )}

        {/* Header */}
        <div className={`mb-6 ${showSuccess ? 'mt-12' : ''}`}>
          <h2 className="text-white text-2xl font-bold">
            {isEditing ? 'Editar actualización académica' : 'Agregar actualización académica'}
          </h2>
          <p className="text-[#9ca3af] text-sm mt-1">
            Registra tus certificaciones y formaciones complementarias.
          </p>
        </div>

        <div className="space-y-5">

          {/* ── Institución / Universidad ── */}
          <div>
            <label className="text-[#9ca3af] text-sm block mb-2">
              Institución / Universidad *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              <input
                id="aa-institucion"
                disabled={isEditing}
                className={`w-full bg-[#1a1c29] border ${errors.institucion ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-3.5 text-white outline-none focus:border-[#6c63ff] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Ej. Universidad Mayor de San Andrés"
                value={formData.institucion}
                maxLength={120}
                onChange={(e) => {
                  setFormData({ ...formData, institucion: e.target.value });
                  if (errors.institucion) setErrors((prev) => ({ ...prev, institucion: '' }));
                }}
              />
            </div>
            {errors.institucion && (
              <p className="text-red-400 text-xs mt-1">{errors.institucion}</p>
            )}
          </div>

          {/* ── Tipo ── */}
          <div>
            <label className="text-[#9ca3af] text-sm block mb-2">
              Tipo *
            </label>
            <div className="relative">
              <select
                id="aa-tipo"
                disabled={isEditing}
                className={`w-full bg-[#1a1c29] border ${errors.tipo ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#6c63ff] transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                value={formData.tipo}
                onChange={(e) => {
                  setFormData({ ...formData, tipo: e.target.value });
                  if (e.target.value) setErrors((prev) => ({ ...prev, tipo: '' }));
                }}
              >
                <option value="" disabled className="bg-[#1a1c29] text-[#6b7280]">
                  Selecciona un tipo
                </option>
                {TIPOS_ACTUALIZACION.map((t) => (
                  <option key={t} value={t} className="bg-[#1a1c29]">
                    {t}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            {errors.tipo && (
              <p className="text-red-400 text-xs mt-1">{errors.tipo}</p>
            )}
          </div>

          {/* ── Título ── */}
          <div>
            <label className="text-[#9ca3af] text-sm block mb-2">
              Título *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 1.1 3.6 2 6 2s6-.9 6-2v-5" />
                </svg>
              </span>
              <input
                id="aa-titulo"
                disabled={isEditing}
                className={`w-full bg-[#1a1c29] border ${errors.titulo ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-3.5 text-white outline-none focus:border-[#6c63ff] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Ej. Certificación en Gestión de Proyectos"
                value={formData.titulo}
                maxLength={120}
                onChange={(e) => {
                  setFormData({ ...formData, titulo: e.target.value });
                  if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: '' }));
                }}
              />
            </div>
            {errors.titulo && (
              <p className="text-red-400 text-xs mt-1">{errors.titulo}</p>
            )}
          </div>

          {/* ── Fechas ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fecha inicio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#9ca3af] text-sm">Fecha de inicio *</label>
                {formData.fechaInicio && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, fechaInicio: '', fechaFinalizacion: '' });
                      setErrors((prev) => ({ ...prev, fechaInicio: '' }));
                    }}
                    className="text-[10px] text-[#6c63ff] hover:text-[#a598ff] transition-colors"
                  >
                    Borrar
                  </button>
                )}
              </div>
              <input
                id="aa-fecha-inicio"
                type="date"
                max={today}
                className={`date-input-aa w-full bg-[#1a1c29] border ${errors.fechaInicio ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 text-[#9ca3af] text-sm cursor-pointer outline-none focus:border-[#6c63ff] transition-colors`}
                value={formData.fechaInicio}
                onChange={(e) => {
                  setFormData({ ...formData, fechaInicio: e.target.value, fechaFinalizacion: '' });
                  if (e.target.value) setErrors((prev) => ({ ...prev, fechaInicio: '' }));
                }}
              />
              {errors.fechaInicio && (
                <p className="text-red-400 text-xs mt-1">{errors.fechaInicio}</p>
              )}
            </div>

            {/* Fecha finalización */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#9ca3af] text-sm">
                  Fecha de finalización {!formData.aunNoLoFinalice && '*'}
                </label>
                {formData.fechaFinalizacion && !formData.aunNoLoFinalice && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, fechaFinalizacion: '' });
                      setErrors((prev) => ({ ...prev, fechaFinalizacion: '' }));
                    }}
                    className="text-[10px] text-[#6c63ff] hover:text-[#a598ff] transition-colors"
                  >
                    Borrar
                  </button>
                )}
              </div>
              <input
                id="aa-fecha-fin"
                type="date"
                disabled={formData.aunNoLoFinalice || !formData.fechaInicio}
                min={formData.fechaInicio || undefined}
                max={today}
                className={`date-input-aa w-full bg-[#1a1c29] border ${errors.fechaFinalizacion ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 text-[#9ca3af] text-sm disabled:opacity-30 cursor-pointer outline-none focus:border-[#6c63ff] transition-colors`}
                value={formData.fechaFinalizacion}
                onChange={(e) => {
                  setFormData({ ...formData, fechaFinalizacion: e.target.value });
                  if (e.target.value) setErrors((prev) => ({ ...prev, fechaFinalizacion: '' }));
                }}
              />
              {!formData.fechaInicio && !formData.aunNoLoFinalice && (
                <p className="text-[#6c63ff] text-[10px] mt-1">
                  Seleccione fecha de inicio
                </p>
              )}
              {errors.fechaFinalizacion && formData.fechaInicio && !formData.aunNoLoFinalice && (
                <p className="text-red-400 text-xs mt-1">{errors.fechaFinalizacion}</p>
              )}
            </div>
          </div>

          {/* ── Checkbox aún no lo finalicé ── */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aa-aun-no-finalice"
              checked={formData.aunNoLoFinalice}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  aunNoLoFinalice: e.target.checked,
                  fechaFinalizacion: e.target.checked ? '' : formData.fechaFinalizacion,
                });
                if (e.target.checked) {
                  setErrors((prev) => ({ ...prev, fechaFinalizacion: '' }));
                }
              }}
              className="w-4 h-4 rounded border-white/10 bg-[#1a1c29] accent-[#6c63ff] shrink-0"
            />
            <label htmlFor="aa-aun-no-finalice" className="text-[#9ca3af] text-xs cursor-pointer select-none">
              Aún no lo finalicé
            </label>
          </div>

          {/* ── Descripción ── */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[#9ca3af] text-sm">Descripción (Opcional)</label>
              <span className={`text-xs ${charCount >= 500 ? 'text-red-400' : 'text-[#6b7280]'}`}>
                {charCount} / 500
              </span>
            </div>
            <textarea
              id="aa-descripcion"
              maxLength={500}
              className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white h-28 resize-none text-sm focus:border-[#6c63ff] outline-none transition-colors placeholder:text-[#4b5563]"
              placeholder="Describe los temas tratados, habilidades adquiridas o logros obtenidos..."
              value={formData.descripcion}
              onChange={(e) => {
                const val = e.target.value.slice(0, 500);
                setFormData({ ...formData, descripcion: val });
                setCharCount(val.length);
              }}
            />
          </div>

        </div>

        {/* ── Botones ── */}
        <div className="flex flex-col gap-3 mt-8">
          <button
            id="aa-btn-aceptar"
            onClick={handleSave}
            disabled={isLoading || showSuccess}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] text-sm font-bold hover:brightness-110 shadow-[0_0_15px_rgba(108,99,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#471499] border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'ACEPTAR'
            )}
          </button>
          <button
            id="aa-btn-cancelar"
            onClick={onClose}
            disabled={isLoading || showSuccess}
            className="w-full py-3.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-50"
          >
            CANCELAR
          </button>
        </div>
      </div>

      {/* ── Modal de advertencia de duplicidad ── */}
      {showDuplicateWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f111a] w-full max-w-sm rounded-[20px] border border-yellow-500/20 p-7 shadow-2xl">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-base font-bold leading-snug">
                  Actualización duplicada detectada
                </h3>
                <p className="text-[#9ca3af] text-sm mt-2 leading-relaxed">
                  Detectamos que ya tienes una actualización con estos datos. ¿Deseas registrar esta actualización igualmente?
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleForceSave}
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#471499] border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'GUARDAR DE TODAS FORMAS'
                )}
              </button>
              <button
                onClick={() => setShowDuplicateWarning(false)}
                disabled={isLoading}
                className="w-full py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-50"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
