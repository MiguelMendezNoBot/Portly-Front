import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);

export const UserTab = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 text-[#6B72FF] font-bold text-sm hover:text-[#585fe6] transition-colors"
      >
        Iniciar Sesión
      </Link>
    );
  }

  const [firstName = '', lastName = ''] = user.displayName.split(' ');

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={logout}
        className="text-[#6B72FF] font-bold text-xs tracking-wide leading-tight hover:text-[#585fe6] transition-colors text-center"
      >
        CERRAR
        <br />
        SESION
      </button>

      <Link
        to="/profile"
        className="flex items-center gap-2 bg-violet-100 border border-violet-200 rounded-full pl-1 pr-4 py-1 hover:bg-violet-200 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-violet-200 flex items-center justify-center text-slate-600">
          <UserIcon />
        </div>
        <span className="text-[#6B72FF] text-xs font-bold tracking-wide leading-tight">
          {firstName}
          <br />
          {lastName}
        </span>
      </Link>
    </div>
  );
};
