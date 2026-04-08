import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'PRINCIPAL', href: '/', active: true },
  { label: 'PREION', href: '#' },
  { label: 'SERVICIOS', href: '#' },
  { label: 'ACERCA DE', href: '#' },
];

const PortlyLogo = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="9"
      height="9"
      rx="2"
      fill="#2dd4bf"
      opacity="0.9"
    />
    <rect
      x="13"
      y="2"
      width="9"
      height="4"
      rx="1.5"
      fill="#2dd4bf"
      opacity="0.5"
    />
    <rect
      x="13"
      y="8"
      width="9"
      height="3"
      rx="1.5"
      fill="#2dd4bf"
      opacity="0.3"
    />
    <rect
      x="2"
      y="13"
      width="4"
      height="9"
      rx="1.5"
      fill="#2dd4bf"
      opacity="0.5"
    />
    <rect
      x="8"
      y="13"
      width="14"
      height="9"
      rx="2"
      fill="#2dd4bf"
      opacity="0.7"
    />
  </svg>
);

export const Navbar = () => {
  return (
    <nav className="flex items-center gap-6 px-6 py-4">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-xl bg-[#0d1830] border border-teal-500/20 flex items-center justify-center shadow-lg shadow-teal-500/10 group-hover:border-teal-500/40 transition-colors">
          <PortlyLogo />
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
                ? 'bg-[#6B72FF] text-white shadow-md shadow-[#6B72FF]/30'
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
