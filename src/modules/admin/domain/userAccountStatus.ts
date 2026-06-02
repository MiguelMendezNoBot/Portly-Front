/** Cuenta con suspensión/restricción activa (alineado con /api/admin/usuarios-suspendidos). */
export function isBlockedAccount(user: {
  estado?: string;
  suspensionActiva?: boolean;
}): boolean {
  if (user.suspensionActiva) return true;
  const est = (user.estado || '').toLowerCase();
  return (
    est === 'suspendido' ||
    est === 'suspendida' ||
    est === 'restringido' ||
    est === 'restringida'
  );
}

export function isActiveAccount(user: {
  estado?: string;
  suspensionActiva?: boolean;
}): boolean {
  return !isBlockedAccount(user);
}

export function countBlockedAccounts(
  users: { estado?: string; suspensionActiva?: boolean }[]
): number {
  return users.filter(isBlockedAccount).length;
}

export function getAccountStatusLabel(user: {
  estado?: string;
  suspensionActiva?: boolean;
}): string {
  const est = (user.estado || '').toLowerCase();
  if (est === 'restringido' || est === 'restringida') return 'Restringido';
  if (
    est === 'suspendido' ||
    est === 'suspendida' ||
    user.suspensionActiva
  ) {
    return 'Suspendido';
  }
  return 'Activo';
}
