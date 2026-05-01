import { useEffect, useRef } from 'react';
import { UserTab } from '../components/UserTab';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import PestanaEsquina from '../../../../shared/components/CornerTab';
import { Toast } from '../../../../shared/components/Toast';
import { useToast } from '../../../../shared/hooks/useToast';

export const HomePage = () => {
  const { toast, showToast } = useToast();
  const toastShown = useRef(false);

  useEffect(() => {
    if (toastShown.current) return;
    if (sessionStorage.getItem('logout_success') === '1') {
      sessionStorage.removeItem('logout_success');
      toastShown.current = true;
      showToast('Sesión cerrada con éxito', 'success');
    } else if (sessionStorage.getItem('oauth_login_success') === '1') {
      sessionStorage.removeItem('oauth_login_success');
      toastShown.current = true;
      showToast('Sesión iniciada con éxito', 'success');
    }
  }, []);

  return (
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center font-sans">
      <div className="relative w-full h-[calc(100vh-2.5rem)] bg-src-0d152b rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">

        {/* Toast de logout - posicionado arriba al centro */}
        {toast && (
          <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl transition-all ${
              toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Desktop: pestaña blanca con esquinas redondeadas */}
        <PestanaEsquina>
          <UserTab />
        </PestanaEsquina>

        {/* Mobile: botón de perfil flotante sin pestaña blanca */}
        <div className="md:hidden absolute top-4 right-4 z-50">
          <UserTab />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-20 sm:pt-0 scrollbar-thin">
          <Navbar />
          <HeroSection />
        </div>
      </div>
    </div>
  );
};
