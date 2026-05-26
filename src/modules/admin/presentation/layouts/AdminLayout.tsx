import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../home/presentation/hooks/useAuth';
import { AdminSidebar } from '../components/AdminSidebar';

const routeMeta: Record<string, { title: string; subtitle?: string }> = {
  '/admin/dashboard': {
    title: 'Dashboard',
    subtitle: 'Vista general del sistema',
  },
  '/admin/usuarios': {
    title: 'Usuarios',
    subtitle: 'Gestión de usuarios registrados',
  },
  '/admin/denuncias': {
    title: 'Denuncias',
    subtitle: 'Revisión de contenido reportado',
  },
  '/admin/suspendidos': {
    title: 'Suspendidos',
    subtitle: 'Cuentas con acceso restringido',
  },
  '/admin/reportes': {
    title: 'Reportes',
    subtitle: 'Generación de reportes del sistema',
  },
  '/admin/configuracion': {
    title: 'Configuración',
    subtitle: 'Ajustes globales del panel',
  },
};

export function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentMeta = routeMeta[location.pathname] || {
    title: 'Panel Administrativo',
    subtitle: '',
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user || user.rol !== 'ADMIN') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.rol !== 'ADMIN') {
    return null;
  }

  return (
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-[calc(100vh-2.5rem)] bg-src-0f111a rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
        <div className="md:hidden absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 rounded-full bg-src-9fa2ff flex items-center justify-center text-src-1c1154 shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-5 px-7 pt-5 pb-3 shrink-0">
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

        <div className="flex flex-1 min-h-0 pb-5">
          <div className="hidden md:flex border-r-2 border-white/5 shrink-0 px-2">
            <AdminSidebar />
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-thin px-5 md:px-8">
            <Outlet />
          </div>
        </div>

        {sidebarOpen && (
          <>
            <div
              className="md:hidden absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="md:hidden absolute top-0 left-0 h-full w-72 bg-src-0f111a z-40 shadow-2xl flex flex-col rounded-r-[2rem] overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/10">
                <span className="text-white font-bold text-base tracking-wide">Linx Soft Admin</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AdminSidebar />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
