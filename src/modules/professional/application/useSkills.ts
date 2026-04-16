import { useState, useEffect, useCallback, useRef } from 'react';
import { SkillUseCases } from './SkillUseCases';
import { SkillRepository } from '../domain/repositories/SkillRepository';
import { HttpSkillRepository } from '../infrastructure/repositories/HttpSkillRepository';
import { Skill, SkillPayload } from '../domain/entities/Skill';
import { useToast } from '../../../shared/hooks/useToast';

const repository: SkillRepository = new HttpSkillRepository();
const useCases = new SkillUseCases(repository);

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast; // mantiene siempre la última versión de showToast

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await useCases.fetchSkills();
      setSkills(data);
    } catch (err: any) {
      const message = err?.message || 'Error al cargar habilidades';
      setError(message);
      showToastRef.current(message, 'error');
    } finally {
      setLoading(false);
    }
  }, []); // sin dependencias, solo se crea una vez

  // Carga inicial
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]); // fetchSkills es estable

  const addSkill = useCallback(async (payload: SkillPayload) => {
    try {
      const newSkill = await useCases.addSkill(payload);
      setSkills((prev) => [...prev, newSkill]);
      showToastRef.current('Habilidad agregada correctamente', 'success');
      return newSkill;
    } catch (err: any) {
      const message = err?.message || 'Error al agregar habilidad';
      showToastRef.current(message, 'error');
      throw err;
    }
  }, []);

  const updateSkill = useCallback(async (id: string, payload: SkillPayload) => {
    try {
      const updated = await useCases.updateSkill(id, payload);
      setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToastRef.current('Habilidad actualizada correctamente', 'success');
      return updated;
    } catch (err: any) {
      const message = err?.message || 'Error al actualizar habilidad';
      showToastRef.current(message, 'error');
      throw err;
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      await useCases.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showToastRef.current('Habilidad eliminada permanentemente', 'success');
    } catch (err: any) {
      const message = err?.message || 'Error al eliminar habilidad';
      showToastRef.current(message, 'error');
      throw err;
    }
  }, []);

  return {
    skills,
    loading,
    error,
    reload: fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
  };
}
