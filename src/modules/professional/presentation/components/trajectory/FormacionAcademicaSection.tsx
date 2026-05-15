import { useState, useEffect, useCallback } from 'react';
import AcademicFormModal from './AcademicFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import ViewFormacionModal from './ViewFormacionModal';
import { HttpFormacionAcademicaRepository } from '../../../infrastructure/repositories/HttpFormacionAcademicaRepository';
import {
  FormacionAcademica,
  FormacionAcademicaRequest,
} from '../../../domain/entities/FormacionAcademica';

// ── Repositorio (singleton ligero) ───────────────────────────────────────────
const repo = new HttpFormacionAcademicaRepository();

// ── Íconos inline ────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// ── Formateador de fecha ──────────────────────────────────────────────────────
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
};

type ActionMode = 'edit' | 'delete' | null;

// ── Componente principal ──────────────────────────────────────────────────────
export default function FormacionAcademicaSection() {
  const [records, setRecords] = useState<FormacionAcademica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [mode, setMode] = useState<ActionMode>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<
    FormacionAcademica | undefined
  >();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    record?: FormacionAcademica;
  }>({ isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // ── Cargar datos del backend ─────────────────────────────────────────────
  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await repo.getAll();
      setRecords(data);
    } catch (err: unknown) {
      const msg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: string }).message)
          : 'Error al cargar la formación académica.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setMode(null);
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: FormacionAcademica) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = async (
    request: FormacionAcademicaRequest,
    id?: number
  ) => {
    if (id !== undefined) {
      const updated = await repo.update(id, request);
      setRecords((prev) =>
        prev.map((r) => (r.idFormacionAcademica === id ? updated : r))
      );
    } else {
      const created = await repo.create(request);
      setRecords((prev) => [...prev, created]);
    }
  };

  const handleDeleteClick = (record: FormacionAcademica) => {
    setDeleteModal({ isOpen: true, record });
  };

  const confirmDelete = async () => {
    if (!deleteModal.record?.idFormacionAcademica) return;
    setIsDeleting(true);
    try {
      await repo.delete(deleteModal.record.idFormacionAcademica);
      setRecords((prev) =>
        prev.filter(
          (r) =>
            r.idFormacionAcademica !== deleteModal.record!.idFormacionAcademica
        )
      );
      setDeleteModal({ isOpen: false });
      setMode(null);
    } catch (err: unknown) {
      const msg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: string }).message)
          : 'Error al eliminar la formación académica.';
      setApiError(msg);
      setDeleteModal({ isOpen: false });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleMode = (target: 'edit' | 'delete') => {
    setMode((prev) => (prev === target ? null : target));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <section className="flex flex-col gap-6 w-full animate-fade-in">
        {/* Cabecera */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h3 className="text-white text-2xl font-bold">Formación Académica</h3>
            <p className="text-[#9ca3af] text-sm mt-1">
              Mantén actualizado tu perfil académico para mostrar tus
              certificaciones y grados académicos más recientes.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            {/* Agregar */}
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-4 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm whitespace-nowrap"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar
            </button>

            {/* Visualizar / Editar / Eliminar — solo cuando hay registros */}
            {records.length > 0 && (
              <>
                <button
                  onClick={() => setShowViewModal(true)}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Visualizar
                </button>

                <button
                  onClick={() => toggleMode('edit')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                    mode === 'edit'
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20'
                  }`}
                >
                  <EditIcon />
                  Editar
                </button>

                <button
                  onClick={() => toggleMode('delete')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                    mode === 'delete'
                      ? 'bg-red-500/15 border-red-500/40 text-red-400'
                      : 'border-white/10 text-[#9ca3af] hover:text-red-400 hover:border-red-500/20'
                  }`}
                >
                  <TrashIcon />
                  Eliminar
                </button>
              </>
            )}
          </div>
        </header>

        {/* Indicador de modo activo */}
        {mode && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border ${
            mode === 'edit'
              ? 'bg-white/5 border-white/10 text-[#9ca3af]'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {mode === 'edit' ? <EditIcon /> : <TrashIcon />}
            <span>
              {mode === 'edit'
                ? 'Da clic a un ítem para editarlo'
                : 'Da clic a un ítem para eliminarlo'}
            </span>
            <button
              onClick={() => setMode(null)}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Error global */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{apiError}</p>
          </div>
        )}

        {/* Lista de registros */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 animate-pulse"
                >
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
              <div className="w-16 h-16 bg-[#1a1c29] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h4 className="text-white text-lg font-bold mb-2">
                Tu formación académica está vacía.
              </h4>
              <p className="text-[#9ca3af] text-sm mb-6 max-w-md mx-auto">
                Agrega tus estudios y certificaciones para destacar tu perfil
                académico y atraer mejores oportunidades.
              </p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.idFormacionAcademica}
                onClick={() => {
                  if (mode === 'edit') handleOpenEdit(rec);
                  else if (mode === 'delete') handleDeleteClick(rec);
                }}
                className={`relative bg-[#2D3449] p-6 rounded-2xl border transition-all ${
                  mode === 'edit'
                    ? 'border-white/20 cursor-pointer hover:bg-[#2a3060] hover:border-white/30'
                    : mode === 'delete'
                    ? 'border-red-500/20 cursor-pointer hover:bg-red-500/10 hover:border-red-500/40'
                    : 'border-white/5 hover:bg-[#1f2233]'
                }`}
              >
                {/* Indicador de acción en el ítem */}
                {mode === 'edit' && (
                  <div className="absolute top-5 right-5 p-2 bg-white/10 rounded-lg text-white">
                    <EditIcon />
                  </div>
                )}
                {mode === 'delete' && (
                  <div className="absolute top-5 right-5 p-2 bg-red-500/20 rounded-lg text-red-400">
                    <TrashIcon />
                  </div>
                )}

                {/* Contenido */}
                <h4 className={`text-white text-base font-bold leading-snug ${mode ? 'pr-12' : ''}`}>
                  {rec.carrera}
                </h4>
                {rec.nivel && (
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-[#6c63ff]/20 text-[#a598ff] px-2 py-0.5 rounded-full">
                    {rec.nivel}
                  </span>
                )}
                <p className="text-[#A8E8FF] text-sm font-medium mt-1">
                  {rec.institucion}
                </p>
                <p className="text-[#A8E8FF] text-sm font-medium">
                  • {rec.actualmenteEstudiando ? 'En curso' : formatDate(rec.fechaEgreso)}
                </p>
                {rec.descripcion && (
                  <p className="text-[#9ca3af] text-sm mt-3 leading-relaxed">
                    {rec.descripcion}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal de visualización */}
      <ViewFormacionModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        records={records}
      />

      {/* Modal de formulario */}
      {isModalOpen && (
        <AcademicFormModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setMode(null); }}
          initialData={editingRecord}
          onSave={handleSave}
          existingRecords={records}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModal.isOpen && (
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title={deleteModal.record?.carrera ?? ''}
          onClose={() => { setDeleteModal({ isOpen: false }); setMode(null); }}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
