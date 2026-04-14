import { useState, useEffect, useCallback } from 'react';
import AcademicFormModal from './AcademicFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { HttpFormacionAcademicaRepository } from '../../../infrastructure/repositories/HttpFormacionAcademicaRepository';
import { FormacionAcademica, FormacionAcademicaRequest } from '../../../domain/entities/FormacionAcademica';

// ── Repositorio (singleton ligero) ───────────────────────────────────────────
const repo = new HttpFormacionAcademicaRepository();

// ── Íconos inline ────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// ── Formateador de fecha ──────────────────────────────────────────────────────
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
};

// ── Componente principal ──────────────────────────────────────────────────────
export default function FormacionAcademicaSection() {
  const [records, setRecords] = useState<FormacionAcademica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FormacionAcademica | undefined>();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    record?: FormacionAcademica;
  }>({ isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);

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

  // ── Handlers de modal agregar/editar ────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: FormacionAcademica) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = async (request: FormacionAcademicaRequest, id?: number) => {
    if (id !== undefined) {
      // Edición
      const updated = await repo.update(id, request);
      setRecords((prev) =>
        prev.map((r) => (r.idFormacionAcademica === id ? updated : r))
      );
    } else {
      // Alta
      const created = await repo.create(request);
      setRecords((prev) => [...prev, created]);
    }
  };

  // ── Handlers de eliminación ──────────────────────────────────────────────
  const handleDeleteClick = (record: FormacionAcademica) => {
    setDeleteModal({ isOpen: true, record });
  };

  const confirmDelete = async () => {
    if (!deleteModal.record?.idFormacionAcademica) return;
    setIsDeleting(true);
    try {
      await repo.delete(deleteModal.record.idFormacionAcademica);
      setRecords((prev) =>
        prev.filter((r) => r.idFormacionAcademica !== deleteModal.record!.idFormacionAcademica)
      );
      setDeleteModal({ isOpen: false });
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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <section className="flex flex-col gap-6 w-full animate-fade-in bg-[#171B28] p-4 rounded-2xl">

        {/* Cabecera */}
        <header className="flex flex-col gap-1">
          <h3 className="text-white text-2xl font-bold">Formación Académica</h3>
          <p className="text-[#9ca3af] text-sm">
            Mantén actualizado tu perfil académico para mostrar tus certificaciones y
            grados académicos más recientes.
          </p>
        </header>

        {/* Error global */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{apiError}</p>
          </div>
        )}

        {/* Lista de registros */}
        <div className="space-y-4">
          {isLoading ? (
            /* Skeleton loader */
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
              <h4 className="text-white text-lg font-bold mb-2">
                Tu formación académica está vacía.
              </h4>
              <p className="text-[#9ca3af] text-sm">
                Agrega tus estudios y certificaciones para destacar tu perfil académico.
              </p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.idFormacionAcademica}
                className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 relative group transition-all hover:bg-[#1f2233]"
              >
                {/* Botones Editar / Eliminar */}
                <div className="absolute top-5 right-5 flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(rec)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors flex flex-col items-center gap-1"
                    aria-label="Editar formación académica"
                  >
                    <EditIcon />
                    <span className="text-[10px] text-gray-400">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(rec)}
                    className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors flex flex-col items-center gap-1"
                    aria-label="Eliminar formación académica"
                  >
                    <TrashIcon />
                    <span className="text-[10px] text-gray-400 hover:text-red-400">Eliminar</span>
                  </button>
                </div>

                {/* Contenido */}
                <h4 className="text-white text-base font-bold pr-24 max-w-[340px] leading-snug">
                  {rec.carrera}
                </h4>
                {rec.nivel && (
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-[#6c63ff]/20 text-[#a598ff] px-2 py-0.5 rounded-full">
                    {rec.nivel}
                  </span>
                )}
                <p className="text-[#A8E8FF] text-sm font-medium mt-1">{rec.institucion}</p>
                <p className="text-[#A8E8FF] text-sm font-medium">
                  • {formatDate(rec.fechaInicio)} –{' '}
                  {rec.actualmenteEstudiando ? 'Presente' : formatDate(rec.fechaFinalizacion)}
                </p>
                {rec.descripcion && (
                  <p className="text-[#9ca3af] text-sm mt-3 leading-relaxed pr-2">
                    {rec.descripcion}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Botón Agregar */}
        <div className="flex justify-center mt-2">
          <button
            id="btn-agregar-formacion"
            onClick={handleOpenAdd}
            className="bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-3 px-8 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm"
          >
            AGREGAR FORMACIÓN ACADÉMICA
          </button>
        </div>
      </section>

      {/* Modal de formulario */}
      {isModalOpen && (
        <AcademicFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingRecord}
          onSave={handleSave}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModal.isOpen && (
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title={deleteModal.record?.carrera ?? ''}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
