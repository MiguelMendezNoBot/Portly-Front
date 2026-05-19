import { useState, useCallback } from 'react';
import { useTemplates } from '../../application/useTemplates';
import { usePortfolios } from '../../application/usePortfolios';
import PortfolioList from '../components/PortfolioList';
import PortfolioFormModal from '../components/PortfolioFormModal';
import DeletePortfolioModal from '../components/DeletePortfolioModal';
import PublishSuccessModal from '../components/PublishSuccessModal';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import type { Portfolio } from '../../domain/entities/Portfolio';
import ViewPortfolioListModal from '../components/ViewPortfolioListModal';

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

// Componente Modal de Compartición (Rediseñado con la identidad de la marca)
interface SharePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio | null;
  publicUrl: string;
}

function SharePortfolioModal({
  isOpen,
  onClose,
  portfolio,
  publicUrl,
}: SharePortfolioModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !portfolio) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error al copiar al portapapeles', err);
    }
  };

  const shareText = `Te comparto mi portafolio profesional: ${portfolio.nombre}`;
  const encodedUrl = encodeURIComponent(publicUrl);
  const encodedText = encodeURIComponent(shareText);

  // Definición de links (Se eliminó X y se prepararon los nuevos)
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=Portafolio%20Profesional&body=${encodedText}%20${encodedUrl}`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md animate-fade-in px-4">
      <div className="bg-[#11111b] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(124,107,236,0.15)] w-full max-w-md overflow-hidden animate-slide-up relative">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#7c6bec]/10 to-transparent pointer-events-none"></div>

        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </div>
            <h3 className="font-bold text-xl tracking-tight">
              Compartir portafolio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl"
          >
            <svg
              width="20"
              height="20"
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

        {/* Contenido */}
        <div className="p-6 flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#9ca3af]">
              Enlace público
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#0a0a0f] border border-white/10 text-[#C9BEFF] text-sm rounded-xl px-4 py-3 focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap">
                {publicUrl}
              </div>
              <button
                onClick={handleCopy}
                className="bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(108,99,255,0.2)] active:scale-95 flex items-center gap-2 shrink-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copiar
              </button>
            </div>
            {copied && (
              <span className="text-emerald-400 text-sm flex items-center gap-1.5 mt-1 font-medium animate-fade-in">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ¡Enlace copiado al portapapeles!
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#9ca3af] text-center">
              O comparte directamente en
            </label>
            <div className="flex justify-center gap-3 flex-wrap mt-1">
              {/* WhatsApp */}
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all w-[75px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-bold text-lg">W</span>
                </div>
                <span className="text-[10px] text-[#9ca3af] group-hover:text-white uppercase font-bold tracking-tighter">
                  WhatsApp
                </span>
              </a>

              {/* Facebook */}
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all w-[75px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-bold text-lg">F</span>
                </div>
                <span className="text-[10px] text-[#9ca3af] group-hover:text-white uppercase font-bold tracking-tighter">
                  Facebook
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all w-[75px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-bold text-lg">L</span>
                </div>
                <span className="text-[10px] text-[#9ca3af] group-hover:text-white uppercase font-bold tracking-tighter">
                  LinkedIn
                </span>
              </a>

              {/* Email */}
              <a
                href={shareLinks.email}
                className="group flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all w-[75px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#a092ec]/20 text-[#a092ec] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-bold text-lg">E</span>
                </div>
                <span className="text-[10px] text-[#9ca3af] group-hover:text-white uppercase font-bold tracking-tighter">
                  Email
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
    unpublishPortfolio,
  } = usePortfolios();

  // Mode flow
  const [mode, setMode] = useState<'delete' | 'preview' | 'share' | null>(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(
    null
  );
  const [portfolioToShare, setPortfolioToShare] = useState<Portfolio | null>(
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

  const [privatizePhase, setPrivatizePhase] = useState<boolean>(false);
  const [portfolioToPrivatize, setPortfolioToPrivatize] =
    useState<Portfolio | null>(null);
  const [isPrivatizing, setIsPrivatizing] = useState(false);

  // List Modal flow
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const { toast, show: showToast } = useLocalToast();

  // Derived
  const hasPrivatePortfolios = portfolios.some(
    (p) => p.visibilidad === 'PRIVADO'
  );
  const hasPublicPortfolios = portfolios.some(
    (p) => p.visibilidad === 'PUBLICO'
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

  const publicPortfoliosWithPreviews = portfoliosWithPreviews.filter(
    (p) => p.visibilidad === 'PUBLICO'
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

  // --- Share handlers ---
  const handleShareClick = useCallback(
    (id: string) => {
      const portfolio = portfolios.find((p) => p.id === id);
      if (portfolio) {
        if (portfolio.visibilidad === 'PRIVADO') {
          showToast(
            'Debes publicar el portafolio antes de compartirlo',
            'error'
          );
          return;
        }
        setPortfolioToShare(portfolio);
      }
    },
    [portfolios, showToast]
  );

  // --- Publish handlers ---
  const handleEnterPublishMode = useCallback(() => {
    setMode(null);
    setPrivatizePhase(false);
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

  const handleEnterPrivatizeMode = useCallback(() => {
    setMode(null);
    setPublishPhase(false);
    setPrivatizePhase(true);
  }, []);

  const handleCancelPrivatizeMode = useCallback(() => {
    setPrivatizePhase(false);
    setPortfolioToPrivatize(null);
  }, []);

  const handlePrivatizeCardClick = useCallback((portfolio: Portfolio) => {
    setPortfolioToPrivatize(portfolio);
  }, []);

  const handleCancelPrivatizeConfirm = useCallback(() => {
    setPortfolioToPrivatize(null);
  }, []);

  const handleConfirmPrivatize = useCallback(async () => {
    if (!portfolioToPrivatize) return;
    setIsPrivatizing(true);
    try {
      await unpublishPortfolio(portfolioToPrivatize.id);
      setPortfolioToPrivatize(null);
      setPrivatizePhase(false);
      showToast('¡Portafolio privatizado!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error al privatizar el portafolio', 'error');
    } finally {
      setIsPrivatizing(false);
    }
  }, [portfolioToPrivatize, unpublishPortfolio, showToast]);

  // Active list mode for PortfolioList
  const listMode =
    mode === 'delete'
      ? 'delete'
      : mode === 'preview'
        ? 'preview'
        : mode === 'share'
          ? 'share'
          : publishPhase
            ? 'publish'
            : privatizePhase
              ? 'privatize'
              : null;

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

            {/* Publicar */}
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

            {hasPublicPortfolios && (
              <button
                onClick={() => {
                  if (privatizePhase) {
                    handleCancelPrivatizeMode();
                  } else {
                    handleEnterPrivatizeMode();
                  }
                }}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                  privatizePhase
                    ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                    : 'border-white/10 text-[#9ca3af] hover:text-orange-400 hover:border-orange-500/30'
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Despublicar
              </button>
            )}

            {/* Visualizar Listado */}
            {portfolios.length > 0 && (
              <button
                onClick={() => {
                  setIsListModalOpen(true);
                  setMode(null);
                  setPublishPhase(false);
                  setPrivatizePhase(false);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20"
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
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                Listar
              </button>
            )}

            {/* Previsualizar */}
            {portfolios.length > 0 && (
              <button
                onClick={() => {
                  setMode((prev) => (prev === 'preview' ? null : 'preview'));
                  setPublishPhase(false);
                  setPrivatizePhase(false);
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

            {/* Compartir */}
            {portfolios.length > 0 && (
              <button
                onClick={() => {
                  setMode((prev) => (prev === 'share' ? null : 'share'));
                  setPublishPhase(false);
                  setPrivatizePhase(false);
                }}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                  mode === 'share'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'border-white/10 text-[#9ca3af] hover:text-emerald-400 hover:border-emerald-500/20'
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
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Compartir
              </button>
            )}

            {/* Eliminar */}
            {portfolios.length > 0 && (
              <button
                onClick={() => {
                  setMode((prev) => (prev === 'delete' ? null : 'delete'));
                  setPublishPhase(false);
                  setPrivatizePhase(false);
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

        {/* Indicador de modo compartir */}
        {mode === 'share' && portfolios.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
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
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Da click a un portafolio para compartirlo</span>
            <button
              onClick={() => setMode(null)}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

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

        {privatizePhase && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border bg-orange-500/10 border-orange-500/20 text-orange-400">
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Escoge un portafolio para privatizarlo</span>
            <button
              onClick={handleCancelPrivatizeMode}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {publishPhase || privatizePhase || mode === 'preview' ? (
            (publishPhase || mode === 'preview'
              ? privatePortfoliosWithPreviews
              : publicPortfoliosWithPreviews
            ).length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-center px-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${privatizePhase ? 'bg-orange-500/10' : 'bg-[#7c6bec]/10'}`}
                >
                  {privatizePhase ? (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      className="text-orange-400"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ) : (
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
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  )}
                </div>
                <p className="text-white font-semibold">
                  {privatizePhase
                    ? 'No hay portafolios públicos'
                    : 'No hay portafolios privados'}
                </p>
                <p className="text-[#5a6278] text-sm max-w-[220px]">
                  {privatizePhase
                    ? 'Todos tus portafolios ya son privados.'
                    : 'Todos tus portafolios ya son públicos.'}
                </p>
              </div>
            ) : (
              <PortfolioList
                portfolios={
                  publishPhase || mode === 'preview'
                    ? privatePortfoliosWithPreviews
                    : publicPortfoliosWithPreviews
                }
                loading={loadingPortfolios}
                mode={listMode}
                onPublish={publishPhase ? handlePublishCardClick : undefined}
                onPrivatize={
                  privatizePhase ? handlePrivatizeCardClick : undefined
                }
                onClick={(p) => {
                  if (listMode === 'preview') {
                    const previewUrl =
                      p.visibilidad === 'PUBLICO' && p.publicUrl
                        ? p.publicUrl
                        : `/p/${p.id}`;
                    window.open(previewUrl, '_blank');
                  }
                }}
              />
            )
          ) : mode === 'share' && publicPortfoliosWithPreviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  className="text-emerald-400"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </div>
              <p className="text-white font-semibold">
                No tienes portafolios públicos
              </p>
              <p className="text-[#5a6278] text-sm max-w-[220px]">
                Publica un portafolio para poder compartirlo.
              </p>
            </div>
          ) : (
            <PortfolioList
              portfolios={
                mode === 'share'
                  ? publicPortfoliosWithPreviews
                  : portfoliosWithPreviews
              }
              loading={loadingPortfolios}
              mode={listMode}
              onDelete={handleDeleteClick}
              onShare={handleShareClick}
              onClick={(p) => {
                if (listMode === 'share') handleShareClick(p.id);
              }}
            />
          )}
        </div>
      </section>

      {/* Modal de Compartición */}
      <SharePortfolioModal
        isOpen={!!portfolioToShare}
        onClose={() => setPortfolioToShare(null)}
        portfolio={portfolioToShare}
        publicUrl={portfolioToShare ? getPublicUrl(portfolioToShare) : ''}
      />

      {/* Modal de Creación */}
      <PortfolioFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templates={templates}
        loadingTemplates={loadingTemplates}
        templatesError={templatesError}
        creating={creating}
        onCreatePortfolio={handleCreate}
        existingPortfolios={portfolios.map((p) => ({
          nombre: p.nombre,
          templateId: String(p.templateId),
        }))}
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
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        }
      />

      <ConfirmModal
        isOpen={!!portfolioToPrivatize}
        onClose={handleCancelPrivatizeConfirm}
        onConfirm={handleConfirmPrivatize}
        title="¿Quieres privatizar este portafolio?"
        description={`"${portfolioToPrivatize?.nombre || ''}" dejará de ser visible para el público.`}
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        confirmColor="red"
        isLoading={isPrivatizing}
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

      {/* Modal de Vista de Lista */}
      <ViewPortfolioListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        portfolios={portfoliosWithPreviews}
      />
    </div>
  );
}
