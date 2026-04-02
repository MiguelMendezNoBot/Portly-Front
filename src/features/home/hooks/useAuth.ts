interface JwtPayload {
  sub?: string;
  name?: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  [key: string]: unknown;
}

interface AuthUser {
  displayName: string;
  email: string;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function useAuth(): { user: AuthUser | null; logout: () => void } {
  const token = localStorage.getItem('token');

  if (!token) return { user: null, logout: () => {} };

  const payload = decodeJwt(token);
  if (!payload) return { user: null, logout: () => {} };

  const fullName =
    payload.name ||
    [payload.nombre, payload.apellido].filter(Boolean).join(' ') ||
    payload.sub ||
    'Usuario';

  const user: AuthUser = {
    displayName: String(fullName).toUpperCase(),
    email: String(payload.email || payload.sub || ''),
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return { user, logout };
}
