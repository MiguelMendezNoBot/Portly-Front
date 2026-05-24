import { NavLink } from 'react-router-dom';

const icons = {
  dashboard: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  flag: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  ban: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  reports: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 4 4-6" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
};

const navCategories = [
  {
    title: 'GENERAL',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: icons.dashboard },
      { to: '/admin/usuarios', label: 'Usuarios', icon: icons.users },
    ]
  },
  {
    title: 'MODERACIÓN',
    items: [
      { to: '/admin/denuncias', label: 'Denuncias', icon: icons.flag },
      { to: '/admin/suspendidos', label: 'Suspendidos', icon: icons.ban },
    ]
  },
  {
    title: 'SISTEMA',
    items: [
      { to: '/admin/reportes', label: 'Reportes', icon: icons.reports },
      { to: '/admin/configuracion', label: 'Configuración', icon: icons.settings },
    ]
  }
];

export function AdminSidebar() {
  return (
    <aside className="flex flex-col w-52 shrink-0 py-4 gap-6">
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-xl bg-src-7c6bec flex items-center justify-center shrink-0 shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" fill="white" />
            <rect x="13" y="2" width="9" height="9" rx="2" fill="white" opacity="0.6" />
            <rect x="2" y="13" width="9" height="9" rx="2" fill="white" opacity="0.6" />
            <rect x="13" y="13" width="9" height="9" rx="2" fill="white" opacity="0.3" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm leading-tight">Linx Soft</span>
          <span className="text-src-9ca3af text-xs">Panel admin</span>
        </div>
      </div>

      <nav className="flex flex-col gap-6">
        {navCategories.map((category, index) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="text-src-6b7280 text-xs font-semibold px-3 mb-1 tracking-wider">
              {category.title}
            </span>
            {category.items.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-src-7c6bec/15 text-src-c4bef8'
                      : 'text-src-5a6278 hover:text-src-9ca3af hover:bg-white/5',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-src-7c6bec rounded-r-full" />
                    )}
                    <span className={isActive ? 'text-src-7c6bec' : ''}>{icon}</span>
                    <span className={isActive ? 'font-medium' : ''}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
