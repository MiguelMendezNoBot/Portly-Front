import { useState, useEffect } from 'react';
import { FormacionAcademica, FormacionAcademicaRequest } from '../../../domain/entities/FormacionAcademica';

// Re-export for backward compatibility with FormacionAcademicaSection
export type { FormacionAcademica };

export const NIVELES = [
  'Bachillerato',
  'Técnico',
  'Tecnólogo',
  'Licenciatura',
  'Ingeniería',
  'Maestría',
  'Doctorado',
  'Postdoctorado',
  'Certificación',
  'Curso',
  'Otro',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FormacionAcademica;
  onSave: (data: FormacionAcademicaRequest, id?: number) => Promise<void>;
}

interface FormState {
  institucion: string;
  carrera: string;
  fechaInicio: string;
  fechaFinalizacion: string;
  actualmenteEstudiando: boolean;
  descripcion: string;
  nivel: string;
}

const EMPTY_FORM: FormState = {
  institucion: '',
  carrera: '',
  fechaInicio: '',
  fechaFinalizacion: '',
  actualmenteEstudiando: false,
  descripcion: '',
  nivel: '',
};

export default function AcademicFormModal({ isOpen, onClose, initialData, onSave }: Props) {
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Fecha máxima = hoy en zona horaria de Bolivia
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

  const today = getToday();

  // Inicializar / resetear formulario al abrir/cerrar o cambiar initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        institucion: initialData.institucion,
        carrera: initialData.carrera,
        fechaInicio: initialData.fechaInicio ?? '',
        fechaFinalizacion: initialData.fechaFinalizacion ?? '',
        actualmenteEstudiando: initialData.actualmenteEstudiando,
        descripcion: initialData.descripcion ?? '',
        nivel: initialData.nivel ?? '',
      });
      setCharCount(initialData.descripcion?.length ?? 0);
    } else {
      setFormData(EMPTY_FORM);
      setCharCount(0);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // ── Validaciones blur ────────────────────────────────────────────────────────
  const handleBlur = (field: string, value: string) => {
    let error = '';
    if (field === 'institucion') {
      if (!value.trim()) {
        error = 'La institución es obligatoria.';
      } else if (value.length > 100) {
        error = 'El texto no puede superar los 100 caracteres.';
      }
    }
    if (field === 'carrera') {
      if (!value.trim()) {
        error = 'El título / carrera es obligatorio.';
      } else if (value.length > 100) {
        error = 'El texto no puede superar los 100 caracteres.';
      }
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ── Validación completa al enviar ───────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.institucion.trim()) {
      newErrors.institucion = 'La institución es obligatoria.';
    } else if (formData.institucion.length > 100) {
      newErrors.institucion = 'El texto no puede superar los 100 caracteres.';
    }

    if (!formData.nivel) {
      newErrors.nivel = 'Debes seleccionar un nivel / grado académico.';
    }

    if (!formData.carrera.trim()) {
      newErrors.carrera = 'El título / carrera es obligatorio.';
    } else if (formData.carrera.length > 100) {
      newErrors.carrera = 'El texto no puede superar los 100 caracteres.';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria.';
    }

    if (!formData.actualmenteEstudiando && !formData.fechaFinalizacion) {
      newErrors.fechaFinalizacion = 'Indica la fecha de finalización o marca "Aún no lo finalicé".';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;

    const request: FormacionAcademicaRequest = {
      institucion: formData.institucion.trim(),
      carrera: formData.carrera.trim(),
      fechaInicio: formData.fechaInicio,
      fechaFinalizacion: formData.actualmenteEstudiando ? null : formData.fechaFinalizacion || null,
      actualmenteEstudiando: formData.actualmenteEstudiando,
      descripcion: formData.descripcion.trim(),
      nivel: formData.nivel,
    };

    setIsLoading(true);
    try {
      await onSave(request, initialData?.idFormacionAcademica);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <style
        dangerouslySetInnerHTML={{
          __html: `.date-input-ac::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; }`,
        }}
      />
      <div className="bg-[#0f111a] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[24px] border border-white/10 p-8 shadow-2xl scrollbar-thin scrollbar-thumb-[#2c2f48]">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">
            {isEditing ? 'Editar formación académica' : 'Agregar formación académica'}
          </h2>
          <p className="text-[#9ca3af] text-sm mt-1">
            Registra tus títulos académicos y cursos certificados.
          </p>
        </div>

        <div className="space-y-5">

          {/* ── Institución ── */}
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
                id="ac-institucion"
                className={`w-full bg-[#1a1c29] border ${errors.institucion ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-3.5 text-white outline-none focus:border-[#6c63ff] text-sm transition-colors`}
                placeholder="Ej. Universidad Complutense"
                value={formData.institucion}
                maxLength={120}
                onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                onBlur={(e) => handleBlur('institucion', e.target.value)}
              />
            </div>
            {errors.institucion && (
              <p className="text-red-400 text-xs mt-1">{errors.institucion}</p>
            )}
          </div>

          {/* ── Nivel / Grado ── */}
          <div>
            <label className="text-[#9ca3af] text-sm block mb-2">
              Nivel / Grado *
            </label>
            <div className="relative">
              <select
                id="ac-nivel"
                className={`w-full bg-[#1a1c29] border ${errors.nivel ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#6c63ff] transition-colors appearance-none cursor-pointer`}
                value={formData.nivel}
                onChange={(e) => {
                  setFormData({ ...formData, nivel: e.target.value });
                  if (e.target.value) setErrors((prev) => ({ ...prev, nivel: '' }));
                }}
              >
                <option value="" disabled className="bg-[#1a1c29] text-[#6b7280]">
                  Selecciona un nivel
                </option>
                {NIVELES.map((n) => (
                  <option key={n} value={n} className="bg-[#1a1c29]">
                    {n}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            {errors.nivel && (
              <p className="text-red-400 text-xs mt-1">{errors.nivel}</p>
            )}
          </div>

          {/* ── Título / Carrera ── */}
          <div>
            <label className="text-[#9ca3af] text-sm block mb-2">
              Título / Carrera *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 1.1 3.6 2 6 2s6-.9 6-2v-5" />
                </svg>
              </span>
              <input
                id="ac-carrera"
                className={`w-full bg-[#1a1c29] border ${errors.carrera ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-3.5 text-white outline-none focus:border-[#6c63ff] text-sm transition-colors`}
                placeholder="Ej. Ingeniería en Sistemas"
                value={formData.carrera}
                maxLength={120}
                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                onBlur={(e) => handleBlur('carrera', e.target.value)}
              />
            </div>
            {errors.carrera && (
              <p className="text-red-400 text-xs mt-1">{errors.carrera}</p>
            )}
          </div>

          {/* ── Fechas ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fecha inicio */}
            <div>
              <label className="text-[#9ca3af] text-sm block mb-2">
                Fecha de inicio *
              </label>
              <input
                id="ac-fecha-inicio"
                type="date"
                max={today}
                onKeyDown={(e) => e.preventDefault()}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                className={`date-input-ac w-full bg-[#1a1c29] border ${errors.fechaInicio ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 text-[#9ca3af] text-sm cursor-pointer outline-none focus:border-[#6c63ff] transition-colors`}
                value={formData.fechaInicio}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    fechaInicio: e.target.value,
                    fechaFinalizacion: '',
                  });
                  if (e.target.value) setErrors((prev) => ({ ...prev, fechaInicio: '' }));
                }}
              />
              {errors.fechaInicio && (
                <p className="text-red-400 text-xs mt-1">{errors.fechaInicio}</p>
              )}
            </div>

            {/* Fecha finalización */}
            <div className="relative">
              <label className="text-[#9ca3af] text-sm block mb-2">
                Fecha de finalización {!formData.actualmenteEstudiando && '*'}
              </label>
              <input
                id="ac-fecha-fin"
                type="date"
                disabled={formData.actualmenteEstudiando || !formData.fechaInicio}
                onKeyDown={(e) => e.preventDefault()}
                onClick={(e) =>
                  !e.currentTarget.disabled &&
                  (e.currentTarget as HTMLInputElement).showPicker?.()
                }
                min={formData.fechaInicio || undefined}
                max={today}
                className={`date-input-ac w-full bg-[#1a1c29] border ${errors.fechaFinalizacion ? 'border-red-500' : 'border-white/10'} rounded-xl p-3.5 text-[#9ca3af] text-sm disabled:opacity-30 cursor-pointer outline-none focus:border-[#6c63ff] transition-colors`}
                value={formData.fechaFinalizacion}
                onChange={(e) => {
                  setFormData({ ...formData, fechaFinalizacion: e.target.value });
                  if (e.target.value) setErrors((prev) => ({ ...prev, fechaFinalizacion: '' }));
                }}
              />
              {!formData.fechaInicio && !formData.actualmenteEstudiando && (
                <p className="text-[#6c63ff] text-[10px] mt-1">
                  Seleccione fecha de inicio
                </p>
              )}
              {errors.fechaFinalizacion && formData.fechaInicio && !formData.actualmenteEstudiando && (
                <p className="text-red-400 text-xs mt-1">{errors.fechaFinalizacion}</p>
              )}
            </div>
          </div>

          {/* ── Checkbox aún estudiando ── */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ac-actualmente-estudiando"
              checked={formData.actualmenteEstudiando}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  actualmenteEstudiando: e.target.checked,
                  fechaFinalizacion: e.target.checked ? '' : formData.fechaFinalizacion,
                });
                if (e.target.checked) {
                  setErrors((prev) => ({ ...prev, fechaFinalizacion: '' }));
                }
              }}
              className="w-4 h-4 rounded border-white/10 bg-[#1a1c29] accent-[#6c63ff] shrink-0"
            />
            <label htmlFor="ac-actualmente-estudiando" className="text-[#9ca3af] text-xs cursor-pointer select-none">
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
              id="ac-descripcion"
              maxLength={500}
              className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white h-28 resize-none text-sm focus:border-[#6c63ff] outline-none transition-colors placeholder:text-[#4b5563]"
              placeholder="Describe tus principales logros, asignaturas relevantes o proyectos..."
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
            id="ac-btn-aceptar"
            onClick={handleSave}
            disabled={isLoading}
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
            id="ac-btn-cancelar"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-50"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
