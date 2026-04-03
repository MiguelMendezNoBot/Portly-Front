import { useEffect, useState } from 'react';

export function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const errorParam = params.get('error');

    if (token) {
      localStorage.setItem('token', token);
      const email = params.get('email');
      if (email) localStorage.setItem('email', decodeURIComponent(email));
      window.location.replace('/');
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else {
      setError('No se recibió un token válido.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1629] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error de autenticación</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-[#6B72FF] hover:bg-[#585fe6] text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1629] flex items-center justify-center font-sans">
      <p className="text-white text-sm">Procesando autenticación...</p>
    </div>
  );
}
