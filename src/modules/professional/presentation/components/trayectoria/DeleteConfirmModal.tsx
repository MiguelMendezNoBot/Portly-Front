interface DeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[24px] border border-white/10 p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M12 2L2 20h20L12 2m0 4l7 12H5l7-12zm0 4h0v4h0v-4zm0 6h0v2h0v-2z" />
          </svg>
        </div>
        <h3 className="text-white text-xl font-bold mb-2">
          ¿Confirmar eliminación?
        </h3>
        <p className="text-[#9ca3af] text-sm mb-8">
          Esta acción eliminará permanentemente la experiencia{' '}
          <strong>{title}</strong> y afectará a todos los portafolios que la
          muestran siendo eliminada en ellos también.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all"
          >
            ELIMINAR PERMANENTEMENTE
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};
