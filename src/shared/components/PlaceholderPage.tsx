import AppShell from './AppShell';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ title, subtitle, icon }: PlaceholderPageProps) {
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
