// src/modules/admin/presentation/components/appeal/AppealDetailModal.tsx

import { useState } from 'react';
import { Appeal } from '../../../domain/entities/Appeal';
import { HttpAppealRepository } from '../../../infrastructure/repositories/HttpAppealRepository';

interface Props {
  appeal: Appeal;
  onClose: () => void;
  onUpdate: () => void;
}

const repo = new HttpAppealRepository();

export function AppealDetailModal({ appeal, onClose, onUpdate }: Props) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await repo.approve(appeal.id, 'admin1');
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await repo.reject(appeal.id, 'admin1');
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRejecting(false);
    }
  };

  const isResolved = appeal.estadoApelacion !== 'pendiente';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0f111a] w-full max-w-lg rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-src-7c6bec/10 flex items-center justify-center text-src-7c6bec">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a7.5 7.5 0 0113 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">
                {appeal.userName}
              </h2>
              <p className="text-[#9ca3af] text-sm">{appeal.userEmail}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">
                  Estado cuenta
                </span>
                <p
                  className={`text-sm font-medium ${
                    appeal.estadoCuenta === 'suspendido'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  }`}
                >
                  {appeal.estadoCuenta}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">
                  Apelación
                </span>
                <p
                  className={`text-sm font-medium ${
                    appeal.estadoApelacion === 'pendiente'
                      ? 'text-yellow-400'
                      : appeal.estadoApelacion === 'aprobada'
                        ? 'text-emerald-400'
                        : 'text-red-400'
                  }`}
                >
                  {appeal.estadoApelacion}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">
                Motivo de apelación
              </span>
              <p className="text-white text-sm mt-1 bg-[#1a1c29] p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                {appeal.motivo}
              </p>
            </div>

            <div className="text-xs text-[#6b7280]">
              Recibida el{' '}
              {new Date(appeal.fechaApelacion).toLocaleString('es-BO')}
            </div>
          </div>
        </div>

        {!isResolved && (
          <div className="p-8 pt-0 flex gap-3">
            <button
              onClick={handleReject}
              disabled={isRejecting}
              className="flex-1 py-4 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isRejecting ? (
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Rechazar reactivación'
              )}
            </button>
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-1 py-4 bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isApproving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Reactivar usuario'
              )}
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="p-8 pt-0 w-full text-center text-[#9ca3af] hover:text-white text-sm font-semibold transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
