import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../modules/home/presentation/hooks/useAuth';
import { useUserProfile } from '../../../modules/profile/application/useUserProfile';
import Sidebar from '../Sidebar';
import { PortlyLogoBig } from '../AppShell';
import BotonInicio from '../BotonInicio';

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
    subtitle: 'Puedes visualizar tus portafolios creados, editarlos y crear nuevos',
  },
  '/explorar': {
    title: 'Explorar',
    subtitle: 'Descubre portafolios públicos de profesionales',
  },
  '/professional-profile': {
    title: 'Perfil profesional',
    subtitle:
      'Puedes editar tu trayectoria laboral y académica además de publicar tus proyectos',
  },
  '/visibility': {
    title: 'Visibilidad',
    subtitle: 'Controla qué información es visible en tu perfil público',
  },
  '/integrations': {
    title: 'Integraciones',
    subtitle: 'Vincula tus cuentas externas para enriquecer tu perfil',
  },
};

export default function AuthenticatedLayout() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentMeta = routeMeta[location.pathname] || {
    title: 'Portly',
    subtitle: '',
  };

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

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : (user.displayName || 'Usuario');
  const avatarUrl = profile?.avatarUrl;

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
            <Sidebar userName={fullName} avatarUrl={avatarUrl} />
          </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-thin px-5">
            <Outlet />
          </div>
        </div>

        {/* Drawer móvil para Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="md:hidden absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
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
                <Sidebar userName={fullName} avatarUrl={avatarUrl} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
