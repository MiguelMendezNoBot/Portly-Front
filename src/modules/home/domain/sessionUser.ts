export function decodeJwtEmail(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as {
      email?: string;
      sub?: string;
    };
    const candidate = payload.email || payload.sub || '';
    return String(candidate).includes('@') ? String(candidate) : null;
  } catch {
    return null;
  }
}

export function emailToDisplayName(email: string): string {
  const local = email.split('@')[0];
  return local.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
