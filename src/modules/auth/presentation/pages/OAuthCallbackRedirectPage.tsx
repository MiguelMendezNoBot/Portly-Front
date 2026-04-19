import { useEffect } from 'react';

export function OAuthCallbackRedirectPage({ provider }: { provider: string }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const code = params.get('code');
    const state = params.get('state');

    if (error) {
      
      window.location.replace('/profile?error=access_denied');
      return;
    }

    if (code) {
      
      const backendUrl = import.meta.env.VITE_API_URL;
      const callbackUrl = `${backendUrl}/auth/${provider}/callback?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ''}`;
      window.location.replace(callbackUrl);
      return;
    }

    window.location.replace('/login');
  }, [provider]);

  return (
    <div className="min-h-screen bg-src-0f1629 flex items-center justify-center font-sans">
      <p className="text-white text-sm">Procesando vinculación...</p>
    </div>
  );
}
