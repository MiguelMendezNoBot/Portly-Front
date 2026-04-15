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
      title="¿Confirmar eliminación?"
      description={`Esta acción eliminará permanentemente la habilidad "${skillName}"y afectará a todos los portafolios que la muestran siendo eliminada en ellos también.`}
      confirmText="ELIMINAR PERMANENTEMENTE"
      cancelText="CANCELAR"
      confirmColor="red"
      isLoading={isLoading}
      icon={
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <path d="M12 2L2 20h20L12 2m0 4l7 12H5l7-12zm0 4h0v4h0v-4zm0 6h0v2h0v-2z" />
        </svg>
      }
    />
  );
}
