import { useState, useEffect, useCallback, useRef } from 'react';
import { HttpProfessionalProfileRepository } from '../infrastructure/HttpProfessionalProfileRepository';
import type {
  ProfessionalProfile,
  CreateProfessionalProfileDTO,
  UpdateProfessionalProfileDTO,
} from '../domain/professionalProfile.entity';
import { useToast } from '../../../shared/hooks/useToast';

const repository = new HttpProfessionalProfileRepository();

export function useProfessionalProfiles() {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repository.getAll();
      setProfiles(data);
    } catch (err: any) {
      const message = err?.message || 'Error al cargar perfiles profesionales';
      setError(message);
      showToastRef.current(message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const addProfile = useCallback(async (dto: CreateProfessionalProfileDTO) => {
    try {
      const created = await repository.create(dto);
      setProfiles((prev) => [...prev, created]);
      showToastRef.current('Perfil profesional creado correctamente', 'success');
      return created;
    } catch (err: any) {
      showToastRef.current(err?.message || 'Error al crear el perfil', 'error');
      throw err;
    }
  }, []);

  const updateProfile = useCallback(
    async (id: string, dto: UpdateProfessionalProfileDTO) => {
      try {
        const updated = await repository.update(id, dto);
        setProfiles((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToastRef.current('Perfil profesional actualizado', 'success');
        return updated;
      } catch (err: any) {
        showToastRef.current(err?.message || 'Error al actualizar el perfil', 'error');
        throw err;
      }
    },
    []
  );

  const deleteProfile = useCallback(async (id: string) => {
    try {
      await repository.delete(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      showToastRef.current('Perfil profesional eliminado', 'success');
    } catch (err: any) {
      showToastRef.current(err?.message || 'Error al eliminar el perfil', 'error');
      throw err;
    }
  }, []);

  const uploadPhoto = useCallback((file: File) => repository.uploadPhoto(file), []);

  return {
    profiles,
    loading,
    error,
    reload: fetchProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
    uploadPhoto,
  };
}
