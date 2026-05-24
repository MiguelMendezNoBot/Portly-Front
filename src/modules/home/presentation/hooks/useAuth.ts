import { decodeJwtEmail, emailToDisplayName } from '../../domain/sessionUser';

interface AuthUser {
  displayName: string;
  email: string;
  perfilCompleto: boolean;
  rol: string;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

export function useAuth(): { user: AuthUser | null; logout: () => void } {
  const token = localStorage.getItem('token');

  if (!token) return { user: null, logout: () => {} };

  const email = localStorage.getItem('email') || decodeJwtEmail(token) || '';

  const displayName = email
    ? emailToDisplayName(email).toUpperCase()
    : 'USUARIO';

  const payload = decodeJwtPayload(token);
  const perfilCompleto = payload?.perfilCompleto !== false;
  const rol = typeof payload?.rol === 'string' ? payload.rol.toUpperCase() : 'USER';

  const user: AuthUser = { displayName, email, perfilCompleto, rol };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('email');

    // Flag for success toast on home page
    sessionStorage.setItem('logout_success', '1');

    // Replace current history entry so back button doesn't return here
    window.history.replaceState(null, '', '/');
    // Push home state to ensure clean navigation stack
    window.history.pushState(null, '', '/');

    window.location.href = '/';
  };

  return { user, logout };
}
