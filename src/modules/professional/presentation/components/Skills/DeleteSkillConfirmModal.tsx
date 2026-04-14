import { ConfirmModal } from '../../../../../shared/components/ConfirmModal';
import { TrashIcon } from '../icons'; // Asumo que existe o se puede crear

interface DeleteSkillConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  skillName: string;
  isLoading?: boolean;
}

export default function DeleteSkillConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  skillName,
  isLoading,
}: DeleteSkillConfirmModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Eliminar habilidad"
      description={`¿Estás seguro de que deseas eliminar permanentemente "${skillName}"? Esta acción no se puede deshacer.`}
      confirmText="Eliminar permanentemente"
      cancelText="Cancelar"
      confirmColor="red"
      icon={<TrashIcon className="w-6 h-6" />}
      isLoading={isLoading}
    />
  );
}
