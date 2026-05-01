import { useState, useEffect } from 'react';
import { Skill, SkillLevel } from '../../../domain/entities/Skill';
import {
  SKILL_LEVELS,
  LEVEL_DESCRIPTIONS,
  PREDEFINED_SKILLS,
} from '../../../domain/skillLevels';
import { LevelIcon } from './icons/LevelIcon';

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, level: SkillLevel) => Promise<void> | void;
  initialData?: Skill;
  isSaving?: boolean;
}

export default function SkillFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
}: SkillFormModalProps) {
  const [name, setName] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('Básico');
  const [isCustom, setIsCustom] = useState(false);
  const [showError, setShowError] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedLevel(initialData.level);
        const isPredefined = PREDEFINED_SKILLS.includes(initialData.name);
        if (isPredefined && initialData.name !== 'Otro') {
          setName(initialData.name);
          setIsCustom(false);
        } else {
          setName('Otro');
          setCustomName(initialData.name);
          setIsCustom(true);
        }
      } else {
        setName('');
        setCustomName('');
        setSelectedLevel('Básico');
        setIsCustom(false);
      }
      setShowError(false);
      setServerError(null);
    }
  }, [isOpen, initialData]);

  const handleNameChange = (val: string) => {
    if (isEditing) return; // No permitir cambiar el nombre en edición
    setName(val);
    setIsCustom(val === 'Otro');
    if (val !== 'Otro') setShowError(false);
    setServerError(null);
  };

  const handleAction = async () => {
    const finalName = isEditing ? initialData!.name : (isCustom ? customName.trim() : name);

    if (!finalName || finalName === 'Otro' || finalName === '') {
      setShowError(true);
      return;
    }

    setServerError(null);
    try {
      await onSave(finalName, selectedLevel);
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Error al guardar la habilidad';
      setServerError(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8 pb-0">
          <h2 className="text-white text-2xl font-bold mb-6">
            {isEditing ? 'Editar Habilidad' : 'Agregar Habilidad'}
          </h2>

          <div className="space-y-6">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
                Nombre de la habilidad
              </label>
              <select
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={isEditing}
                className={`w-full bg-[#0d1117] border ${showError && !isCustom && !isEditing ? 'border-red-500' : 'border-white/10'} text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6b72ff]/40 transition-all appearance-none cursor-pointer ${isEditing ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <option value="" disabled>
                  Selecciona una habilidad
                </option>
                {PREDEFINED_SKILLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {isCustom && (
                <input
                  type="text"
                  placeholder="Escribe tu habilidad..."
                  value={customName}
                  onChange={(e) => {
                    if (isEditing) return;
                    setCustomName(e.target.value);
                    setShowError(false);
                    setServerError(null);
                  }}
                  disabled={isEditing}
                  className={`w-full bg-[#0d1117] border ${showError ? 'border-red-500' : 'border-white/10'} text-white rounded-2xl px-5 py-4 mt-3 focus:outline-none focus:ring-2 focus:ring-[#6b72ff]/40 animate-in slide-in-from-top-2 ${isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  autoFocus={!isEditing}
                />
              )}
              {showError && (
                <p className="text-red-400 text-xs mt-2 ml-1">
                  El nombre de la habilidad es obligatorio
                </p>
              )}
              {serverError && !showError && (
                <p className="text-red-400 text-xs mt-2 ml-1">
                  {serverError}
                </p>
              )}
            </div>

            {/* Selector de Niveles */}
            <div className="space-y-3">
              <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
                Nivel de dominio
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      selectedLevel === level
                        ? 'bg-[#C9BEFF] text-[#1c1154] border-[#C9BEFF] shadow-[0_0_15px_rgba(201,190,255,0.3)]'
                        : 'bg-[#0d1117] text-[#a7aab9] border-white/5 hover:bg-white/5'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div
              key={`icon-${selectedLevel}`}
              className="bg-[#22242a] rounded-[40px] p-5 shadow-inner transition-all duration-700 ease-in-out animate-text-change"
            >
              <div className="flex items-center gap-5 min-h-[80px]">
                <div
                  className="flex-shrink-0 animate-text-change"
                  key={`icon-${selectedLevel}`}
                >
                  <LevelIcon
                    key={selectedLevel}
                    level={selectedLevel}
                    size="w-12 h-12"
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p
                    key={selectedLevel}
                    className="text-[#e2e4e7] text-[15px] leading-tight font-thin animate-text-change"
                  >
                    El nivel{' '}
                    <span className="font-bold text-[#f1af51]">
                      {selectedLevel}
                    </span>{' '}
                    {LEVEL_DESCRIPTIONS[selectedLevel]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 rounded-2xl transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={handleAction}
            disabled={isSaving}
            className="flex-1 py-4 bg-[#6b72ff] hover:bg-[#585fe6] text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'ACEPTAR'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}