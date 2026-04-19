import { SoftSkillRepository } from '../domain/repositories/SoftSkillRepository';
import { SoftSkill, SoftSkillPayload } from '../domain/entities/SoftSkill';

export class SoftSkillUseCases {
  constructor(private repository: SoftSkillRepository) {}

  async fetchSoftSkills(): Promise<SoftSkill[]> {
    return this.repository.getAll();
  }

  async addSoftSkill(payload: SoftSkillPayload): Promise<SoftSkill> {
    if (!payload.nombreHabilidad.trim()) {
      throw new Error('El nombre de la habilidad blanda es requerido');
    }
    return this.repository.create(payload);
  }

  async deleteSoftSkill(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
