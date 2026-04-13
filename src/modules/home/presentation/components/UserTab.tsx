import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ChangePasswordForm from '../../../profile/presentation/components/ChangePasswordForm';

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

const LockIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0110 0v4"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a7.5 7.5 0 0113 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const UserTab = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 text-src-6b72ff font-bold text-sm hover:text-src-585fe6 transition-colors"
      >
        Iniciar Sesión
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center md:gap-2 bg-violet-100 border border-violet-200 rounded-full p-1.5 md:pl-1.5 md:pr-6 md:py-1.5 hover:bg-violet-200 transition-colors cursor-pointer shrink-0"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-violet-200 flex items-center justify-center text-slate-600 shrink-0">
          <UserIcon />
        </div>
        <span className="hidden md:inline text-src-6b72ff text-sm font-semibold tracking-wide px-2 whitespace-nowrap">
          {user.displayName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] w-[220px] bg-src-0f111a rounded-[1.25rem] shadow-2xl py-2 flex flex-col z-50 origin-top-right transition-all">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-5 py-2.5 text-[15px] hover:bg-white/5 transition-colors"
          >
            <span className="text-src-6b72ff">
              <ProfileIcon />
            </span>
            <span className="text-[#e2e2e8] font-medium tracking-wide">
              Perfil
            </span>
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsChangePasswordModalOpen(true);
            }}
            className="flex items-center gap-3 px-5 py-2.5 text-[15px] hover:bg-white/5 transition-colors text-left"
          >
            <span className="text-src-6b72ff">
              <LockIcon />
            </span>
            <span className="text-[#e2e2e8] font-medium tracking-wide">
              Cambiar contraseña
            </span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-5 py-2.5 text-[15px] hover:bg-red-500/10 transition-colors text-left"
          >
            <span className="text-[#ef4444]">
              <LogoutIcon />
            </span>
            <span className="text-[#ef4444] font-medium tracking-wide">
              Cerrar sesión
            </span>
          </button>
        </div>
      )}

      {isChangePasswordModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsChangePasswordModalOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 animate-fade-in origin-top-right">
            <ChangePasswordForm
              email={user.email}
              onCancel={() => setIsChangePasswordModalOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};
