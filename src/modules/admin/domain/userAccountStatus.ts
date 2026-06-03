/** Helpers para determinar el estado de cuenta ignorando suspensionActiva. */
export function isSuspendedAccount(user: {
  estado?: string;
}): boolean {
  const est = (user.estado || '').toLowerCase();
  return est === 'suspendido' || est === 'suspendida';
}

export function isRestrictedAccount(user: {
  estado?: string;
}): boolean {
  const est = (user.estado || '').toLowerCase();
  return est === 'restringido' || est === 'restringida';
}

export function isBlockedAccount(user: {
  estado?: string;
}): boolean {
  return isSuspendedAccount(user) || isRestrictedAccount(user);
}

export function isActiveAccount(user: {
  estado?: string;
}): boolean {
  return !isSuspendedAccount(user) && !isRestrictedAccount(user);
}

export function countBlockedAccounts(
  users: { estado?: string; }[]
): number {
  return users.filter(isBlockedAccount).length;
}

export function getAccountStatusLabel(user: {
  estado?: string;
}): string {
  if (isRestrictedAccount(user)) return 'Restringido';
  if (isSuspendedAccount(user)) return 'Suspendido';
  return 'Activo';
}
