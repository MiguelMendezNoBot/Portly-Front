interface AuthUser {
  displayName: string;
  email: string;
}

function decodeJwtEmail(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const candidate = payload.email || payload.sub || '';
    return String(candidate).includes('@') ? String(candidate) : null;
  } catch {
    return null;
  }
}

function emailToDisplayName(email: string): string {
  const local = email.split('@')[0];
  return local
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function useAuth(): { user: AuthUser | null; logout: () => void } {
  const token = localStorage.getItem('token');

  if (!token) return { user: null, logout: () => {} };

  const email =
    localStorage.getItem('email') ||
    decodeJwtEmail(token) ||
    '';

  const displayName = email ? emailToDisplayName(email).toUpperCase() : 'USUARIO';

  const user: AuthUser = { displayName, email };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('email');
    window.location.href = '/login';
  };

  return { user, logout };
}
