interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
}

export const Toast = ({ toast }: ToastProps) => {
  if (!toast) return null;

  return (
    <div
      className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] text-center text-sm px-4 py-2 rounded-lg text-white shadow-lg transition-all z-50
            ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      {toast.message}
    </div>
  );
};
