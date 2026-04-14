import { SkillRepository } from '../domain/repositories/SkillRepository';
import { Skill, SkillPayload } from '../domain/entities/Skill';

export class SkillUseCases {
  constructor(private repository: SkillRepository) {}

  async fetchSkills(): Promise<Skill[]> {
    return this.repository.getAll();
  }

  async addSkill(payload: SkillPayload): Promise<Skill> {
    if (!payload.name.trim()) {
      throw new Error('El nombre de la habilidad es requerido');
    }
    return this.repository.create(payload);
  }

  async updateSkill(id: string, payload: SkillPayload): Promise<Skill> {
    if (!payload.name.trim()) {
      throw new Error('El nombre de la habilidad es requerido');
    }
    return this.repository.update(id, payload);
  }

  async deleteSkill(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
