import { useState, useCallback } from 'react';
import { useTemplates } from '../../application/useTemplates';
import { usePortfolios } from '../../application/usePortfolios';
import PortfolioList from '../components/PortfolioList';
import PortfolioFormModal from '../components/PortfolioFormModal';
import DeletePortfolioModal from '../components/DeletePortfolioModal';
import PublishSuccessModal from '../components/PublishSuccessModal';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
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
    publishPortfolio,
  } = usePortfolios();

  // Mode flow
  const [mode, setMode] = useState<'delete' | 'preview' | null>(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Create flow
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [publishPhase, setPublishPhase] = useState<boolean>(false);
  const [portfolioToPublish, setPortfolioToPublish] =
    useState<Portfolio | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedPortfolio, setPublishedPortfolio] =
    useState<Portfolio | null>(null);

  const { toast, show: showToast } = useLocalToast();

  // Derived
  const hasPrivatePortfolios = portfolios.some(
    (p) => p.visibilidad === 'PRIVADO'
  );

  const portfoliosWithPreviews = portfolios.map((p) => {
    const template = templates.find(
      (t) => String(t.id) === String(p.templateId)
    );
    return {
      ...p,
      previewImageUrl:
        p.previewImageUrl || template?.previewImageUrl || template?.previewUrl,
    };
  });

  const privatePortfoliosWithPreviews = portfoliosWithPreviews.filter(
    (p) => p.visibilidad === 'PRIVADO'
  );

  // --- Create handlers ---
  const handleCreate = useCallback(
    async (templateId: string, nombre: string) => {
      try {
        await createPortfolio({ templateId, nombre, visibilidad: 'PRIVADO' });
        showToast('¡Portafolio creado!', 'success');
        setIsModalOpen(false);
      } catch (err: any) {
        showToast(err?.message || 'Error al crear el portafolio', 'error');
        throw err;
      }
    },
    [createPortfolio, showToast]
  );

  // --- Delete handlers ---
  const handleDeleteClick = useCallback(
    (id: string) => {
      const portfolio = portfolios.find((p) => p.id === id);
      if (portfolio) setPortfolioToDelete(portfolio);
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

  // --- Publish handlers ---
  const handleEnterPublishMode = useCallback(() => {
    setMode(null);
    setPublishPhase(true);
  }, []);

  const handleCancelPublishMode = useCallback(() => {
    setPublishPhase(false);
    setPortfolioToPublish(null);
  }, []);

  const handlePublishCardClick = useCallback((portfolio: Portfolio) => {
    setPortfolioToPublish(portfolio);
  }, []);

  const handleCancelPublishConfirm = useCallback(() => {
    setPortfolioToPublish(null);
  }, []);

  const handleConfirmPublish = useCallback(async () => {
    if (!portfolioToPublish) return;
    setIsPublishing(true);
    try {
      const updated = await publishPortfolio(portfolioToPublish.id);
      setPublishedPortfolio(updated);
      setPortfolioToPublish(null);
      setPublishPhase(false);
      showToast('¡Portafolio publicado!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error al publicar el portafolio', 'error');
    } finally {
      setIsPublishing(false);
    }
  }, [portfolioToPublish, publishPortfolio, showToast]);

  const getPublicUrl = (portfolio: Portfolio) => {
    if (portfolio.publicUrl && portfolio.publicUrl.startsWith('http')) {
      return portfolio.publicUrl;
    }
    return `${window.location.origin}/p/${portfolio.id}`;
  };

  // Active list mode for PortfolioList
  const listMode =
    mode === 'delete' ? 'delete' : mode === 'preview' ? 'preview' : publishPhase ? 'publish' : null;

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
              className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-4 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap tracking-wide"
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
              Agregar
            </button>

            {/* Publicar — solo si hay portafolios privados */}
            {hasPrivatePortfolios && (
              <button
                onClick={() => {
                  if (publishPhase) {
                    handleCancelPublishMode();
                  } else {
                    handleEnterPublishMode();
                  }
                }}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                  publishPhase
                    ? 'bg-[#7c6bec]/15 border-[#7c6bec]/40 text-[#C9BEFF]'
                    : 'border-white/10 text-[#9ca3af] hover:text-[#C9BEFF] hover:border-[#7c6bec]/30'
                }`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Publicar
              </button>
            )}

            {/* Previsualizar */}
            {hasPrivatePortfolios && (
              <button
                onClick={() => {
                  setMode((prev) => (prev === 'preview' ? null : 'preview'));
                  setPublishPhase(false);
                }}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                  mode === 'preview'
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                    : 'border-white/10 text-[#9ca3af] hover:text-blue-400 hover:border-blue-500/20'
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Previsualizar
              </button>
            )}

            {/* Eliminar */}
            {portfolios.length > 0 && (
              <button
                onClick={() => {
                  setMode((prev) => (prev === 'delete' ? null : 'delete'));
                  setPublishPhase(false);
                }}
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

        {/* Indicador de modo eliminar */}
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

        {/* Indicador de modo previsualizar */}
        {mode === 'preview' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-blue-500/10 border-blue-500/20 text-blue-400">
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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Da click a un portafolio para previsualizarlo</span>
            <button
              onClick={() => setMode(null)}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Indicador de modo publicar */}
        {publishPhase && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border bg-[#7c6bec]/10 border-[#7c6bec]/20 text-[#C9BEFF]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Escoge un portafolio para publicarlo</span>
            <button
              onClick={handleCancelPublishMode}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {publishPhase || mode === 'preview' ? (
            privatePortfoliosWithPreviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-[#7c6bec]/10 flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="text-[#7c6bec]"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <p className="text-white font-semibold">
                  No hay portafolios privados
                </p>
                <p className="text-[#5a6278] text-sm max-w-[220px]">
                  Todos tus portafolios ya son públicos.
                </p>
              </div>
            ) : (
              <PortfolioList
                portfolios={privatePortfoliosWithPreviews}
                loading={loadingPortfolios}
                mode={listMode}
                onPublish={handlePublishCardClick}
                onClick={(p) => {
                  if (listMode === 'preview') {
                    const previewUrl = p.visibilidad === 'PUBLICO' && p.publicUrl
                      ? p.publicUrl
                      : `/p/${p.id}`;
                    window.open(previewUrl, '_blank');
                  }
                }}
              />
            )
          ) : (
            <PortfolioList
              portfolios={portfoliosWithPreviews}
              loading={loadingPortfolios}
              mode={listMode}
              onDelete={handleDeleteClick}
            />
          )}
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
        existingPortfolios={portfolios.map((p) => ({ nombre: p.nombre, templateId: String(p.templateId) }))}
      />

      {/* Modal de Eliminación */}
      <DeletePortfolioModal
        isOpen={!!portfolioToDelete}
        onClose={() => setPortfolioToDelete(null)}
        onConfirm={confirmDelete}
        portfolioName={portfolioToDelete?.nombre || ''}
        isLoading={isDeleting}
      />

      {/* Modal de Confirmación de Publicación */}
      <ConfirmModal
        isOpen={!!portfolioToPublish}
        onClose={handleCancelPublishConfirm}
        onConfirm={handleConfirmPublish}
        title="¿Quieres publicar este portafolio?"
        description={`"${portfolioToPublish?.nombre || ''}" será visible para cualquier persona con el enlace.`}
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        confirmColor="purple"
        isLoading={isPublishing}
        icon={
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        }
      />

      {/* Modal de éxito de publicación */}
      <PublishSuccessModal
        isOpen={!!publishedPortfolio}
        onClose={() => setPublishedPortfolio(null)}
        portfolioName={publishedPortfolio?.nombre || ''}
        publicUrl={publishedPortfolio ? getPublicUrl(publishedPortfolio) : ''}
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
