import { decodeJwtEmail, emailToDisplayName } from '../../domain/sessionUser';

interface AuthUser {
  displayName: string;
  email: string;
}

export function useAuth(): { user: AuthUser | null; logout: () => void } {
  const token = localStorage.getItem('token');

  if (!token) return { user: null, logout: () => {} };

  const email = localStorage.getItem('email') || decodeJwtEmail(token) || '';

  const displayName = email
    ? emailToDisplayName(email).toUpperCase()
    : 'USUARIO';

  const user: AuthUser = { displayName, email };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('email');
    window.location.href = '/';
  };

  return { user, logout };
}
