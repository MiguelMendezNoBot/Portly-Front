import { useState, useEffect } from 'react';
import type { Template } from '../../domain/entities/Template';
import TemplateGallery from './TemplateGallery';
import TemplatePreview from './TemplatePreview';

interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  loadingTemplates: boolean;
  templatesError: string | null;
  creating: boolean;
  onCreatePortfolio: (templateId: string, nombre: string) => Promise<void>;
  existingPortfolios: { nombre: string; templateId: string }[];
}

export default function PortfolioFormModal({
  isOpen,
  onClose,
  templates,
  loadingTemplates,
  templatesError,
  creating,
  onCreatePortfolio,
  existingPortfolios,
}: PortfolioFormModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [portfolioName, setPortfolioName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (templates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(templates[0]);
      }
      setPortfolioName('');
      setError(null);
    } else {
      setSelectedTemplate(null);
    }
  }, [isOpen, templates]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!portfolioName.trim()) {
      setError('Debes ingresar un nombre para tu portafolio.');
      return;
    }
    if (!selectedTemplate) {
      setError('Debes seleccionar una plantilla.');
      return;
    }

    const nameMatch = existingPortfolios.some(
      (p) => p.nombre.toLowerCase() === portfolioName.trim().toLowerCase()
    );
    if (nameMatch) {
      setError('Ya existe un portafolio con ese nombre.');
      return;
    }
    setError(null);
    try {
      await onCreatePortfolio(selectedTemplate.id, portfolioName);
      onClose();
    } catch (err) {
      // Error is handled by parent, but we can catch it to not close the modal if there's an error
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0c14]/80 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#171b28] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/10 animate-slide-up h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white">
            Crear nuevo portafolio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
          {/* Nombre Input */}
          <div className="shrink-0 flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-white">
              Nombre del portafolio <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={portfolioName}
              onChange={(e) => {
                setPortfolioName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ej. Mi Portafolio Principal"
              className={`w-full bg-[#0f111a] border rounded-xl px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#7c6bec]/50 transition-all ${
                error ? 'border-red-500/50' : 'border-white/10'
              }`}
            />
            {error && (
              <p className="text-red-400 text-xs font-semibold mt-1">{error}</p>
            )}
          </div>

          {/* Galería y Preview */}
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* Galería de plantillas */}
            <div className="w-full lg:w-56 shrink-0 flex flex-col gap-3 overflow-hidden h-auto lg:h-full">
              <div className="flex items-center justify-between shrink-0">
                <span className="text-white text-sm font-bold tracking-tight">
                  Galería de Plantillas
                </span>
                {!loadingTemplates && (
                  <span className="text-[#C9BEFF] text-[10px] font-bold uppercase tracking-wider bg-[#C9BEFF]/10 px-2 py-0.5 rounded-full">
                    {templates.length}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto scrollbar-thin pr-1 pb-2 lg:pb-0 flex-none lg:flex-1">
                {templatesError ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3 text-center px-2">
                    <p className="text-red-400 text-xs">{templatesError}</p>
                  </div>
                ) : (
                  <TemplateGallery
                    templates={templates}
                    loading={loadingTemplates}
                    selectedId={selectedTemplate?.id ?? null}
                    onSelect={setSelectedTemplate}
                  />
                )}
              </div>
            </div>

            {/* Vista previa */}
            <div className="flex-1 min-h-[350px] lg:min-h-0 min-w-0 overflow-y-auto lg:overflow-hidden bg-[#0f111a] rounded-xl border border-white/5 p-4">
              {selectedTemplate ? (
                <TemplatePreview
                  template={selectedTemplate}
                  creating={creating}
                  onCreatePortfolio={async () => {}} // Disabled here because button is in footer
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#4b5563] text-sm font-medium">
                    Selecciona una plantilla para ver la vista previa
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#13151f] border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-300 hover:text-white transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className={[
              'bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:from-[#a092ec] hover:to-[#8a7be8] text-[#0D0096] py-2.5 px-8 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm',
              creating ? 'opacity-70 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {creating ? 'CREANDO...' : 'CREAR PORTAFOLIO'}
          </button>
        </div>
      </div>
    </div>
  );
}
