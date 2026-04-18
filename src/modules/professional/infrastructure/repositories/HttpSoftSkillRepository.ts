import { httpClient } from '../../../../infrastructure/http/httpClient';
import { SoftSkillRepository } from '../../domain/repositories/SoftSkillRepository';
import { SoftSkill, SoftSkillPayload } from '../../domain/entities/SoftSkill';

const ENDPOINTS = {
  SOFT_SKILLS: '/api/soft-skills',
  SOFT_SKILL: (id: number) => `/api/soft-skills/${id}`,
};

export class HttpSoftSkillRepository implements SoftSkillRepository {
  async getAll(): Promise<SoftSkill[]> {
    return httpClient.getAuth<SoftSkill[]>(
      ENDPOINTS.SOFT_SKILLS,
      'Error al obtener habilidades blandas'
    );
  }

  async create(payload: SoftSkillPayload): Promise<SoftSkill> {
    return httpClient.postAuth<SoftSkill>(
      ENDPOINTS.SOFT_SKILLS,
      payload,
      'Error al crear habilidad blanda'
    );
  }

  async delete(id: number): Promise<void> {
    await httpClient.deleteAuth<void>(
      ENDPOINTS.SOFT_SKILL(id),
      'Error al eliminar habilidad blanda'
    );
  }
}
