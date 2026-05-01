import { useState, useEffect, useCallback } from 'react';
import { useTemplates } from '../../application/useTemplates';
import { usePortfolios } from '../../application/usePortfolios';
import type { Template } from '../../domain/entities/Template';
import PortfolioList from '../components/PortfolioList';
import PortfolioFormModal from '../components/PortfolioFormModal';
import DeletePortfolioModal from '../components/DeletePortfolioModal';
import type { Portfolio } from '../../domain/entities/Portfolio';

// Toast local simple
function useLocalToast() {
  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error';
  } | null>(null);
  const show = useCallback(
    (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );
  return { toast, show };
}

export default function PortfoliosPage() {
  const {
    templates,
    loading: loadingTemplates,
    error: templatesError,
  } = useTemplates();
  const {
    portfolios,
    loading: loadingPortfolios,
    creating,
    createPortfolio,
    deletePortfolio,
  } = usePortfolios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'delete' | null>(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, show: showToast } = useLocalToast();

  // Removed selectedTemplate default effect, handled in modal

  const handleCreate = useCallback(
    async (templateId: string, nombre: string) => {
      try {
        await createPortfolio({
          templateId,
          nombre,
          visibilidad: 'PRIVADO',
        });
        showToast('¡Portafolio creado!', 'success');
        setIsModalOpen(false);
      } catch (err: any) {
        showToast(err?.message || 'Error al crear el portafolio', 'error');
        throw err; // rethrow to keep modal open
      }
    },
    [createPortfolio, showToast]
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      const portfolio = portfolios.find((p) => p.id === id);
      if (portfolio) {
        setPortfolioToDelete(portfolio);
      }
    },
    [portfolios]
  );

  const confirmDelete = useCallback(async () => {
    if (!portfolioToDelete) return;
    setIsDeleting(true);
    try {
      await deletePortfolio(portfolioToDelete.id);
      showToast('Portafolio eliminado', 'success');
      setPortfolioToDelete(null);
      setMode(null);
    } catch {
      showToast('Error al eliminar el portafolio', 'error');
    } finally {
      setIsDeleting(false);
    }
  }, [deletePortfolio, portfolioToDelete, showToast]);

  return (
    <div className="relative h-full flex flex-col pt-1 pb-2 animate-fade-in">
      <section className="flex flex-col gap-6 w-full">
        {/* Encabezado */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight flex items-baseline gap-3">
              Tus portafolios
              {!loadingPortfolios && (
                <span className="text-[#C9BEFF] text-sm font-semibold">
                  ({portfolios.length})
                </span>
              )}
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              Gestiona y crea tus presentaciones profesionales.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            {/* Agregar */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-4 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap uppercase tracking-wide"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              AÑADIR PORTAFOLIO
            </button>

            {portfolios.length > 0 && (
              <button
                onClick={() =>
                  setMode((prev) => (prev === 'delete' ? null : 'delete'))
                }
                className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                  mode === 'delete'
                    ? 'bg-red-500/15 border-red-500/40 text-red-400'
                    : 'border-white/10 text-[#9ca3af] hover:text-red-400 hover:border-red-500/20'
                }`}
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
                Eliminar
              </button>
            )}
          </div>
        </header>

        {/* Indicador de modo activo */}
        {mode === 'delete' && portfolios.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-red-500/10 border-red-500/20 text-red-400">
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
            <span>Da click a un portafolio para eliminarlo</span>
            <button
              onClick={() => setMode(null)}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          <PortfolioList
            portfolios={portfolios.map((p) => {
              const template = templates.find(
                (t) => String(t.id) === String(p.templateId)
              );
              return {
                ...p,
                previewImageUrl:
                  p.previewImageUrl ||
                  template?.previewImageUrl ||
                  template?.previewUrl,
              };
            })}
            loading={loadingPortfolios}
            mode={mode}
            onDelete={handleDeleteClick}
          />
        </div>
      </section>

      {/* Modal de Creación */}
      <PortfolioFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templates={templates}
        loadingTemplates={loadingTemplates}
        templatesError={templatesError}
        creating={creating}
        onCreatePortfolio={handleCreate}
        existingNames={portfolios.map((p) => p.nombre)}
      />

      <DeletePortfolioModal
        isOpen={!!portfolioToDelete}
        onClose={() => setPortfolioToDelete(null)}
        onConfirm={confirmDelete}
        portfolioName={portfolioToDelete?.nombre || ''}
        isLoading={isDeleting}
      />

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
