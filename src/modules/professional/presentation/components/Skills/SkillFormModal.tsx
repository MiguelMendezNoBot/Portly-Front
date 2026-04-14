import { useState, useEffect } from 'react';
import { Skill, SkillLevel } from '../../../domain/entities/Skill';
import {
  SKILL_LEVELS,
  LEVEL_DESCRIPTIONS,
  PREDEFINED_SKILLS,
} from '../../../domain/skillLevels';
import { cn } from '../../../../../shared/utils/cn';

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, level: SkillLevel) => Promise<void> | void;
  initialData?: Skill; // si existe, es edición
  isSaving?: boolean;
}

export default function SkillFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
}: SkillFormModalProps) {
  const [name, setName] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('Básico');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const isEditing = !!initialData;

  // Resetear formulario cuando se abre/cierra o cambia initialData
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setSelectedLevel(initialData.level);
        // Determinar si el nombre es del catálogo o personalizado
        if (PREDEFINED_SKILLS.includes(initialData.name)) {
          setShowCustomInput(false);
          setCustomName('');
        } else {
          setShowCustomInput(true);
          setCustomName(initialData.name);
        }
      } else {
        // Estado predeterminado
        setName('');
        setCustomName('');
        setSelectedLevel('Básico');
        setShowCustomInput(false);
      }
      setError(null);
      setTouched(false);
    }
  }, [isOpen, initialData]);

  const handleNameSelect = (value: string) => {
    setTouched(true);
    if (value === 'Otro') {
      setShowCustomInput(true);
      setName('');
      setCustomName('');
    } else {
      setShowCustomInput(false);
      setName(value);
      setCustomName('');
    }
  };

  const handleCustomNameChange = (value: string) => {
    setCustomName(value);
    setName(value);
    setTouched(true);
  };

  const handleLevelSelect = (level: SkillLevel) => {
    setSelectedLevel(level);
  };

  const validate = (): boolean => {
    const finalName = showCustomInput ? customName.trim() : name.trim();
    if (!finalName) {
      setError('El nombre de la habilidad es obligatorio');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    setTouched(true);
    if (!validate()) return;
    const finalName = showCustomInput ? customName.trim() : name.trim();
    try {
      await onSave(finalName, selectedLevel);
      onClose();
    } catch (err) {
      // El error ya se maneja en el hook con toast, aquí solo evitamos cerrar
    }
  };

  const finalName = showCustomInput ? customName : name;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-src-0f111a w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <h2 className="text-white text-xl font-semibold">
            {isEditing ? 'Editar Habilidad' : 'Agregar Habilidad'}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Campo: Nombre de la habilidad */}
          <div>
            <label className="block text-sm font-medium text-src-a7aab9 mb-2">
              Nombre de la habilidad
            </label>
            {!showCustomInput ? (
              <select
                value={name}
                onChange={(e) => handleNameSelect(e.target.value)}
                className={cn(
                  'w-full px-4 py-3 bg-src-0d1117 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-src-6b72ff/50 transition',
                  error && touched && !name
                    ? 'border-red-500'
                    : 'border-white/10'
                )}
              >
                <option value="" disabled>
                  Selecciona una habilidad
                </option>
                {PREDEFINED_SKILLS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customName}
                onChange={(e) => handleCustomNameChange(e.target.value)}
                placeholder="Escribe el nombre de la habilidad"
                className={cn(
                  'w-full px-4 py-3 bg-src-0d1117 border rounded-xl text-white placeholder:text-src-6b7280 focus:outline-none focus:ring-2 focus:ring-src-6b72ff/50 transition',
                  error && touched && !customName
                    ? 'border-red-500'
                    : 'border-white/10'
                )}
                autoFocus
              />
            )}
            {error && touched && !finalName && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Niveles de dominio */}
          <div>
            <label className="block text-sm font-medium text-src-a7aab9 mb-3">
              Nivel de dominio
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleLevelSelect(level)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                    selectedLevel === level
                      ? 'bg-[#C9BEFF] text-src-1c1154 border-[#C9BEFF] shadow-md'
                      : 'bg-src-0d1117 text-src-a7aab9 border-white/10 hover:bg-src-2a2d3e hover:text-white'
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta informativa de nivel */}
          <div className="mt-4 p-4 bg-src-0d1117/80 rounded-xl border border-white/5">
            <p className="text-src-c4bef8 text-sm leading-relaxed">
              <span className="font-semibold text-white">{selectedLevel}:</span>{' '}
              {LEVEL_DESCRIPTIONS[selectedLevel]}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-src-0d1117/50 border-t border-white/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-src-a7aab9 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-src-6b72ff hover:bg-src-585fe6 text-white font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Guardando...
              </>
            ) : (
              'Aceptar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
