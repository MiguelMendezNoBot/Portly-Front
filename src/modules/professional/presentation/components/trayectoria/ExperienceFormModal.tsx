import { useState, useEffect } from 'react';
import { Experience } from '../../../domain/entities/Experience';
import { HttpExperienceRepository } from '../../../infrastructure/repositories/HttpExperienceRepository';

const repo = new HttpExperienceRepository();

export default function ExperienceFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: any) {
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

  // Obtener fecha actual en formato Bolivia (GMT-4) para el "max" de los inputs
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
        referenciaProfesional: initialData.referenciaProfesional || {
          correoJefe: '',
          numeroJefe: '+591 ',
          cargoJefe: '',
        },
      });
    }
  }, [initialData]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.startsWith('+591 ')) return;
    const digits = value.replace('+591 ', '');
    if (/[^\d]/.test(digits)) return;
    if (digits.length > 8) return;

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
      if (value.length < 5)
        error = 'El texto debe tener al menos 5 caracteres.';
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
      const digits = value.replace('+591 ', '');
      if (digits.length > 0 && digits.length < 8)
        error = 'Debe tener al menos 8 dígitos.';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const arrayToBullets = (arr: string[]) =>
    arr.length > 0 ? arr.map((a) => `• ${a}`).join('\n') : '• ';

  const handleListTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: 'funcionesPrincipales' | 'logros'
  ) => {
    const newValue = e.target.value;
    const lines = newValue.split('\n');
    const cleanLines = lines.map((line) => line.replace(/^•\s*/, ''));
    const filteredLines = cleanLines.filter((l) => l !== '');

    // Contar caracteres con bullets
    const bulletedText = arrayToBullets(filteredLines);
    if (bulletedText.length > 1002) {
      return;
    }

    setFormData({ ...formData, [field]: filteredLines });
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const val = target.value;
      const newValue =
        val.substring(0, start) + '\n• ' + val.substring(target.selectionEnd);
      target.value = newValue;
      target.selectionStart = target.selectionEnd = start + 3;
      const event = new Event('input', { bubbles: true });
      target.dispatchEvent(event);
    }
  };

  const isFormValid = () => {
    // Validar nombreEmpresa
    if (
      !formData.nombreEmpresa.trim() ||
      formData.nombreEmpresa.length < 5 ||
      formData.nombreEmpresa.length > 100
    ) {
      return false;
    }

    // Validar cargo
    if (
      !formData.cargo.trim() ||
      formData.cargo.length < 5 ||
      formData.cargo.length > 100
    ) {
      return false;
    }

    // Validar fechaInicio
    if (!formData.fechaInicio) {
      return false;
    }

    // Validar fechaFin (obligatoria si no está "actualmenteTrabajando")
    if (!formData.actualmenteTrabajando && !formData.fechaFin) {
      return false;
    }

    // Validar correoJefe si tiene valor
    if (formData.referenciaProfesional.correoJefe.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.referenciaProfesional.correoJefe)) {
        return false;
      }
    }

    // Validar numeroJefe si tiene valor
    if (formData.referenciaProfesional.numeroJefe !== '+591 ') {
      const digits = formData.referenciaProfesional.numeroJefe.replace(
        '+591 ',
        ''
      );
      if (digits.length < 8) {
        return false;
      }
    }

    // Validar cargoJefe si tiene valor
    if (formData.referenciaProfesional.cargoJefe.trim()) {
      if (
        formData.referenciaProfesional.cargoJefe.length < 2 ||
        formData.referenciaProfesional.cargoJefe.length > 20
      ) {
        return false;
      }
    }

    // Validar descripcion
    if (!formData.descripcion.trim()) {
      return false;
    }

    // Validar funcionesPrincipales (debe tener al menos un elemento)
    if (
      !formData.funcionesPrincipales ||
      formData.funcionesPrincipales.length === 0
    ) {
      return false;
    }

    // Validar logros (debe tener al menos un elemento)
    if (!formData.logros || formData.logros.length === 0) {
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (initialData?.id) {
        await repo.update(formData);
      } else {
        await repo.save(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <style
        dangerouslySetInnerHTML={{
          __html: `.date-input::-webkit-calendar-picker-indicator { color: white; }`,
        }}
      />
      <div className="bg-[#0f111a] w-full max-w-[1200px] max-h-[90vh] overflow-y-auto rounded-[24px] border border-white/10 p-8 shadow-2xl scrollbar-thin scrollbar-thumb-[#2c2f48]">
        <h2 className="text-white text-2xl font-bold mb-8">
          {initialData
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
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[#6c63ff] text-sm"
                    placeholder="Ej. Microsoft, Freelance..."
                    value={formData.nombreEmpresa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombreEmpresa: e.target.value,
                      })
                    }
                    onBlur={(e) => handleBlur('nombreEmpresa', e.target.value)}
                  />
                  {errors.nombreEmpresa && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.nombreEmpresa}
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
                    <p className="text-red-400 text-xs mt-1">{errors.cargo}</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-white text-lg font-semibold mb-4">
                Periodo de tiempo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                <div>
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Fecha de inicio *
                  </label>
                  <input
                    type="date"
                    max={today}
                    onKeyDown={(e) => e.preventDefault()}
                    onClick={(e) =>
                      (e.currentTarget as HTMLInputElement).showPicker?.()
                    }
                    className="date-input w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-[#9ca3af] text-sm cursor-pointer"
                    value={formData.fechaInicio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaInicio: e.target.value,
                        fechaFin: '',
                      })
                    }
                  />
                </div>
                <div className="relative">
                  <label className="text-[#9ca3af] text-sm block mb-2">
                    Fecha de finalización *
                  </label>
                  <input
                    type="date"
                    disabled={
                      formData.actualmenteTrabajando || !formData.fechaInicio
                    }
                    onKeyDown={(e) => e.preventDefault()}
                    onClick={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget as HTMLInputElement).showPicker?.()
                    }
                    min={formData.fechaInicio}
                    max={today}
                    className="date-input w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-[#9ca3af] text-sm disabled:opacity-30 cursor-pointer"
                    value={formData.fechaFin || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.target.value })
                    }
                  />
                  {!formData.fechaInicio && !formData.actualmenteTrabajando && (
                    <p className="text-[#6c63ff] text-[10px] mt-1 absolute">
                      Seleccione fecha de inicio
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <input
                    type="checkbox"
                    id="currentJob"
                    checked={formData.actualmenteTrabajando}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actualmenteTrabajando: e.target.checked,
                        fechaFin: e.target.checked ? null : formData.fechaFin,
                      })
                    }
                    className="w-5 h-5 rounded border-white/10 bg-[#1a1c29] accent-[#6c63ff] shrink-0"
                  />
                  <label
                    htmlFor="currentJob"
                    className="text-[#9ca3af] text-xs leading-tight"
                  >
                    Actualmente trabajo aquí
                  </label>
                </div>
              </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[#9ca3af] text-sm">
                      Funciones Principales *
                    </label>
                    <span className="text-[#6b7280] text-xs">
                      {arrayToBullets(formData.funcionesPrincipales).length - 2}
                      /1000
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-[#6c63ff] outline-none resize-none leading-relaxed min-h-[90px] max-h-[120px] overflow-y-auto"
                    value={arrayToBullets(formData.funcionesPrincipales)}
                    onChange={(e) =>
                      handleListTextareaChange(e, 'funcionesPrincipales')
                    }
                    onKeyDown={handleListKeyDown}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[#9ca3af] text-sm">Logros *</label>
                    <span className="text-[#6b7280] text-xs">
                      {arrayToBullets(formData.logros).length - 2}/1000
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-[#6c63ff] outline-none resize-none leading-relaxed min-h-[90px] max-h-[120px] overflow-y-auto"
                    value={arrayToBullets(formData.logros)}
                    onChange={(e) => handleListTextareaChange(e, 'logros')}
                    onKeyDown={handleListKeyDown}
                  />
                </div>
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
                  Correo de jefe *
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
                  Número de jefe *
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
                  Cargo de jefe *
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
            Cancelar
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
              'Guardar y cerrar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
