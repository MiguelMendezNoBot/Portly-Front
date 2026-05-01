import { useState, useEffect, useCallback } from 'react';
import { useTemplates } from '../../application/useTemplates';
import { usePortfolios } from '../../application/usePortfolios';
import type { Template } from '../../domain/entities/Template';
import PortfolioList from '../components/PortfolioList';
import TemplateGallery from '../components/TemplateGallery';
import TemplatePreview from '../components/TemplatePreview';

// Toast local simple
function useLocalToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const show = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);
  return { toast, show };
}

export default function PortfoliosPage() {
  const { templates, loading: loadingTemplates, error: templatesError } = useTemplates();
  const { portfolios, loading: loadingPortfolios, creating, createPortfolio, deletePortfolio } = usePortfolios();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast, show: showToast } = useLocalToast();

  // Seleccionar la primera plantilla por defecto cuando cargan
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  const handleCreate = useCallback(async (templateId: string) => {
    try {
      await createPortfolio({
        templateId,
        nombre: selectedTemplate?.nombre ? `Mi portafolio - ${selectedTemplate.nombre}` : 'Mi portafolio',
        visibilidad: 'PUBLICO',
      });
      showToast('¡Portafolio creado! Abriéndolo en una nueva pestaña…', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error al crear el portafolio', 'error');
    }
  }, [createPortfolio, selectedTemplate, showToast]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePortfolio(id);
      showToast('Portafolio eliminado', 'success');
    } catch {
      showToast('Error al eliminar el portafolio', 'error');
    }
  }, [deletePortfolio, showToast]);

  return (
    <div className="relative h-full flex flex-col lg:flex-row gap-6 pt-1 pb-2">
      {/* ───────────── Panel izquierdo: Tus portafolios ───────────── */}
      <section className="flex flex-col gap-4 w-full lg:w-[300px] shrink-0 bg-[#171B28] p-6 rounded-2xl">
        {/* Encabezado */}
        <div className="flex items-baseline gap-3">
          <h2 className="text-white text-3xl font-bold tracking-tight">
            Tus portafolios
          </h2>
          {!loadingPortfolios && (
            <span className="text-[#C9BEFF] text-xs font-semibold">
              ({portfolios.length})
            </span>
          )}
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          <PortfolioList
            portfolios={portfolios}
            loading={loadingPortfolios}
            onDelete={handleDelete}
          />
        </div>
      </section>

      {/* ───────────── Panel derecho: Crear nuevo portafolio ───────────── */}
      <section className="flex-1 min-w-0 flex flex-col gap-4 bg-[#171B28] p-6 rounded-2xl overflow-hidden">
        <h2 className="text-white text-3xl font-bold tracking-tight shrink-0">
          Crear nuevo portafolio
        </h2>

        <div className="flex-1 min-h-0 flex gap-5 overflow-hidden">
          {/* Galería de plantillas */}
          <div className="w-44 shrink-0 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <span className="text-white text-sm font-bold tracking-tight">
                Galería de plantillas
              </span>
              {!loadingTemplates && (
                <span className="text-[#C9BEFF] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                  {templates.length} disponibles
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-0.5">
              {templatesError ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center px-2">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-red-400 text-xs leading-snug">{templatesError}</p>
                  <p className="text-[#4b5563] text-[11px]">Verifica que el backend esté activo</p>
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
          <div className="flex-1 min-w-0 overflow-hidden">
            {selectedTemplate ? (
              <TemplatePreview
                template={selectedTemplate}
                creating={creating}
                onCreatePortfolio={handleCreate}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[#4b5563] text-sm">Selecciona una plantilla para ver la vista previa</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Toast de notificación */}
      {toast && (
        <div
          className={[
            'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
            'px-5 py-3 rounded-2xl shadow-xl text-sm font-medium',
            'backdrop-blur-md border transition-all duration-300',
            toast.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/20 border-red-500/30 text-red-300',
          ].join(' ')}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
