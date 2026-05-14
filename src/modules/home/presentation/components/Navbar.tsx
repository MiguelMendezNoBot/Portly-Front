import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'PRINCIPAL', href: '/' },
  { label: 'EXPLORAR', href: '/explorar' },
  { label: 'SERVICIOS', href: '#' },
  { label: 'ACERCA DE', href: '#' },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-4 px-8 py-4">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-src-0d1830 to-black border border-white/10 flex items-center justify-center shadow-xl group-hover:border-src-6b72ff/50 transition-all duration-300">
          <img src="/portly_logo.png" alt="Portly" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <span className="text-white font-black text-xl tracking-[0.2em] group-hover:text-src-6b72ff transition-colors">
          PORTLY
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-3 py-2 border border-white/10 shadow-2xl">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`px-6 py-2 rounded-full text-[11px] font-bold tracking-[0.1em] transition-all duration-300 ${
                isActive
                  ? 'bg-src-6b72ff text-white shadow-[0_4px_15px_rgba(107,114,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
