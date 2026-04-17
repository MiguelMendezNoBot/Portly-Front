import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'PRINCIPAL', href: '/', active: true },
  { label: 'PLANTILLAS', href: '#' },
  { label: 'SERVICIOS', href: '#' },
  { label: 'ACERCA DE', href: '#' },
];

export const Navbar = () => {
  return (
    <nav className="flex items-center gap-6 px-6">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-xl bg-src-0d1830 border border-teal-500/20 flex items-center justify-center shadow-lg shadow-teal-500/10 group-hover:border-teal-500/40 transition-colors">
          <img src="/portly_logo.png" alt="Portly" className="w-7 h-7" />
        </div>
        <span className="text-white font-bold text-base tracking-[0.15em]">
          PORTLY
        </span>
      </Link>

      <div className="hidden sm:flex items-center gap-1 bg-black/20 rounded-full px-2 py-1.5 border border-white/5">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
              link.active
                ? 'bg-src-6b72ff text-white shadow-md shadow-src-6b72ff/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
};
