// src/modules/admin/presentation/pages/AppealPage.tsx

import { useState } from 'react';
import { useAdminAppeal } from '../../applications/useAdminAppeal';
import { AppealDetailModal } from '../components/appeal/AppealDetailModal';
import { Appeal } from '../../domain/entities/Appeal';

const StatusBadge = ({ status }: { status: string }) => {
  const color =
    status === 'pendiente'
      ? 'bg-yellow-500/20 text-yellow-400'
      : status === 'aprobada'
        ? 'bg-emerald-500/20 text-emerald-400'
        : 'bg-red-500/20 text-red-400';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
};

export function AppealPage() {
  const { appeals, isLoading, error, refetch } = useAdminAppeal();
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);

  return (
    <div className="py-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white text-2xl font-bold">Apelaciones</h3>
          <p className="text-[#9ca3af] text-sm mt-1">
            Solicitudes de reactivación de cuentas restringidas o suspendidas.
          </p>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
              <div className="h-3 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : appeals.length === 0 ? (
        <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
          <div className="w-16 h-16 bg-[#1a1c29] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4b5563"
              strokeWidth="1.5"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-white text-lg font-bold mb-2">
            No hay apelaciones
          </h4>
          <p className="text-[#9ca3af] text-sm">
            Cuando un usuario apele su restricción o suspensión, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appeals.map((appeal) => (
            <div
              key={appeal.id}
              onClick={() => setSelectedAppeal(appeal)}
              className="group bg-[#2D3449] p-6 rounded-2xl border border-white/5 hover:bg-[#1f2233] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white text-base font-bold">
                    {appeal.userName}
                  </h4>
                  <p className="text-[#9ca3af] text-sm">
                    {appeal.userEmail} ·{' '}
                    <span
                      className={
                        appeal.estadoCuenta === 'suspendido'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }
                    >
                      {appeal.estadoCuenta}
                    </span>
                  </p>
                </div>
                <StatusBadge status={appeal.estadoApelacion} />
              </div>
              <div className="mt-3 text-sm text-[#9ca3af] line-clamp-2">
                {appeal.motivo}
              </div>
              <div className="mt-2 text-xs text-[#6b7280]">
                {new Date(appeal.fechaApelacion).toLocaleString('es-BO')}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppeal && (
        <AppealDetailModal
          appeal={selectedAppeal}
          onClose={() => setSelectedAppeal(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}
