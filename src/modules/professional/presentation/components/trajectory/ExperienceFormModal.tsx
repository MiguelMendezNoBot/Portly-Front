import { useState, useEffect } from 'react';
import { Experience } from '../../../domain/entities/Experience';
import { HttpExperienceRepository } from '../../../infrastructure/repositories/HttpExperienceRepository';
import { DateRangeInput } from '../../../../../shared/components/DateRangeInput';

const repo = new HttpExperienceRepository();

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Experience | null;
  onSuccess: () => void;
  existingExperiences: Experience[];
}

export default function ExperienceFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  existingExperiences,
}: ExperienceFormModalProps) {
  const [formData, setFormData] = useState<Experience>({
    nombreEmpresa: '',
    cargo: '',
    fechaInicio: '',
    fechaFin: '',
    actualmenteTrabajando: false,
    descripcion: '',
    funcionesPrincipales: [],
    logros: [],
    referenciaProfesional: {
      correoJefe: '',
      numeroJefe: '+591 ',
      cargoJefe: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

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

  // ── Carga de datos iniciales ─────────────────────────
  useEffect(() => {
    if (initialData) {
      // Asegurar que funcionesPrincipales y logros sean arrays
      const funcionesArray = Array.isArray(initialData.funcionesPrincipales)
        ? initialData.funcionesPrincipales
        : typeof initialData.funcionesPrincipales === 'string'
          ? (initialData.funcionesPrincipales as string)
              .split('\n')
              .filter((line) => line.trim() !== '')
          : [];
      const logrosArray = Array.isArray(initialData.logros)
        ? initialData.logros
        : typeof initialData.logros === 'string'
          ? (initialData.logros as string)
              .split('\n')
              .filter((line) => line.trim() !== '')
          : [];

      setFormData({
        ...initialData,
        funcionesPrincipales: funcionesArray,
        logros: logrosArray,
        referenciaProfesional: initialData.referenciaProfesional || {
          correoJefe: '',
          numeroJefe: '+591 ',
          cargoJefe: '',
        },
      });
    } else {
      setFormData({
        nombreEmpresa: '',
        cargo: '',
        fechaInicio: '',
        fechaFin: '',
        actualmenteTrabajando: false,
        descripcion: '',
        funcionesPrincipales: [],
        logros: [],
        referenciaProfesional: {
          correoJefe: '',
          numeroJefe: '+591 ',
          cargoJefe: '',
        },
      });
    }
  }, [initialData, isOpen]);

  // ── Manejadores de campos dinámicos ─────────────────
  const handleFuncionChange = (index: number, value: string) => {
    const updated = [...(formData.funcionesPrincipales || [])];
    updated[index] = value;
    setFormData({ ...formData, funcionesPrincipales: updated });
  };

  const addFuncion = () => {
    setFormData({
      ...formData,
      funcionesPrincipales: [...(formData.funcionesPrincipales || []), ''],
    });
  };

  const removeFuncion = (index: number) => {
    const updated = (formData.funcionesPrincipales || []).filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, funcionesPrincipales: updated });
  };

  const handleLogroChange = (index: number, value: string) => {
    const updated = [...(formData.logros || [])];
    updated[index] = value;
    setFormData({ ...formData, logros: updated });
  };

  const addLogro = () => {
    setFormData({
      ...formData,
      logros: [...(formData.logros || []), ''],
    });
  };

  const removeLogro = (index: number) => {
    const updated = (formData.logros || []).filter((_, i) => i !== index);
    setFormData({ ...formData, logros: updated });
  };

  // ── Manejo de teléfono ──────────────────────────────
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d\s+]/g, '');
    setFormData({
      ...formData,
      referenciaProfesional: {
        ...formData.referenciaProfesional,
        numeroJefe: value,
      },
    });
  };

  const handleBlur = (field: string, value: string) => {
    let error = '';
    if ((field === 'nombreEmpresa' || field === 'cargo') && value.trim()) {
      if (value.length < 2)
        error = 'El texto debe tener al menos 2 caracteres.';
      if (value.length > 100)
        error = 'El texto no puede superar los 100 caracteres.';
    }
    if (field === 'correoJefe' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = 'Formato de correo inválido.';
    }
    if (field === 'cargoJefe' && value.trim()) {
      if (value.length < 2) error = 'Mínimo 2 caracteres.';
      if (value.length > 20) error = 'Máximo 20 caracteres.';
    }
    if (field === 'numeroJefe') {
      let digits = value.replace(/\D/g, '');
      if (digits.startsWith('591')) {
        digits = digits.slice(3);
      }
      if (digits.length > 0 && digits.length < 6) {
        error = 'Debe tener al menos 6 dígitos';
      }
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ── Validación (Funciones y Logros NO obligatorios) ─
  const isFormValid = () => {
    if (
      !formData.nombreEmpresa.trim() ||
      formData.nombreEmpresa.length < 2 ||
      formData.nombreEmpresa.length > 100
    )
      return false;
    if (
      !formData.cargo.trim() ||
      formData.cargo.length < 2 ||
      formData.cargo.length > 100
    )
      return false;
    if (!formData.fechaInicio) return false;
    if (!formData.actualmenteTrabajando && !formData.fechaFin) return false;
    if (formData.referenciaProfesional.correoJefe.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.referenciaProfesional.correoJefe))
        return false;
    }
    if (!formData.descripcion.trim()) return false;
    return true;
  };

  // ── Verificación de duplicidad ───────────────────────
  const isDuplicate = (data: Experience): boolean => {
    const currentId = initialData?.id;
    const trimmedNombre = data.nombreEmpresa.trim().toLowerCase();
    const trimmedCargo = data.cargo.trim().toLowerCase();
    return existingExperiences.some(
      (exp) =>
        exp.id !== currentId &&
        exp.nombreEmpresa.trim().toLowerCase() === trimmedNombre &&
        exp.cargo.trim().toLowerCase() === trimmedCargo
    );
  };

  // ── Persistencia real ────────────────────────────────
  const performSave = async () => {
    setIsLoading(true);
    try {
      // No convertimos a string, enviamos los arrays tal cual los espera el backend
      if (initialData?.id) {
        await repo.update(formData);
      } else {
        await repo.save(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) return;
    if (existingExperiences.length > 0 && isDuplicate(formData)) {
      setShowDuplicateWarning(true);
      return;
    }
    await performSave();
  };

  if (!isOpen) return null;

  const isEditing = !!initialData?.id;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <style
          dangerouslySetInnerHTML={{
            __html: `.date-input::-webkit-calendar-picker-indicator { color: white; }`,
          }}
        />
        <div className="bg-[#0f111a] w-full max-w-[1200px] max-h-[90vh] overflow-y-auto rounded-[24px] border border-white/10 p-8 shadow-2xl scrollbar-thin scrollbar-thumb-[#2c2f48]">
          <h2 className="text-white text-2xl font-bold mb-8">
            {isEditing
              ? 'Edición de experiencia laboral'
              : 'Registro de experiencia laboral'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8">
            <div className="space-y-6">
              <section>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Información de la empresa
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#9ca3af] text-sm block mb-2">
                      Nombre de la empresa *
                    </label>
                    <input
                      className={`w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#6c63ff] text-sm ${
                        isEditing ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      placeholder="Ej. Microsoft, Freelance..."
                      value={formData.nombreEmpresa}
                      readOnly={isEditing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombreEmpresa: e.target.value,
                        })
                      }
                      onBlur={(e) =>
                        handleBlur('nombreEmpresa', e.target.value)
                      }
                      title={
                        isEditing
                          ? 'El nombre de la empresa no se puede modificar para preservar la integridad del historial.'
                          : ''
                      }
                    />
                    {errors.nombreEmpresa && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.nombreEmpresa}
                      </p>
                    )}
                    {isEditing && (
                      <p className="text-[#9ca3af] text-[10px] mt-1 italic">
                        El nombre de la empresa no se puede editar.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[#9ca3af] text-sm block mb-2">
                      Cargo / Rol *
                    </label>
                    <input
                      className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#6c63ff] text-sm"
                      placeholder="Ej. Senior Product Designer"
                      value={formData.cargo}
                      onChange={(e) =>
                        setFormData({ ...formData, cargo: e.target.value })
                      }
                      onBlur={(e) => handleBlur('cargo', e.target.value)}
                    />
                    {errors.cargo && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.cargo}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Periodo de tiempo
                </h3>
                <DateRangeInput
                  formData={formData}
                  today={today}
                  setFormData={setFormData}
                />
              </section>

              <section>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Responsabilidades y logros
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-[#9ca3af] text-sm">
                      Descripción *
                    </label>
                    <span className="text-[#6b7280] text-xs">
                      {formData.descripcion.length}/1000
                    </span>
                  </div>
                  <textarea
                    maxLength={1000}
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white h-24 resize-none text-sm focus:border-[#6c63ff] outline-none"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                  />
                </div>

                {/* ── Funciones Principales (dinámico) ──────── */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[#9ca3af] text-sm">
                      Funciones Principales
                    </label>
                    <span className="text-[#6b7280] text-xs">Opcional</span>
                  </div>
                  {formData.funcionesPrincipales?.map((func, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <input
                        className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#6c63ff] outline-none"
                        placeholder={`Función ${idx + 1}`}
                        value={func}
                        onChange={(e) =>
                          handleFuncionChange(idx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeFuncion(idx)}
                        className="p-2 text-[#9ca3af] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        aria-label="Eliminar función"
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
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFuncion}
                    className="flex items-center gap-1.5 text-[#9ca3af] hover:text-white text-xs font-medium mt-1 group transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                    Agregar función
                  </button>
                </div>

                {/* ── Logros (dinámico) ──────────────────────── */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[#9ca3af] text-sm">Logros</label>
                    <span className="text-[#6b7280] text-xs">Opcional</span>
                  </div>
                  {formData.logros?.map((logro, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <input
                        className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#6c63ff] outline-none"
                        placeholder={`Logro ${idx + 1}`}
                        value={logro}
                        onChange={(e) => handleLogroChange(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeLogro(idx)}
                        className="p-2 text-[#9ca3af] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        aria-label="Eliminar logro"
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
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLogro}
                    className="flex items-center gap-1.5 text-[#9ca3af] hover:text-white text-xs font-medium mt-1 group transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                    Agregar logro
                  </button>
                </div>
              </section>
            </div>

            <div className="bg-[#1a1c29]/50 p-6 rounded-2xl h-fit border border-white/5">
              <h3 className="text-white text-lg font-semibold mb-6">
                Referencia profesional
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Correo de jefe
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#0f111a] border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-[#6c63ff] outline-none"
                    value={formData.referenciaProfesional.correoJefe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenciaProfesional: {
                          ...formData.referenciaProfesional,
                          correoJefe: e.target.value,
                        },
                      })
                    }
                    onBlur={(e) => handleBlur('correoJefe', e.target.value)}
                  />
                  {errors.correoJefe && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.correoJefe}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Número de jefe
                  </label>
                  <input
                    value={formData.referenciaProfesional.numeroJefe}
                    onChange={handlePhoneChange}
                    onBlur={(e) => handleBlur('numeroJefe', e.target.value)}
                    className="w-full bg-[#0f111a] border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-[#6c63ff] outline-none"
                  />
                  {errors.numeroJefe && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.numeroJefe}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Cargo de jefe
                  </label>
                  <input
                    className="w-full bg-[#0f111a] border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-[#6c63ff] outline-none"
                    value={formData.referenciaProfesional.cargoJefe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenciaProfesional: {
                          ...formData.referenciaProfesional,
                          cargoJefe: e.target.value,
                        },
                      })
                    }
                    onBlur={(e) => handleBlur('cargoJefe', e.target.value)}
                  />
                  {errors.cargoJefe && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.cargoJefe}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
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
                  <div className="w-4 h-4 border-2 border-[#471499] border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'GUARDAR Y CERRAR'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de advertencia por duplicidad */}
      {showDuplicateWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1c29] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-white text-lg font-semibold mb-3">
              Experiencia duplicada
            </h3>
            <p className="text-[#9ca3af] text-sm mb-6">
              Los datos ingresados corresponden a una experiencia ya registrada.
              ¿Deseas guardar de todas formas?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDuplicateWarning(false)}
                className="px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition"
              >
                CANCELAR
              </button>
              <button
                onClick={() => {
                  setShowDuplicateWarning(false);
                  performSave();
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] text-sm font-bold hover:brightness-110 shadow-lg transition"
              >
                GUARDAR DE TODAS FORMAS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
