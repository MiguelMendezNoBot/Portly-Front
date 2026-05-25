import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ComplaintGroup } from '../../../domain/entities/Complaint';
import { HttpAdminComplaintRepository } from '../../../infrastructure/repositories/HttpAdminComplaintRepository';
import { ReviewComplaintModal } from '../../components/complaint/ReviewComplaintModal';
import { SuspendUserModal } from '../../components/complaint/SuspendUserModal';

const repo = new HttpAdminComplaintRepository();

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<ComplaintGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
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
  };

  if (isLoading) {
    return <div className="py-6 text-white">Cargando...</div>;
  }
  if (error || !complaint) {
    return <div className="py-6 text-red-400">{error || 'Denuncia no encontrada.'}</div>;
  }

  return (
    <div className="py-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-[#9ca3af] hover:text-white mb-4 flex items-center gap-2 text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver
      </button>

      <div className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 mb-6">
        <h2 className="text-white text-2xl font-bold mb-2">{complaint.portfolioTitle}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-[#9ca3af]">Propietario: </span>
            <span className="text-white">{complaint.ownerUserName}</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              complaint.ownerUserStatus === 'activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>{complaint.ownerUserStatus}</span>
          </div>
          <div>
            <span className="text-[#9ca3af]">Portafolio: </span>
            <Link to={complaint.portfolioPublicUrl} target="_blank" className="text-[#a8e8ff] underline">
              Ver portafolio público
            </Link>
          </div>
          <div>
            <span className="text-[#9ca3af]">Estado denuncia: </span>
            <span className={`font-semibold ${
              complaint.status === 'pendiente' ? 'text-yellow-400' : 'text-blue-400'
            }`}>{complaint.status}</span>
          </div>
        </div>

        {complaint.revision && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-white text-sm font-medium">Resultado de revisión:</p>
            <p className="text-[#9ca3af] text-sm mt-1">{complaint.revision.resultado}</p>
            <p className="text-[#6b7280] text-xs mt-1">
              Revisado por {complaint.revision.adminId} el {new Date(complaint.revision.fecha).toLocaleString('es-BO')}
            </p>
          </div>
        )}
      </div>

      {/* Listado de quejas */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-bold mb-3">Quejas recibidas ({complaint.complaints.length})</h3>
        <div className="space-y-3">
          {complaint.complaints.map(c => (
            <div key={c.id} className="bg-[#1a1c29] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-white text-sm font-medium">{c.reason}</span>
                <span className="text-[#6b7280] text-xs">{new Date(c.createdAt).toLocaleDateString('es-BO')}</span>
              </div>
              {c.description && <p className="text-[#9ca3af] text-xs mt-1">{c.description}</p>}
              <p className="text-[#6b7280] text-xs mt-1">Reportado por: {c.reportedBy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-4">
        {complaint.status === 'pendiente' && (
          <button
            onClick={() => setReviewModalOpen(true)}
            className="py-3 px-6 bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg"
          >
            MARCAR COMO REVISADO
          </button>
        )}

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

      <ReviewComplaintModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        complaintId={complaint.id}
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