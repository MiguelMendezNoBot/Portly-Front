import { NavLink } from 'react-router-dom';

const icons = {
  home: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  eye: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  link: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  grid: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  folder: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
    </svg>
  ),
  chart: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 4 4-6" />
    </svg>
  ),
  badge: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h5M7 12h8M7 16h4" />
    </svg>
  ),
  user: (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a7.5 7.5 0 0113 0" />
    </svg>
  ),
};

const navItems = [
  { to: '/home', label: 'Inicio', icon: icons.home },
  { to: '/dashboard', label: 'Tablero', icon: icons.grid },
  { to: '/portfolios', label: 'Mis portafolios', icon: icons.folder },
  { to: '/analytics', label: 'Analiticas', icon: icons.chart },
  {
    to: '/professional-profile',
    label: 'Perfil profesional',
    icon: icons.badge,
  },
  { to: '/profile', label: 'Perfil de usuario', icon: icons.user },
  { to: '/visibility', label: 'Visibilidad', icon: icons.eye },
  { to: '/integrations', label: 'Integraciones', icon: icons.link },
];

interface SidebarProps {
  userName: string;
  avatarUrl?: string;
}

export default function Sidebar({ userName, avatarUrl }: SidebarProps) {
  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="flex flex-col w-52 shrink-0 py-4 gap-5">
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-src-7c6bec/30 flex items-center justify-center shrink-0 overflow-hidden border border-src-7c6bec/40">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-src-b0a8f5 text-sm font-semibold">
              {initials}
            </span>
          )}
        </div>
        <span className="text-white font-semibold text-sm leading-snug">
          {userName}
        </span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon }) => (
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
      </nav>
    </aside>
  );
}
