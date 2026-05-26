import { useState } from 'react';
import { useAdminSuspendedUsers } from '../../applications/useAdminSuspendedUsers';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import { SuspendedUser } from '../../domain/entities/SuspendedUser';

export function SuspendedUsersPage() {
  const { users, isLoading, error, reactivateUser } = useAdminSuspendedUsers();
  const [selectedUser, setSelectedUser] = useState<SuspendedUser | null>(null);
  const [isReactivating, setIsReactivating] = useState(false);
  const [reactivateMode, setReactivateMode] = useState(false);

  const confirmReactivate = async () => {
    if (!selectedUser) return;
    setIsReactivating(true);
    try {
      await reactivateUser(selectedUser.userId);
      setSelectedUser(null);
      setReactivateMode(false);
    } catch {
      // error handled in hook
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="py-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <h3 className="text-white text-2xl font-bold">Usuarios Suspendidos</h3>

        {users.length > 0 && (
          <button
            onClick={() => setReactivateMode(!reactivateMode)}
            className={`flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold transition-all text-sm whitespace-nowrap ${
              reactivateMode
                ? 'bg-green-500/15 border border-green-500/40 text-green-400 shadow-lg shadow-green-500/10'
                : 'bg-[#171B28] border border-white/10 text-[#9ca3af] hover:text-green-400 hover:border-green-500/20'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Restaurar cuenta
          </button>
        )}
      </div>

      {/* Mode indicator */}
      {reactivateMode && users.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm border bg-green-500/10 border-green-500/20 text-green-400 mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Selecciona un usuario para restaurar su cuenta</span>
          <button
            onClick={() => setReactivateMode(false)}
            className="ml-auto text-xs underline opacity-60 hover:opacity-100"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#171B28] p-6 rounded-2xl border border-white/5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-40 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        /* Empty state */
        <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
          <div className="w-16 h-16 bg-[#1a1c29] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <h4 className="text-white text-lg font-bold mb-2">No hay usuarios suspendidos</h4>
          <p className="text-[#9ca3af] text-sm">Todas las cuentas están activas en este momento.</p>
        </div>
      ) : (
        /* User cards */
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                if (reactivateMode) setSelectedUser(user);
              }}
              className={`group relative bg-[#171B28] rounded-2xl border overflow-hidden transition-all ${
                reactivateMode
                  ? 'cursor-pointer border-green-500/20 hover:bg-green-500/5 hover:border-green-500/40'
                  : 'border-white/5'
              }`}
            >
              <div className="flex items-center gap-4 px-6 py-5">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f8b4b4] to-[#e8756a] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg">
                  {user.userName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white text-base font-bold truncate">{user.userName}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400 shrink-0">
                      suspendido
                    </span>
                  </div>
                  <p className="text-[#9ca3af] text-sm mt-0.5 truncate">{user.motivo}</p>
                  <p className="text-[#6b7280] text-xs mt-0.5">
                    Suspendido el {new Date(user.fechaSuspension).toLocaleDateString('es-BO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Reactivate icon (visible in mode) */}
                {reactivateMode && (
                  <div className="p-2.5 bg-green-500/20 rounded-xl text-green-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm reactivate modal */}
      {selectedUser && (
        <ConfirmModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onConfirm={confirmReactivate}
          title="¿Restaurar cuenta?"
          description={`La cuenta de "${selectedUser.userName}" será reactivada y podrá acceder nuevamente a la plataforma.`}
          confirmText="RESTAURAR CUENTA"
          cancelText="CANCELAR"
          confirmColor="green"
          isLoading={isReactivating}
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      )}
    </div>
  );
}