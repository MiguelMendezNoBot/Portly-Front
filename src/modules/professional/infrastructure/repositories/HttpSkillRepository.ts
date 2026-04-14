import { httpClient } from '../../../../infrastructure/http/httpClient';
import { SkillRepository } from '../../domain/repositories/SkillRepository';
import { Skill, SkillPayload } from '../../domain/entities/Skill';

// Asumo endpoints RESTful (ajustar según backend real)
const ENDPOINTS = {
  SKILLS: '/api/skills', // GET, POST
  SKILL: (id: string) => `/api/skills/${id}`, // PUT, DELETE
};

export class HttpSkillRepository implements SkillRepository {
  async getAll(): Promise<Skill[]> {
    return httpClient.getAuth<Skill[]>(
      ENDPOINTS.SKILLS,
      'Error al obtener habilidades'
    );
  }

  async create(payload: SkillPayload): Promise<Skill> {
    return httpClient.postAuth<Skill>(
      ENDPOINTS.SKILLS,
      payload,
      'Error al crear habilidad'
    );
  }

  async update(id: string, payload: SkillPayload): Promise<Skill> {
    return httpClient.putAuth<Skill>(
      ENDPOINTS.SKILL(id),
      payload,
      'Error al actualizar habilidad'
    );
  }

  async delete(id: string): Promise<void> {
    await httpClient.deleteAuth<void>(
      ENDPOINTS.SKILL(id),
      'Error al eliminar habilidad'
    );
  }
}
