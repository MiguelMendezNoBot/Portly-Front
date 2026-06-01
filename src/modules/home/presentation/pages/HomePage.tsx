import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserTab } from '../components/UserTab';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { BenefitsStrip } from '../components/BenefitsStrip';
import { ContrastSection } from '../components/ContrastSection';
import { FeaturesSection } from '../components/FeaturesSection';
import ExplorePage from '../../../explore/presentation/pages/ExplorePage';
import PestanaEsquina from '../../../../shared/components/CornerTab';
import { useToast } from '../../../../shared/hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { httpClient } from '../../../../infrastructure/http/httpClient';
import AppealModal from '../../../profile/presentation/components/AppealModal';

export const HomePage = () => {
  const { toast, showToast } = useToast();
  const { user, logout } = useAuth();
  const toastShown = useRef(false);
  useScrollReveal();
  const location = useLocation();

  // Leer del cache de sesión para mostrar inmediatamente sin flash
  const cachedEstado = user ? sessionStorage.getItem(`userEstado_${user.email}`) : null;
  const cachedMotivo = user ? sessionStorage.getItem(`userMotivo_${user.email}`) : null;

  const [userEstado, setUserEstado] = useState<string | null>(cachedEstado);
  const [motivoSuspension, setMotivoSuspension] = useState<string | null>(cachedMotivo);
  const [userEmail, setUserEmail] = useState(user?.email ?? '');
  const [apelacionPendiente, setApelacionPendiente] = useState(false);
  const [appealOpen, setAppealOpen] = useState(false);
  // Si ya hay cache, marcar como cargado inmediatamente
  const [statusLoaded, setStatusLoaded] = useState(!!cachedEstado);

  const isExplore = location.pathname.startsWith('/explorar');

  // Verificar estado del usuario al cargar (también actualiza cache)
  useEffect(() => {
    if (!user) return;
    httpClient
      .getAuth<{ estado?: string; email?: string; motivoSuspension?: string; apelacionPendiente?: boolean }>(
        '/api/profile',
        'Error al verificar estado'
      )
      .then((data) => {
        const estado = data.estado ?? 'activo';
        const motivo = data.motivoSuspension ?? null;
        setUserEstado(estado);
        setUserEmail(data.email ?? user.email);
        setMotivoSuspension(motivo);
        setApelacionPendiente(data.apelacionPendiente ?? false);
        // Guardar en cache de sesión para navegación instantánea
        sessionStorage.setItem(`userEstado_${user.email}`, estado);
        if (motivo) {
          sessionStorage.setItem(`userMotivo_${user.email}`, motivo);
        } else {
          sessionStorage.removeItem(`userMotivo_${user.email}`);
        }
      })
      .catch(() => {
        setUserEstado('activo');
      })
      .finally(() => {
        setStatusLoaded(true);
      });
  }, [user]);

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

  // Pantalla de bloqueo para usuario suspendido
  if (user && statusLoaded && userEstado === 'suspendido') {
    return (
      <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center font-sans">
        <div className="relative w-full h-[calc(100vh-2.5rem)] bg-src-0d152b rounded-[2rem] shadow-2xl overflow-hidden flex items-center justify-center">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/6 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-7 max-w-md w-full text-center px-6">
            {/* Ícono de suspensión */}
            <div className="w-24 h-24 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.12)]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>

            {/* Mensaje principal */}
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-3xl font-bold tracking-tight">Cuenta Suspendida</h1>
              <p className="text-[#6b7280] text-sm leading-relaxed max-w-sm">
                Tu cuenta ha sido suspendida y no puedes acceder a ninguna sección de la plataforma.
                Si crees que es un error, puedes enviar una apelación.
              </p>
            </div>

            {/* Motivo de suspensión */}
            {motivoSuspension && (
              <div className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-left">
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider block mb-1">Motivo de la suspensión</span>
                <p className="text-white text-sm leading-relaxed">{motivoSuspension}</p>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setAppealOpen(true)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#7c6bec] to-[#9fa2ff] text-white font-bold text-sm transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(124,107,236,0.3)]"
              >
                Enviar apelación
              </button>
              <button
                onClick={logout}
                className="w-full py-3 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-all active:scale-95"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Modal de apelación */}
        <AppealModal
          isOpen={appealOpen}
          onClose={() => setAppealOpen(false)}
          userEmail={userEmail}
          canClose={true}
          estado={userEstado}
          motivoSuspension={motivoSuspension}
          apelacionPendiente={apelacionPendiente}
          onAppealSubmitted={() => setApelacionPendiente(true)}
        />
      </div>
    );
  }

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

        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-20 sm:pt-0 scrollbar-thin [scrollbar-gutter:stable]">
          <div className="max-w-7xl mx-auto w-full">
            <Navbar />
            {isExplore ? (
              <div className="px-8 pb-10">
                <ExplorePage />
              </div>
            ) : user ? (
              <div className="px-8 pb-10">
                <HeroSection />
              </div>
            ) : (
              /* ── Landing page para visitantes no logueados ── */
              <div className="w-full">
                <HeroSection />
                <BenefitsStrip />
                <ContrastSection />
                <FeaturesSection />
                {/* CTA final */}
                <section className="relative py-24 px-6 text-center overflow-hidden">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full bg-[#7c6bec]/8 blur-3xl" />
                  </div>
                  <div className="reveal relative max-w-xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                      Tu portafolio profesional{' '}
                      <span className="text-shimmer">te está esperando</span>
                    </h2>
                    <p className="text-[#9ca3af] text-lg mb-8">
                      Crea tu portafolio con plantilla, organiza tu experiencia y hazte visible ante quienes importan.
                    </p>
                    <button
                      onClick={() => window.location.href = '/register'}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#7c6bec] text-white font-bold text-base tracking-wide shadow-[0_4px_28px_rgba(124,107,236,0.5)] hover:shadow-[0_8px_40px_rgba(124,107,236,0.65)] hover:-translate-y-1 transition-all duration-300 active:scale-[0.97]"
                    >
                      CREAR MI PORTAFOLIO GRATIS
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                    <p className="mt-4 text-[#5a6278] text-sm">Sin tarjeta de crédito. Sin suscripciones.</p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

