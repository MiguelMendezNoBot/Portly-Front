import { ConfirmModal } from '../../../../shared/components/ConfirmModal';

interface DeletePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  portfolioName: string;
  isLoading?: boolean;
}

export default function DeletePortfolioModal({
  isOpen,
  onClose,
  onConfirm,
  portfolioName,
  isLoading = false,
}: DeletePortfolioModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="¿Confirmar eliminación?"
      description={`Esta acción eliminará permanentemente tu portafolio "${portfolioName}". El link público dejará de funcionar.`}
      confirmText="ELIMINAR PERMANENTEMENTE"
      cancelText="CANCELAR"
      confirmColor="red"
      isLoading={isLoading}
      icon={
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      }
    />
  );
}
