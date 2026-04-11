import { useEffect, useState } from 'react';
import {
  saveToken,
  saveUsuarioId,
  saveEmail,
} from '../../../../infrastructure/storage/storage';

function decodeJwtPayload(token: string): Record<string, string> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

export function AuthCallbackPage() {
  // Compute error synchronously from URL params (avoids setState-in-effect)
  const [error] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const errorParam = params.get('error');
    if (token) {
      const payload = decodeJwtPayload(token);
      return payload ? null : 'Token inválido recibido.';
    }
    return errorParam
      ? decodeURIComponent(errorParam)
      : 'No se recibió un token válido.';
  });

  // Side effects only: save tokens and redirect on success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;
    const payload = decodeJwtPayload(token);
    if (!payload) return;
    saveToken(token);
    if (payload.sub) saveUsuarioId(payload.sub);
    if (payload.email) saveEmail(payload.email);
    window.location.replace('/');
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-src-0f1629 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Error de autenticación
          </h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-src-6b72ff hover:bg-src-585fe6 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-src-0f1629 flex items-center justify-center font-sans">
      <p className="text-white text-sm">Procesando autenticación...</p>
    </div>
  );
}
