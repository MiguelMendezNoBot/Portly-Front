import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ComplaintGroup } from '../../../domain/entities/Complaint';
import { HttpAdminComplaintRepository } from '../../../infrastructure/repositories/HttpAdminComplaintRepository';
import { ReviewComplaintModal } from '../../components/complaint/ReviewComplaintModal';
import { SuspendUserModal } from '../../components/complaint/SuspendUserModal';
import { RestrictUserModal } from '../../components/complaint/RestrictUserModal';

const repo = new HttpAdminComplaintRepository();

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<ComplaintGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState<ComplaintGroup[] | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const navigate = useNavigate();

  const loadDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await repo.getById(parseInt(id));
      setComplaint(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const handleSuccess = () => {
    loadDetail();
    if (isHistoryOpen && complaint) {
      loadHistory(complaint.ownerUserId);
    }
  };

  const loadHistory = async (userId: string) => {
    setIsLoadingHistory(true);
    try {
      const data = await repo.getUserComplaintHistory(userId);
      setHistoryData(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleHistory = () => {
    if (!isHistoryOpen && !historyData && complaint) {
      loadHistory(complaint.ownerUserId);
    }
    setIsHistoryOpen(!isHistoryOpen);
  };

  if (isLoading) {
    return <div className="py-6 text-white">Cargando...</div>;
  }
  if (error || !complaint) {
    return (
      <div className="py-6 text-red-400">
        {error || 'Denuncia no encontrada.'}
      </div>
    );
  }

  return (
    <div className="py-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="text-[#9ca3af] hover:text-white mb-4 flex items-center gap-2 text-sm"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Panel izquierdo principal */}
        <div className="flex-1 w-full min-w-0">

      <div className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 mb-6">
        <h2 className="text-white text-2xl font-bold mb-2">
          {complaint.portfolioTitle}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[#9ca3af]">Propietario: </span>
            <span className="text-white">{complaint.ownerUserName}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                complaint.ownerUserStatus === 'activo'
                  ? 'bg-green-500/20 text-green-400'
                  : complaint.ownerUserStatus === 'restringido'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
              }`}
            >
              {complaint.ownerUserStatus}
            </span>
            <button
              onClick={toggleHistory}
              className={`flex items-center gap-1.5 px-3 py-1 ml-2 rounded-lg text-xs font-semibold transition-all border ${
                isHistoryOpen
                  ? 'bg-[#7c6bec]/20 border-[#7c6bec]/40 text-[#C9BEFF]'
                  : 'bg-[#1a1c29] border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Historial
            </button>
          </div>
          <div>
            <span className="text-[#9ca3af]">Portafolio: </span>
            <Link
              to={complaint.portfolioPublicUrl}
              target="_blank"
              className="text-[#a8e8ff] underline"
            >
              Ver portafolio público
            </Link>
          </div>
          <div>
            <span className="text-[#9ca3af]">Estado denuncia: </span>
            <span
              className={`font-semibold ${
                complaint.status === 'pendiente'
                  ? 'text-yellow-400'
                  : 'text-blue-400'
              }`}
            >
              {complaint.status}
            </span>
          </div>
        </div>

        {complaint.revision && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-white text-sm font-medium">
              Resultado de revisión:
            </p>
            <p className="text-[#9ca3af] text-sm mt-1">
              {complaint.revision.resultado}
            </p>
            <p className="text-[#6b7280] text-xs mt-1">
              Revisado por {complaint.revision.adminId} el{' '}
              {new Date(complaint.revision.fecha).toLocaleString('es-BO')}
            </p>
          </div>
        )}
      </div>

      {/* Listado de quejas */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-bold mb-3">
          Quejas recibidas ({complaint.complaints.length})
        </h3>
        <div className="space-y-3">
          {complaint.complaints.map((c) => (
            <div
              key={c.id}
              className="bg-[#1a1c29] p-4 rounded-xl border border-white/5"
            >
              <div className="flex justify-between">
                <span className="text-white text-sm font-medium">
                  {c.reason}
                </span>
                <span className="text-[#6b7280] text-xs">
                  {new Date(c.createdAt).toLocaleDateString('es-BO')}
                </span>
              </div>
              {c.description && (
                <p className="text-[#9ca3af] text-xs mt-1">{c.description}</p>
              )}
              {/* Denunciante: avatar + nombre */}
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-[#7c6bec]/20 overflow-hidden flex items-center justify-center shrink-0 border border-white/5">
                  {c.reporterAvatar ? (
                    <img src={c.reporterAvatar} alt={c.reporterName || 'Usuario'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#9fa2ff] text-[9px] font-bold">
                      {(c.reporterName || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-[#6b7280] text-xs">
                  {c.reporterName || 'Usuario desconocido'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-4">
        {/* Marcar como revisado */}
        {complaint.status === 'pendiente' && (
          <button
            onClick={() => setReviewModalOpen(true)}
            className="py-3 px-6 bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:brightness-110"
          >
            MARCAR COMO REVISADO
          </button>
        )}

        {/* Restringir usuario */}
        {complaint.ownerUserStatus !== 'suspendido' &&
          complaint.ownerUserStatus !== 'restringido' && (
            <button
              onClick={() => setRestrictModalOpen(true)}
              className="py-3 px-6 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
            >
              RESTRINGIR USUARIO
            </button>
          )}

        {/* Ya restringido */}
        {complaint.ownerUserStatus === 'restringido' && (
          <span className="py-3 px-6 border border-yellow-500/20 bg-yellow-500/5 text-yellow-400/60 font-bold text-xs uppercase tracking-widest rounded-2xl">
            USUARIO RESTRINGIDO
          </span>
        )}

        {/* Suspender usuario */}
        {complaint.ownerUserStatus !== 'suspendido' ? (
          <button
            onClick={() => setSuspendModalOpen(true)}
            className="py-3 px-6 border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
          >
            SUSPENDER USUARIO
          </button>
        ) : (
          <span className="py-3 px-6 border border-red-500/20 bg-red-500/5 text-red-400/60 font-bold text-xs uppercase tracking-widest rounded-2xl">
            USUARIO SUSPENDIDO
          </span>
        )}
      </div>
    </div>
      
      {/* Panel de historial lateral */}
      {isHistoryOpen && (
        <div className="w-full xl:w-96 shrink-0 bg-[#2D3449] p-6 rounded-2xl border border-white/5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#7c6bec]">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Historial del usuario
            </h3>
            <button onClick={() => setIsHistoryOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-[#9ca3af] hover:text-white transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          
          {isLoadingHistory ? (
            <div className="text-[#9ca3af] text-sm py-4">Cargando historial...</div>
          ) : historyData && historyData.length > 0 ? (
            <div className="space-y-4">
              {historyData.map((h) => (
                <div key={h.id} className="bg-[#1a1c29] p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white text-sm font-bold">{h.portfolioTitle}</h4>
                      <Link to={h.portfolioPublicUrl} target="_blank" className="text-[#a8e8ff] text-xs underline">
                        Ver portafolio
                      </Link>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${h.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {h.status}
                    </span>
                  </div>
                  <p className="text-[#6b7280] text-xs mt-2">
                    {h.complaints.length} denuncia(s) recibida(s)
                  </p>
                  {h.revision && (
                    <div className="mt-2 p-2 bg-blue-500/10 rounded-lg">
                      <p className="text-[#9ca3af] text-xs"><span className="text-white font-medium">Revisión:</span> {h.revision.resultado}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#9ca3af] text-sm py-4">Este usuario no tiene otras denuncias.</div>
          )}
        </div>
      )}
      </div>

      <ReviewComplaintModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        complaintId={complaint.id}
        onSuccess={handleSuccess}
      />
      <RestrictUserModal
        isOpen={restrictModalOpen}
        onClose={() => setRestrictModalOpen(false)}
        userId={complaint.ownerUserId}
        userName={complaint.ownerUserName}
        onSuccess={handleSuccess}
      />
      <SuspendUserModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        userId={complaint.ownerUserId}
        userName={complaint.ownerUserName}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
