import { useState, useEffect, useCallback, useRef } from 'react';
import { SoftSkillUseCases } from './SoftSkillUseCases';
import { SoftSkillRepository } from '../domain/repositories/SoftSkillRepository';
import { HttpSoftSkillRepository } from '../infrastructure/repositories/HttpSoftSkillRepository';
import { SoftSkill, SoftSkillPayload } from '../domain/entities/SoftSkill';
import { useToast } from '../../../shared/hooks/useToast';

const repository: SoftSkillRepository = new HttpSoftSkillRepository();
const useCases = new SoftSkillUseCases(repository);

export function useSoftSkills() {
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await useCases.fetchSoftSkills();
      setSkills(data);
    } catch (err: any) {
      const message = err?.message || 'Error al cargar habilidades blandas';
      setError(message);
      showToastRef.current(message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const addSkill = useCallback(async (payload: SoftSkillPayload) => {
    const tempId = -Date.now() - Math.floor(Math.random() * 1000);
    const optimisticSkill: SoftSkill = { id: tempId, nombreHabilidad: payload.nombreHabilidad };
    
    setSkills((prev) => [...prev, optimisticSkill]);

    try {
      const newSkill = await useCases.addSoftSkill(payload);
      setSkills((prev) => prev.map((s) => (s.id === tempId ? newSkill : s)));
      showToastRef.current('Habilidad blanda agregada correctamente', 'success');
      return newSkill;
    } catch (err: any) {
      setSkills((prev) => prev.filter((s) => s.id !== tempId));
      const message = err?.message || 'Error al agregar habilidad blanda';
      showToastRef.current(message, 'error');
      throw err;
    }
  }, []);

  const deleteSkill = useCallback(async (id: number) => {
    let deletedSkill: SoftSkill | undefined;
    
    setSkills((prev) => {
      deletedSkill = prev.find((s) => s.id === id);
      return prev.filter((s) => s.id !== id);
    });

    try {
      await useCases.deleteSoftSkill(id);
      showToastRef.current('Habilidad eliminada permanentemente', 'success');
    } catch (err: any) {
      if (deletedSkill) {
        setSkills((prev) => [...prev, deletedSkill!]);
      }
      const message = err?.message || 'Error al eliminar habilidad blanda';
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
    deleteSkill,
  };
}
