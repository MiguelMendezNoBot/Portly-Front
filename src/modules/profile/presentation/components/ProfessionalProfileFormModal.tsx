import { useState, useEffect, useRef } from 'react';
import type {
  ProfessionalProfile,
  CreateProfessionalProfileDTO,
} from '../../domain/professionalProfile.entity';

interface ProfessionalProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dto: CreateProfessionalProfileDTO) => Promise<void>;
  onUploadPhoto: (file: File) => Promise<string>;
  initialData?: ProfessionalProfile;
  isSaving?: boolean;
  existingRecords?: ProfessionalProfile[];
}

const BIO_MAX = 500;

const inputClass = `
  w-full bg-[#0d1117] border border-white/10 text-white rounded-2xl px-5 py-4
  focus:outline-none focus:ring-2 focus:ring-[#6b72ff]/40 transition-all
  placeholder-[#6b7280]
`;

export default function ProfessionalProfileFormModal({
  isOpen,
  onClose,
  onSave,
  onUploadPhoto,
  initialData,
  isSaving,
  existingRecords = [],
}: ProfessionalProfileFormModalProps) {
  const [etiqueta, setEtiqueta] = useState('');
  const [titularProfesional, setTitularProfesional] = useState('');
  const [acercaDeMi, setAcercaDeMi] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<CreateProfessionalProfileDTO | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setEtiqueta(initialData?.etiqueta ?? '');
      setTitularProfesional(initialData?.titularProfesional ?? '');
      setAcercaDeMi(initialData?.acercaDeMi ?? '');
      setFotoUrl(initialData?.fotoUrl);
      setShowError(false);
      setServerError(null);
      setShowDuplicateWarning(false);
      setPendingRequest(null);
    }
  }, [isOpen, initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setServerError(null);
    try {
      const url = await onUploadPhoto(file);
      setFotoUrl(url);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Error al subir la foto';
      setServerError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const executeSave = async (request: CreateProfessionalProfileDTO) => {
    setServerError(null);
    try {
      await onSave(request);
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Error al guardar el perfil';
      setServerError(msg);
    }
  };

  const isDuplicate = (request: CreateProfessionalProfileDTO): boolean => {
    return existingRecords.some((rec) => {
      if (rec.id === initialData?.id) return false;
      return (
        rec.etiqueta.trim().toLowerCase() === request.etiqueta.toLowerCase() &&
        (rec.titularProfesional || '').trim().toLowerCase() === (request.titularProfesional || '').toLowerCase() &&
        (rec.acercaDeMi || '').trim().toLowerCase() === (request.acercaDeMi || '').toLowerCase()
      );
    });
  };

  const handleAction = async () => {
    if (!etiqueta.trim()) {
      setShowError(true);
      return;
    }
    
    const request = {
      etiqueta: etiqueta.trim(),
      titularProfesional: titularProfesional.trim(),
      acercaDeMi: acercaDeMi.trim(),
      fotoUrl,
    };

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

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[32px] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="p-8 pb-0">
          <h2 className="text-white text-2xl font-bold mb-6">
            {isEditing ? 'Editar perfil profesional' : 'Nuevo perfil profesional'}
          </h2>

          <div className="space-y-6">
            {/* Foto */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#2D3449] border border-white/10 flex items-center justify-center shrink-0">
                {fotoUrl ? (
                  <img src={fotoUrl} alt="Foto del perfil" className="w-full h-full object-cover" />
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 21a7.5 7.5 0 0113 0" />
                  </svg>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-xs font-bold uppercase tracking-widest text-[#9fa2ff] hover:text-white transition-colors disabled:opacity-50"
              >
                {uploading ? 'Subiendo…' : fotoUrl ? 'Cambiar foto' : 'Subir foto (opcional)'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Etiqueta */}
            <div className="space-y-2">
              <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
                Etiqueta del perfil
              </label>
              <input
                type="text"
                value={etiqueta}
                onChange={(e) => {
                  setEtiqueta(e.target.value);
                  setShowError(false);
                }}
                placeholder="Ej: Perfil Diseñador"
                className={`${inputClass} ${showError ? 'border-red-500' : ''}`}
              />
              {showError && (
                <p className="text-red-400 text-xs mt-2 ml-1">
                  La etiqueta es obligatoria
                </p>
              )}
            </div>

            {/* Titular profesional */}
            <div className="space-y-2">
              <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
                Titular profesional
              </label>
              <input
                type="text"
                value={titularProfesional}
                onChange={(e) => setTitularProfesional(e.target.value)}
                placeholder="Ej: Diseñador UX Senior"
                className={inputClass}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest">
                  Descripción profesional
                </label>
                <span className={`text-xs ${acercaDeMi.length > BIO_MAX ? 'text-red-400' : 'text-[#6b7280]'}`}>
                  {acercaDeMi.length} / {BIO_MAX}
                </span>
              </div>
              <textarea
                value={acercaDeMi}
                onChange={(e) => setAcercaDeMi(e.target.value)}
                maxLength={BIO_MAX}
                rows={4}
                placeholder="Cuéntanos sobre ti..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {serverError && (
              <p className="text-red-400 text-xs ml-1">{serverError}</p>
            )}
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
            disabled={isSaving || uploading}
            className="flex-1 py-4 bg-[#6b72ff] hover:bg-[#585fe6] text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'GUARDAR'
            )}
          </button>
        </div>
      </div>

      {/* ── Modal de error de duplicidad ── */}
      {showDuplicateWarning && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f111a] w-full max-w-sm rounded-[20px] border border-red-500/20 p-7 shadow-2xl">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-base font-bold leading-snug">
                  Perfil duplicado
                </h3>
                <p className="text-[#9ca3af] text-sm mt-2 leading-relaxed">
                  No puedes crear un mismo registro. Ya tienes un Perfil Profesional con estos datos.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowDuplicateWarning(false)}
                className="w-full py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
