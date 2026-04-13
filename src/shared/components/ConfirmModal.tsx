interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'blue' | 'green' | 'purple';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const colorClasses = {
  red: 'bg-red-500/10 text-red-500',
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  purple: 'bg-purple-500/10 text-purple-500',
};

const buttonClasses = {
  red: 'bg-red-500 hover:bg-red-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'CONFIRMAR',
  cancelText = 'CANCELAR',
  confirmColor = 'red',
  isLoading = false,
  icon,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[24px] border border-white/10 p-8 shadow-2xl text-center">
        {icon && (
          <div
            className={`w-16 h-16 ${colorClasses[confirmColor]} rounded-full flex items-center justify-center mx-auto mb-6`}
          >
            {icon}
          </div>
        )}
        <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
        <p className="text-[#9ca3af] text-sm mb-8">{description}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-full ${buttonClasses[confirmColor]} text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {confirmText}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
