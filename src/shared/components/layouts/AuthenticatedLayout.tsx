import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../modules/home/presentation/hooks/useAuth';
import { useUserProfile } from '../../../modules/profile/application/useUserProfile';
import Sidebar from '../Sidebar';
import { PortlyLogoBig } from '../AppShell';
import AppealModal from '../../../modules/profile/presentation/components/AppealModal';
import { httpClient } from '../../../infrastructure/http/httpClient';

// Pantalla de bloqueo para cuentas suspendidas (sin header ni sidebar)
function SuspendedLockScreen({
  motivoSuspension,
  onAppeal,
  onLogout,
}: {
  motivoSuspension: string | null;
  onAppeal: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/6 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-md w-full text-center">
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
            onClick={onAppeal}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#7c6bec] to-[#9fa2ff] text-white font-bold text-sm transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(124,107,236,0.3)]"
          >
            Enviar apelación
          </button>
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-all active:scale-95"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

// Metadatos de rutas
const routeMeta: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': {
    title: 'Tablero',
    subtitle: 'Vista general de tu actividad',
  },
  '/analytics': {
    title: 'Mis Analíticas',
    subtitle: 'Puedes visualizar las analíticas de tus portafolios.',
  },
  '/portfolios': {
    title: 'Mis portafolios',
    subtitle:
      'Puedes visualizar tus portafolios creados, editarlos y crear nuevos',
  },
  '/explorar': {
    title: 'Explorar',
    subtitle: 'Descubre portafolios públicos de profesionales',
  },
  '/professional-profile': {
    title: 'Mi Trayectoria',
    subtitle: 'Edita tu trayectoria laboral, académica y publica tus proyectos',
  },
  '/perfil-profesional': {
    title: 'Perfil Profesional',
    subtitle:
      'Define tu titular y descripción profesional para tus portafolios',
  },
  '/visibility': {
    title: 'Visibilidad',
    subtitle: 'Controla qué información es visible en tu perfil público',
  },
  '/integrations': {
    title: 'Integraciones',
    subtitle: 'Vincula tus cuentas externas para enriquecer tu perfil',
  },
  '/social-links': {
    title: 'Redes Sociales',
    subtitle: 'Administra los enlaces a tus redes sociales y plataformas',
  },
};

