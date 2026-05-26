import { useState, useMemo, useEffect } from 'react';
import { useAdminComplaint } from '../../applications/useAdminComplaint';
import { ComplaintGroup } from '../../domain/entities/Complaint';
import { ReviewComplaintModal } from '../components/complaint/ReviewComplaintModal';
import { SuspendUserModal } from '../components/complaint/SuspendUserModal';

type Tab = 'pendientes' | 'historial';

// ─── Icons ───────────────────────────────────────────────────────────────────

const FlagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const CloseIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface UserGroup {
  ownerUserId: string;
  ownerUserName: string;
  ownerUserStatus: string;
  totalComplaints: number;
  portfolios: ComplaintGroup[];
}

function groupByUser(complaints: ComplaintGroup[]): UserGroup[] {
  const map = new Map<string, UserGroup>();
  for (const c of complaints) {
    const key = String(c.ownerUserId);
    if (!map.has(key)) {
      map.set(key, {
        ownerUserId: key,
        ownerUserName: c.ownerUserName,
        ownerUserStatus: c.ownerUserStatus,
        totalComplaints: 0,
        portfolios: [],
      });
    }
    const group = map.get(key)!;
    group.totalComplaints += c.complaints.length;
    group.portfolios.push(c);
  }
  return Array.from(map.values()).sort((a, b) => b.totalComplaints - a.totalComplaints);
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

function UserDetailModal({
  userGroup,
  onClose,
  onReviewSuccess,
}: {
  userGroup: UserGroup;
  onClose: () => void;
  onReviewSuccess: (wasReviewed: boolean) => void;
}) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<ComplaintGroup | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ComplaintGroup | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className={`bg-[#0f111a] flex flex-col md:flex-row rounded-[24px] border border-white/10 shadow-2xl w-full transition-all duration-300 ease-in-out ${
          selectedPortfolio ? 'max-w-5xl' : 'max-w-2xl'
        } max-h-[88vh]`}
      >
        {/* ── Left Panel: User + Portfolios ────────────────────────────── */}
        <div className={`flex flex-col overflow-hidden transition-all duration-300 ${selectedPortfolio ? 'w-full md:w-[360px] shrink-0' : 'w-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f8b4b4] to-[#e8756a] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {userGroup.ownerUserName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-white text-lg font-bold truncate">{userGroup.ownerUserName}</h2>
                <p className="text-[#9ca3af] text-xs">
                  {userGroup.totalComplaints} denuncia{userGroup.totalComplaints !== 1 ? 's' : ''} en total
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all shrink-0">
              <CloseIcon />
            </button>
          </div>

          {/* Portfolio list */}
          <div className="overflow-y-auto px-5 py-4 space-y-2.5 scrollbar-thin scrollbar-thumb-[#2c2f48] flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278] mb-2 px-1">
              Portafolios denunciados ({userGroup.portfolios.length})
            </p>
            {userGroup.portfolios.map((p) => {
              const isSelected = selectedPortfolio?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPortfolio(isSelected ? null : p)}
                  className={`group rounded-2xl border overflow-hidden flex items-center gap-3 px-4 py-3.5 transition-all cursor-pointer ${
                    isSelected ? 'bg-[#7c6bec]/12 border-[#7c6bec]/40' : 'bg-[#171B28] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#7c6bec]/30 text-[#C9BEFF]' : 'bg-[#f5c97e]/20 text-[#f5c97e]'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{p.portfolioTitle}</p>
                    <p className="text-[#9ca3af] text-xs">{p.complaints.length} denuncia{p.complaints.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-[#5a6278] group-hover:text-white transition-colors shrink-0">
                    <ChevronRight />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Panel: Complaint detail ─────────────────────────────── */}
        {selectedPortfolio && (
          <div className="flex flex-col flex-1 border-t md:border-t-0 md:border-l border-white/5 overflow-hidden rounded-b-[24px] md:rounded-b-none md:rounded-r-[24px] min-w-0 animate-fade-in">
            {/* Portfolio Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#f5c97e]/20 flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5c97e" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-base truncate">{selectedPortfolio.portfolioTitle}</h3>
                  </div>
                  <p className="text-[#9ca3af] text-xs mt-1 ml-10">
                    {selectedPortfolio.complaints.length} denuncia{selectedPortfolio.complaints.length !== 1 ? 's' : ''} recibidas
                  </p>
                </div>
                <a
                  href={selectedPortfolio.portfolioPublicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[#a8e8ff] text-xs font-medium hover:bg-white/5 transition-colors shrink-0"
                >
                  <EyeIcon /> Ver
                </a>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-6 pb-4 border-b border-white/5">
                {selectedPortfolio.status === 'pendiente' && (
                  <button
                    onClick={() => {
                      setReviewTarget(selectedPortfolio);
                      setReviewModalOpen(true);
                    }}
                    className="flex items-center gap-2 py-2 px-6 bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg hover:brightness-110"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Marcar como revisado
                  </button>
                )}
                {/* Only show Suspender if status is pendiente. If it's already revisado, hide it as requested */}
                {selectedPortfolio.status === 'pendiente' && (
                  userGroup.ownerUserStatus !== 'suspendido' ? (
                    <button
                      onClick={() => setSuspendModalOpen(true)}
                      className="flex items-center gap-2 py-2 px-6 border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      Suspender cuenta
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 py-2 px-6 border border-red-500/20 bg-red-500/5 text-red-400/60 font-bold text-[11px] uppercase tracking-widest rounded-xl">
                      Cuenta suspendida
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Complaint list */}
            <div className="overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin scrollbar-thumb-[#2c2f48] flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278] mb-1">
                Detalle de denuncias
              </p>
              {selectedPortfolio.complaints.map((c) => (
                <div key={c.id} className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f8b4b4] to-[#e8756a] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 overflow-hidden shadow-sm">
                      {c.reporterAvatar ? (
                        <img src={c.reporterAvatar} alt={c.reporterName || c.reportedBy} className="w-full h-full object-cover" />
                      ) : (
                        (c.reporterName || c.reportedBy || '?').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{c.reporterName || c.reportedBy}</span>
                        <span className="text-[#6b7280] text-xs shrink-0">{new Date(c.createdAt).toLocaleDateString('es-BO')}</span>
                      </div>
                      <p className="text-[#a8e8ff] text-xs font-semibold mt-1">{c.reason}</p>
                      {c.description && <p className="text-[#9ca3af] text-xs mt-1 leading-relaxed">{c.description}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Revision info (more prominent as requested) */}
              {selectedPortfolio.revision && (
                <div className="p-5 bg-gradient-to-br from-[#7c6bec]/20 to-[#6b5ce0]/10 border border-[#7c6bec]/30 rounded-2xl mt-4 shadow-[0_0_15px_rgba(124,107,236,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#7c6bec]" />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#7c6bec]/20 flex items-center justify-center text-[#c4bef8]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <p className="text-white text-sm font-bold tracking-wide uppercase">Resultado de revisión</p>
                  </div>
                  <p className="text-[#e5e7eb] text-sm mt-2 leading-relaxed ml-8 bg-[#0f111a]/50 p-3 rounded-xl border border-white/5">{selectedPortfolio.revision.resultado}</p>
                  <p className="text-[#9ca3af] text-xs mt-3 ml-8 font-medium">
                    Revisado el {new Date(selectedPortfolio.revision.fecha).toLocaleString('es-BO', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sub-modals inside detail modal */}
      {reviewModalOpen && reviewTarget && (
        <ReviewComplaintModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          complaintIds={[reviewTarget.id]}
          onSuccess={() => {
            setReviewModalOpen(false);
            onReviewSuccess(true);
            onClose();
          }}
        />
      )}
      {suspendModalOpen && (
        <SuspendUserModal
          isOpen={suspendModalOpen}
          onClose={() => setSuspendModalOpen(false)}
          userId={userGroup.ownerUserId}
          userName={userGroup.ownerUserName}
          onSuccess={() => {
            setSuspendModalOpen(false);
            onReviewSuccess(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ComplaintPage() {
  const { complaints, isLoading, error, reload } = useAdminComplaint();
  const [activeTab, setActiveTab] = useState<Tab>('pendientes');
  const [detailUserGroup, setDetailUserGroup] = useState<UserGroup | null>(null);
  const [selectedForAction, setSelectedForAction] = useState<UserGroup | null>(null);
  const [globalReviewOpen, setGlobalReviewOpen] = useState(false);
  const [globalSuspendOpen, setGlobalSuspendOpen] = useState(false);
  const [actionMode, setActionMode] = useState<'revisar' | 'suspender' | null>(null);

  const pendientes = useMemo(() => complaints.filter((c) => c.status === 'pendiente'), [complaints]);
  const revisadas = useMemo(() => complaints.filter((c) => c.status === 'revisado'), [complaints]);

  const currentComplaints = activeTab === 'pendientes' ? pendientes : revisadas;
  const userGroups = useMemo(() => groupByUser(currentComplaints), [currentComplaints]);

  // Reset selection when tab changes
  useEffect(() => {
    setSelectedForAction(null);
    setActionMode(null);
  }, [activeTab]);

  return (
    <div className="py-6 animate-fade-in">
      {/* Title */}
      <h3 className="text-white text-2xl font-bold mb-6">Denuncias</h3>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#171B28] rounded-2xl w-fit mb-6">
        <button
          onClick={() => setActiveTab('pendientes')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'pendientes'
              ? 'bg-[#7c6bec] text-white shadow-lg shadow-[#7c6bec]/25'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          <FlagIcon />
          Pendientes
          {pendientes.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'pendientes' ? 'bg-white/20' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {pendientes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'historial'
              ? 'bg-[#7c6bec] text-white shadow-lg shadow-[#7c6bec]/25'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Historial
        </button>
      </div>

      {/* Action buttons above the table */}
      {activeTab === 'pendientes' && pendientes.length > 0 && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActionMode(actionMode === 'revisar' ? null : 'revisar')}
            className={`flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${
              actionMode === 'revisar'
                ? 'bg-blue-500/15 border border-blue-500/40 text-blue-400'
                : 'bg-[#171B28] border border-white/5 text-[#9ca3af] hover:text-white hover:border-white/20'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Marcar como revisado
          </button>
          
          <button
            onClick={() => setActionMode(actionMode === 'suspender' ? null : 'suspender')}
            className={`flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${
              actionMode === 'suspender'
                ? 'bg-red-500/15 border border-red-500/40 text-red-400'
                : 'bg-[#171B28] border border-white/5 text-[#9ca3af] hover:text-white hover:border-white/20'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Suspender cuenta
          </button>
        </div>
      )}

      {/* Mode indicator */}
      {actionMode && activeTab === 'pendientes' && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border mb-6 ${
          actionMode === 'revisar' 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v4M12 16h.01" />
          </svg>
          <span>
            {actionMode === 'revisar' 
              ? 'Selecciona un usuario de la lista para marcar todos sus portafolios pendientes como revisados.' 
              : 'Selecciona un usuario de la lista para suspender su cuenta.'}
          </span>
          <button
            onClick={() => setActionMode(null)}
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
        <div className="bg-[#171B28] rounded-2xl border border-white/5 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5 border-b border-white/5 last:border-b-0 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex-1"><div className="h-4 bg-white/10 rounded w-40 mb-2" /><div className="h-3 bg-white/5 rounded w-24" /></div>
              <div className="h-4 bg-white/10 rounded w-20" />
            </div>
          ))}
        </div>
      ) : userGroups.length === 0 ? (
        /* Empty state */
        <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
          <div className="w-16 h-16 bg-[#1a1c29] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-white text-lg font-bold mb-2">
            {activeTab === 'pendientes' ? 'No hay denuncias pendientes' : 'No hay denuncias revisadas'}
          </h4>
          <p className="text-[#9ca3af] text-sm">
            {activeTab === 'pendientes'
              ? 'Cuando un usuario reporte un portafolio, aparecerá aquí.'
              : 'Las denuncias revisadas aparecerán en este historial.'}
          </p>
        </div>
      ) : (
        /* Table */
        <div className="bg-[#171B28] rounded-2xl border border-white/5 overflow-hidden">
          {/* Table header */}
          <div className="grid gap-4 px-6 py-3 border-b border-white/5 grid-cols-[1fr_200px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">Usuario</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278]">Cantidad de denuncias</span>
          </div>

          {/* Table rows */}
          {userGroups.map((ug) => {
            return (
            <div
              key={ug.ownerUserId}
              onClick={() => {
                if (actionMode === 'revisar') {
                  setSelectedForAction(ug);
                  setGlobalReviewOpen(true);
                } else if (actionMode === 'suspender') {
                  if (ug.ownerUserStatus !== 'suspendido') {
                    setSelectedForAction(ug);
                    setGlobalSuspendOpen(true);
                  }
                } else {
                  setDetailUserGroup(ug);
                }
              }}
              className={`grid gap-4 items-center px-6 py-4 border-b border-white/5 last:border-b-0 transition-colors grid-cols-[1fr_200px] cursor-pointer ${
                actionMode === 'revisar' 
                  ? 'hover:bg-blue-500/5 hover:border-blue-500/40 border' 
                  : actionMode === 'suspender' && ug.ownerUserStatus !== 'suspendido'
                  ? 'hover:bg-red-500/5 hover:border-red-500/40 border'
                  : 'hover:bg-white/[0.02]'
              } ${(actionMode === 'suspender' && ug.ownerUserStatus === 'suspendido') ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* User info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f8b4b4] to-[#e8756a] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg overflow-hidden">
                  {ug.ownerUserName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold truncate">{ug.ownerUserName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      ug.ownerUserStatus === 'activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {ug.ownerUserStatus}
                    </span>
                    <span className="text-[#6b7280] text-xs">{ug.portfolios.length} portafolio{ug.portfolios.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Complaint count */}
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold">{ug.totalComplaints}</span>
                <span className="text-[#9ca3af] text-xs">denuncia{ug.totalComplaints !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )})}
        </div>
      )}

      {/* Detail modal */}
      {detailUserGroup && (
        <UserDetailModal
          userGroup={detailUserGroup}
          onClose={() => setDetailUserGroup(null)}
          onReviewSuccess={(wasReviewed) => {
            reload();
            setDetailUserGroup(null);
            if (wasReviewed) setActiveTab('historial');
          }}
        />
      )}

      {/* Global Modals */}
      {globalReviewOpen && selectedForAction && (
        <ReviewComplaintModal
          isOpen={globalReviewOpen}
          onClose={() => setGlobalReviewOpen(false)}
          complaintIds={selectedForAction.portfolios.filter(p => p.status === 'pendiente').map(p => p.id)}
          onSuccess={() => {
            setGlobalReviewOpen(false);
            setActionMode(null);
            setSelectedForAction(null);
            reload();
            setActiveTab('historial');
          }}
        />
      )}
      {globalSuspendOpen && selectedForAction && (
        <SuspendUserModal
          isOpen={globalSuspendOpen}
          onClose={() => setGlobalSuspendOpen(false)}
          userId={selectedForAction.ownerUserId}
          userName={selectedForAction.ownerUserName}
          onSuccess={() => {
            setGlobalSuspendOpen(false);
            setActionMode(null);
            setSelectedForAction(null);
            reload();
          }}
        />
      )}
    </div>
  );
}
