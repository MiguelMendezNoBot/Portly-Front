import AppShell from '../../../shared/components/AppShell';

/**
 * PlaceholderPage
 * ──────────────────
 * Página genérica de "en construcción" para rutas que aún no tienen
 * su módulo implementado. Usa AppShell para mantener el shell visual
 * (polígono + sidebar) en todas las rutas.
 *
 * Cuando implementes cada sección real, reemplaza esta página por
 * la definitiva en el AppRouter — no toques este archivo.
 */
interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ title, subtitle, icon }: PlaceholderPageProps) {
  // Para el sidebar necesitamos un usuario; en una app real vendría
  // de un contexto de autenticación global. Por ahora usamos un valor fijo
  // que puedes reemplazar cuando implementes el AuthContext.
  const TEMP_USER = 'Victor Terrazas';

  return (
    <AppShell
      userName={TEMP_USER}
      pageTitle={title}
      pageSubtitle={subtitle}
    >
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center">
        {icon && <div className="text-[#7c6bec]/50 mb-2">{icon}</div>}
        <p className="text-[#4b5563] text-sm">
          Esta sección está en desarrollo.
        </p>
      </div>
    </AppShell>
  );
}
