import { ConfirmModal } from '../../../../../shared/components/ConfirmModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  skillName: string;
  isLoading: boolean;
}

export default function DeleteSkillConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  skillName,
  isLoading,
}: Props) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Eliminar habilidad"
      description={`¿Estás seguro de que deseas eliminar permanentemente "${skillName}"? Esta acción no se puede deshacer.`}
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
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
        </svg>
      }
    />
  );
}
