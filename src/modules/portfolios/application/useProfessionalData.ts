import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '../../../infrastructure/http/httpClient';
import type { Skill } from '../../professional/domain/entities/Skill';
import type { SoftSkill } from '../../professional/domain/entities/SoftSkill';
import type { Experience } from '../../professional/domain/entities/Experience';
import type { Project } from '../../professional/domain/entities/Project';
import type { FormacionAcademica } from '../../professional/domain/entities/FormacionAcademica';

export interface ProfessionalData {
  skills: Skill[];
  softSkills: SoftSkill[];
  experiences: Experience[];
  projects: Project[];
  formacion: FormacionAcademica[];
}

const EMPTY: ProfessionalData = {
  skills: [],
  softSkills: [],
  experiences: [],
  projects: [],
  formacion: [],
};

export function useProfessionalData() {
  const [data, setData] = useState<ProfessionalData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [skills, softSkills, experiences, projects, formacion] =
        await Promise.allSettled([
          httpClient.getAuth<Skill[]>('/api/skills', ''),
          httpClient.getAuth<SoftSkill[]>('/api/soft-skills', ''),
          httpClient.getAuth<Experience[]>('/api/profile/experiencia', ''),
          httpClient.getAuth<Project[]>('/api/profile/proyectos', ''),
          httpClient.getAuth<FormacionAcademica[]>('/api/profile/formacion', ''),
        ]);

      setData({
        skills: skills.status === 'fulfilled' ? skills.value : [],
        softSkills: softSkills.status === 'fulfilled' ? softSkills.value : [],
        experiences: experiences.status === 'fulfilled' ? experiences.value : [],
        projects: projects.status === 'fulfilled' ? projects.value : [],
        formacion: formacion.status === 'fulfilled' ? formacion.value : [],
      });
    } catch (err: any) {
      setError(err?.message || 'Error al cargar datos del perfil profesional');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, reload: fetch };
}
