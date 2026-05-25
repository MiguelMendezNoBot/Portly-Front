import { useAdminDashboard } from '../../applications/useAdminDashboard';

// ── Iconos ──────────────────────────────────────────────────────────────────

const IconUsuarios = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9a3 3 0 11-6 0 3 3 0 016 0zM12 15a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a3 3 0 11-6 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 9a3 3 0 100 6" />
  </svg>
);

const IconPortafolios = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);

const IconDenuncias = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H11l-1-1H5a2 2 0 00-2 2z" />
  </svg>
);

const IconSuspendidos = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 4.93l14.14 14.14" />
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  sublabel: string;
}

function StatCard({ icon, iconBg, iconColor, label, value, sublabel }: StatCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[20px] p-5 hover:border-white/20 transition-all">
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-src-9ca3af text-sm leading-snug">{label}</p>
      <p className="text-white text-4xl font-extrabold mt-2 leading-none">{value}</p>
      <p className="text-src-6b7280 text-xs mt-2">{sublabel}</p>
    </div>
  );
}

// ── Colores de barras de plantillas ─────────────────────────────────────────

const PLANTILLA_BAR_COLORS = [
  'bg-green-500/70',
  'bg-blue-500/70',
  'bg-white/30',
];

// ── Componente principal ─────────────────────────────────────────────────────

export function DashboardPage() {
  const { stats, isLoading, error, reload } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-src-7c6bec border-t-transparent rounded-full animate-spin" />
        <p className="text-src-9ca3af mt-4 text-sm">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mb-4 border border-red-500/20">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-white text-xl font-bold mb-2">Error al cargar el dashboard</h3>
        <p className="text-src-9ca3af max-w-sm mb-6">{error}</p>
        <button
          onClick={reload}
          className="px-6 py-2.5 rounded-xl bg-src-7c6bec text-white font-semibold hover:bg-src-7c6bec/80 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const maxPlantilla = Math.max(...(stats.plantillasMasUsadas.map(p => p.cantidad)), 1);
  const maxProfesion = Math.max(...(stats.profesionesMasRegistradas.map(p => p.cantidad)), 1);

  return (
    <div className="py-6 animate-fade-in">

      {/* Botón actualizar */}
      <div className="flex justify-end mb-6">
        <button
          onClick={reload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-src-9ca3af text-sm hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <IconRefresh />
          Actualizar
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<IconUsuarios />}
          iconBg="bg-green-500/15"
          iconColor="text-green-400"
          label="Usuarios registrados esta semana"
          value={stats.usuariosRegistradosSemana}
          sublabel="Últimos 7 días"
        />
        <StatCard
          icon={<IconPortafolios />}
          iconBg="bg-cyan-500/15"
          iconColor="text-cyan-400"
          label="Portafolios públicos esta semana"
          value={stats.portafoliosPublicosSemana}
          sublabel="Últimos 7 días"
        />
        <StatCard
          icon={<IconDenuncias />}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
          label="Denuncias pendientes"
          value={stats.denunciasPendientes}
          sublabel="Sin revisar"
        />
        <StatCard
          icon={<IconSuspendidos />}
          iconBg="bg-red-500/15"
          iconColor="text-red-400"
          label="Cuentas suspendidas"
          value={stats.cuentasSuspendidas}
          sublabel="Actualmente suspendidas"
        />
      </div>

      {/* Paneles inferiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Plantillas más usadas */}
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold text-base">Plantillas más usadas</h3>
            <span className="text-xs text-src-9ca3af bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              Top 3
            </span>
          </div>

          {stats.plantillasMasUsadas.length === 0 ? (
            <p className="text-src-9ca3af text-sm text-center py-6">Sin datos disponibles</p>
          ) : (
            <div className="space-y-5">
              {stats.plantillasMasUsadas.map((plantilla, i) => (
                <div key={plantilla.nombre}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-src-9ca3af text-xs w-5">{i + 1}º</span>
                      <span className="text-white text-sm font-medium">{plantilla.nombre}</span>
                    </div>
                    <span className="text-src-9ca3af text-xs">{plantilla.cantidad} portafolios</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${PLANTILLA_BAR_COLORS[i] ?? 'bg-white/20'}`}
                      style={{ width: `${(plantilla.cantidad / maxPlantilla) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profesiones más registradas */}
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold text-base">Profesiones más registradas</h3>
            <span className="text-xs text-src-9ca3af bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              Top 5
            </span>
          </div>

          {stats.profesionesMasRegistradas.length === 0 ? (
            <p className="text-src-9ca3af text-sm text-center py-6">Sin datos disponibles</p>
          ) : (
            <div className="space-y-4">
              {stats.profesionesMasRegistradas.map((profesion, i) => (
                <div key={profesion.nombre}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-src-9ca3af text-xs w-4 shrink-0">{i + 1}</span>
                      <span className="text-white text-sm truncate">{profesion.nombre}</span>
                    </div>
                    <span className="text-src-9ca3af text-xs ml-2 shrink-0">{profesion.cantidad}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-src-7c6bec/60 transition-all duration-500"
                      style={{ width: `${(profesion.cantidad / maxProfesion) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
