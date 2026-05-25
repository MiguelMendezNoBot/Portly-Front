import { useState, useEffect, useCallback } from 'react';
import { DenunciaAgrupada } from '../domain/entities/Complaint';
import { HttpAdminDenunciaRepository } from '../infrastructure/repositories/HttpAdminComplaintRepository';

const repo = new HttpAdminDenunciaRepository();

export function useAdminDenuncias() {
  const [denuncias, setDenuncias] = useState<DenunciaAgrupada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<'view' | 'review' | null>(null);
  const [selectedDenuncia, setSelectedDenuncia] = useState<DenunciaAgrupada | null>(null);

  const loadDenuncias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repo.getAll();
      setDenuncias(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar denuncias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDenuncias();
  }, [loadDenuncias]);

  const handleCardClick = (denuncia: DenunciaAgrupada) => {
    if (!actionMode) return;
    setSelectedDenuncia(denuncia);
  };

  const clearSelection = () => setSelectedDenuncia(null);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const updated = await repo.updateStatus(id, newStatus);
      setDenuncias(prev => prev.map(d => d.id === id ? updated : d));
      clearSelection();
      setActionMode(null);
    } catch (err: any) {
      throw err; // lo manejaremos en el modal
    }
  };

  return {
    denuncias,
    isLoading,
    error,
    actionMode,
    setActionMode,
    selectedDenuncia,
    handleCardClick,
    clearSelection,
    handleUpdateStatus,
    reload: loadDenuncias,
  };
}