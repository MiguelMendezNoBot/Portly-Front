import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Appeal } from '../../../domain/entities/Appeal';
import { HttpAppealRepository } from '../../../infrastructure/repositories/HttpAppealRepository';
import { HttpAdminComplaintRepository } from '../../../infrastructure/repositories/HttpAdminComplaintRepository';
import { httpClient } from '../../../../../infrastructure/http/httpClient';
import ViewPortfolioListModal from '../../../../portfolios/presentation/components/ViewPortfolioListModal';
import type { ComplaintGroup } from '../../../domain/entities/Complaint';

interface Props {
  appeal: Appeal;
  onClose: () => void;
  onUpdate: () => void;
}

const repo = new HttpAppealRepository();
const complaintRepo = new HttpAdminComplaintRepository();

export function AppealDetailModal({ appeal, onClose, onUpdate }: Props) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showPortfolios, setShowPortfolios] = useState(false);
  const [userPortfolios, setUserPortfolios] = useState<any[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);

  // Historial de denuncias
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState<ComplaintGroup[] | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchUserPortfolios = async () => {
    setLoadingPortfolios(true);
    try {
      const data = await httpClient.getAuth<any[]>(
        `/api/admin/users/${appeal.userId}/portfolios`,
        'Error al obtener los portafolios'
      );
      const mapped = data.map((p: any) => ({
        id: p.idPortafolio || p.id,
        nombre: p.nombre,
        visibilidad: p.visibilidad,
        urlPublica: p.publicUrl,
        createdAt: p.fechaCreacion,
      }));
      setUserPortfolios(mapped);
      setShowPortfolios(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPortfolios(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await complaintRepo.getUserComplaintHistory(
        String(appeal.userId)
      );
      setHistoryData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleHistory = () => {
    if (!isHistoryOpen && !historyData) {
      loadHistory();
    }
    setIsHistoryOpen(!isHistoryOpen);
  };

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
      <div
        className={`bg-[#0f111a] rounded-[32px] border border-white/10 shadow-2xl w-full transition-all duration-300 ease-in-out ${
          isHistoryOpen ? 'max-w-4xl' : 'max-w-lg'
        } max-h-[88vh] overflow-hidden`}
      >
        <div
          className={`flex flex-col ${isHistoryOpen ? 'md:flex-row' : ''} h-full max-h-[88vh]`}
        >
          {/* Panel izquierdo: contenido principal */}
          <div
            className={`${isHistoryOpen ? 'md:w-1/2' : 'w-full'} overflow-y-auto`}
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-src-7c6bec/10 flex items-center justify-center text-src-7c6bec shrink-0">
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
                <div className="min-w-0">
                  <h2 className="text-white text-2xl font-bold truncate">
                    {appeal.userName}
                  </h2>
                  <p className="text-[#9ca3af] text-sm truncate">
                    {appeal.userEmail}
                  </p>
                  <button
                    onClick={toggleHistory}
                    className={`flex items-center gap-1.5 px-3 py-1 mt-1 rounded-lg text-xs font-semibold transition-all border ${
                      isHistoryOpen
                        ? 'bg-[#7c6bec]/20 border-[#7c6bec]/40 text-[#C9BEFF]'
                        : 'bg-[#1a1c29] border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Historial
                  </button>
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
                      Estado solicitud
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
                  <button
                    type="button"
                    onClick={fetchUserPortfolios}
                    disabled={loadingPortfolios}
                    className="w-full mt-1 py-3 bg-[#7c6bec]/10 hover:bg-[#7c6bec]/25 border border-[#7c6bec]/25 hover:border-[#7c6bec]/40 text-[#C9BEFF] text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loadingPortfolios ? (
                      <div className="w-4 h-4 border-2 border-[#C9BEFF] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
                        </svg>
                        Ver Portafolios del Usuario
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">
                    Motivo de solicitud
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

          {/* Panel derecho: historial (solo visible en pantallas md+) */}
          {isHistoryOpen && (
            <div className="hidden md:block w-1/2 border-l border-white/5 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-bold flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#7c6bec]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Historial del usuario
                  </h3>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/5 text-[#9ca3af] hover:text-white transition-all"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="text-[#9ca3af] text-sm py-4">
                    Cargando historial...
                  </div>
                ) : historyData && historyData.length > 0 ? (
                  <div className="space-y-4">
                    {historyData.map((h) => (
                      <div
                        key={h.id}
                        className="bg-[#1a1c29] p-4 rounded-xl border border-white/5"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white text-sm font-bold">
                              {h.portfolioTitle}
                            </h4>
                            <Link
                              to={h.portfolioPublicUrl}
                              target="_blank"
                              className="text-[#a8e8ff] text-xs underline"
                            >
                              Ver portafolio
                            </Link>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${h.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}
                          >
                            {h.status}
                          </span>
                        </div>
                        <p className="text-[#6b7280] text-xs mt-2">
                          {h.complaints.length} denuncia(s) recibida(s)
                        </p>
                        {h.revision && (
                          <div className="mt-2 p-2 bg-blue-500/10 rounded-lg">
                            <p className="text-[#9ca3af] text-xs">
                              <span className="text-white font-medium">
                                Revisión:
                              </span>{' '}
                              {h.revision.resultado}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#9ca3af] text-sm py-4">
                    Este usuario no tiene otras denuncias.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Panel de historial en móvil (se muestra debajo como sección aparte dentro del scroll) */}
          {isHistoryOpen && (
            <div className="md:hidden border-t border-white/5 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-bold flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#7c6bec]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Historial del usuario
                  </h3>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/5 text-[#9ca3af] hover:text-white transition-all"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="text-[#9ca3af] text-sm py-4">
                    Cargando historial...
                  </div>
                ) : historyData && historyData.length > 0 ? (
                  <div className="space-y-4">
                    {historyData.map((h) => (
                      <div
                        key={h.id}
                        className="bg-[#1a1c29] p-4 rounded-xl border border-white/5"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white text-sm font-bold">
                              {h.portfolioTitle}
                            </h4>
                            <Link
                              to={h.portfolioPublicUrl}
                              target="_blank"
                              className="text-[#a8e8ff] text-xs underline"
                            >
                              Ver portafolio
                            </Link>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${h.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}
                          >
                            {h.status}
                          </span>
                        </div>
                        <p className="text-[#6b7280] text-xs mt-2">
                          {h.complaints.length} denuncia(s) recibida(s)
                        </p>
                        {h.revision && (
                          <div className="mt-2 p-2 bg-blue-500/10 rounded-lg">
                            <p className="text-[#9ca3af] text-xs">
                              <span className="text-white font-medium">
                                Revisión:
                              </span>{' '}
                              {h.revision.resultado}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#9ca3af] text-sm py-4">
                    Este usuario no tiene otras denuncias.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showPortfolios && (
        <ViewPortfolioListModal
          isOpen={showPortfolios}
          onClose={() => setShowPortfolios(false)}
          portfolios={userPortfolios}
        />
      )}
    </div>
  );
}
