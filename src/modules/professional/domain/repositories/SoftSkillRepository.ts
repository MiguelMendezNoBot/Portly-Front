import { SoftSkill, SoftSkillPayload } from '../entities/SoftSkill';

export interface SoftSkillRepository {
  getAll(): Promise<SoftSkill[]>;
  create(payload: SoftSkillPayload): Promise<SoftSkill>;
  delete(id: number): Promise<void>;
}
