interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
}

export const Toast = ({ toast }: ToastProps) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 text-center text-sm px-6 py-3 rounded-lg text-white shadow-lg z-50
            ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      {toast.message}
    </div>
  );
};

