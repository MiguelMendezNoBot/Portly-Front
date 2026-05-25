import { useState } from 'react';
import { useAdminSuspendedUsers } from '../../applications/useAdminSuspendedUsers';
import { ConfirmModal } from '../../../../shared/components/ConfirmModal';
import { SuspendedUser } from '../../domain/entities/SuspendedUser';

// Icono de reactivación (check verde)
const ReactivateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type ActionMode = 'reactivate' | null;

export function SuspendedUsersPage() {
  const { users, isLoading, error, reactivateUser } = useAdminSuspendedUsers();
  const [mode, setMode] = useState<ActionMode>(null);
  const [selectedUser, setSelectedUser] = useState<SuspendedUser | null>(null);
  const [isReactivating, setIsReactivating] = useState(false);

  const handleCardClick = (user: SuspendedUser) => {
    if (mode === 'reactivate') {
      setSelectedUser(user);
    }
  };

  const confirmReactivate = async () => {
    if (!selectedUser) return;
    setIsReactivating(true);
    try {
      await reactivateUser(selectedUser.userId);
      setSelectedUser(null);
      setMode(null);
    } catch (err: any) {
      // El error ya se muestra en el hook, pero podríamos agregar un toast local si quisiéramos
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="py-6 animate-fade-in">
      {/* Cabecera */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white text-2xl font-bold">Usuarios suspendidos</h3>
          <p className="text-[#9ca3af] text-sm mt-1">
            Cuentas con acceso restringido. Puedes reactivarlas si es necesario.
          </p>
        </div>

        {/* Botón de modo Reactivar */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          {users.length > 0 && (
            <button
              onClick={() => setMode(mode === 'reactivate' ? null : 'reactivate')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                mode === 'reactivate'
                  ? 'bg-green-500/15 border-green-500/40 text-green-400'
                  : 'border-white/10 text-[#9ca3af] hover:text-green-400 hover:border-green-500/20'
              }`}
            >
              <ReactivateIcon />
              Reactivar
            </button>
          )}
        </div>
      </header>

      {/* Indicador de modo activo */}
      {mode === 'reactivate' && users.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-green-500/10 border-green-500/20 text-green-400 mb-6">
          <ReactivateIcon />
          <span>Da clic a un usuario para reactivar su cuenta</span>
          <button
            onClick={() => setMode(null)}
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

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
              <div className="h-3 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
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
        <div className="space-y-4">
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => handleCardClick(user)}
              className={`group relative bg-[#2D3449] p-6 rounded-2xl border transition-all ${
                mode === 'reactivate'
                  ? 'border-green-500/20 cursor-pointer hover:bg-green-500/10 hover:border-green-500/40'
                  : 'border-white/5 hover:bg-[#1f2233]'
              }`}
            >
              {/* Indicador de acción en hover */}
              {mode === 'reactivate' && (
                <div className="absolute top-5 right-5 p-2 bg-green-500/20 rounded-lg text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ReactivateIcon />
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white text-base font-bold flex items-center gap-2">
                    {user.userName}
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                      suspendido
                    </span>
                  </h4>
                  <p className="text-[#9ca3af] text-sm mt-1">{user.motivo}</p>
                  <p className="text-[#6b7280] text-xs mt-1">
                    Suspendido el {new Date(user.fechaSuspension).toLocaleDateString('es-BO')} por {user.adminId}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación (usando ConfirmModal genérico) */}
      {selectedUser && (
        <ConfirmModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onConfirm={confirmReactivate}
          title="¿Reactivar cuenta?"
          description={`La cuenta de "${selectedUser.userName}" será reactivada y podrá acceder nuevamente a la plataforma.`}
          confirmText="REACTIVAR"
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