export default function AuthenticatedLayout() {
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appealOpen, setAppealOpen] = useState(false);
  const [userEstado, setUserEstado] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [motivoSuspension, setMotivoSuspension] = useState<string | null>(null);
  const [hasClosedAppealOnce, setHasClosedAppealOnce] = useState(false);
  const [apelacionPendiente, setApelacionPendiente] = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(false);

  const currentMeta = routeMeta[location.pathname] || {
    title: 'Portly',
    subtitle: '',
  };

  // Obtener estado del usuario directamente del backend
  useEffect(() => {
    httpClient
      .getAuth<{ estado?: string; email?: string; motivoSuspension?: string; apelacionPendiente?: boolean }>(
        '/api/profile',
        'Error al verificar estado'
      )
      .then((data) => {
        setUserEstado(data.estado ?? 'activo');
        setUserEmail(data.email ?? '');
        setMotivoSuspension(data.motivoSuspension ?? null);
        setApelacionPendiente(data.apelacionPendiente ?? false);
      })
      .catch(() => {
        setUserEstado('activo');
      })
      .finally(() => {
        setStatusLoaded(true);
      });
  }, []);

  // Cerrar drawer al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    } else if (user.rol === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.rol === 'ADMIN') {
    return null;
  }

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user.displayName || 'Usuario';
  const avatarUrl = profile?.avatarUrl;
  const estado = userEstado ?? profile?.estado ?? 'activo';
  const email = userEmail || profile?.email || '';
  const sessionKey = email ? `hasSeenRestrictedModal_${email}` : null;
  const hasSeenSession = sessionKey ? sessionStorage.getItem(sessionKey) === 'true' : false;

  // Shell del app para usuario suspendido — sin header, sin sidebar, solo el contenido de suspensión
  if (statusLoaded && estado === 'suspendido') {
    return (
      <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-[calc(100vh-2.5rem)] bg-src-0f111a rounded-[2rem] shadow-2xl overflow-hidden flex items-center justify-center">
          <SuspendedLockScreen
            motivoSuspension={motivoSuspension}
            onAppeal={() => setAppealOpen(true)}
            onLogout={logout}
          />
        </div>
        <AppealModal
          isOpen={appealOpen}
          onClose={() => setAppealOpen(false)}
          userEmail={email}
          canClose={true}
          estado={estado}
          motivoSuspension={motivoSuspension}
          apelacionPendiente={apelacionPendiente}
          onAppealSubmitted={() => setApelacionPendiente(true)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-[calc(100vh-2.5rem)] bg-src-0f111a rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
        {/* Botón hamburguesa móvil (posicionado igual que en UserProfilePage) */}
        <div className="md:hidden absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 rounded-full bg-src-9fa2ff flex items-center justify-center text-src-1c1154 shadow-lg"
            aria-label="Abrir menú"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {/* Espacio para mantener simetría (en perfil hay PillContentMobile, aquí dejamos vacío) */}
          <div className="w-11" />
        </div>

        {/* Encabezado desktop */}
        <div className="hidden md:flex items-center gap-5 px-7 pt-5 pb-3 shrink-0">
          <PortlyLogoBig />
          <div>
            <h1 className="text-white text-2xl font-bold leading-tight">
              {currentMeta.title}
            </h1>
            {currentMeta.subtitle && (
              <p className="text-src-6b7280 text-sm mt-0.5">
                {currentMeta.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Título móvil (visible cuando no hay drawer abierto) */}
        <div className="md:hidden px-5 pt-16 pb-2 shrink-0">
          <h1 className="text-white text-lg font-bold leading-tight">
            {currentMeta.title}
          </h1>
          {currentMeta.subtitle && (
            <p className="text-src-6b7280 text-xs mt-0.5">
              {currentMeta.subtitle}
            </p>
          )}
        </div>

        {/* Contenedor principal: Sidebar (desktop) + contenido */}
        <div className="flex flex-1 min-h-0 pb-5">
          {/* Sidebar fijo en desktop */}
          <div className="hidden md:flex border-r-2 border-gray-800 shrink-0">
            <Sidebar
              userName={fullName}
              avatarUrl={avatarUrl}
              estado={estado}
              onAppealClick={() => setAppealOpen(true)}
            />
          </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-thin px-5">
            <Outlet />
          </div>
        </div>

        {/* Drawer móvil para Sidebar */}
        {sidebarOpen && (
          <>
            <button
              type="button"
              aria-label="Cerrar menú"
              className="md:hidden absolute inset-0 bg-black/60 z-30 backdrop-blur-sm w-full"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="md:hidden absolute top-0 left-0 h-full w-72 bg-src-0f111a z-40 shadow-2xl flex flex-col rounded-r-[2rem] overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src="/portly_logo.png"
                    alt="Portly"
                    className="w-8 h-8"
                  />
                  <span className="text-white font-bold text-base tracking-wide">
                    Portly
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  userName={fullName}
                  avatarUrl={avatarUrl}
                  estado={estado}
                  onAppealClick={() => setAppealOpen(true)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* AppealModal - para cuentas restringidas (la suspendida ya se maneja en el bloqueo) */}
      <AppealModal
        isOpen={appealOpen || (estado === 'restringido' && !hasClosedAppealOnce && !hasSeenSession)}
        onClose={() => {
          if (estado === 'restringido') {
            setHasClosedAppealOnce(true);
            if (sessionKey) {
              sessionStorage.setItem(sessionKey, 'true');
            }
          }
          setAppealOpen(false);
        }}
        userEmail={email}
        canClose={true}
        estado={estado}
        motivoSuspension={motivoSuspension}
        apelacionPendiente={apelacionPendiente}
        onAppealSubmitted={() => {
          setApelacionPendiente(true);
        }}
      />
    </div>
  );
}
