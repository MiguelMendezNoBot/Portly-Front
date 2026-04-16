import { Skill, SkillPayload } from '../entities/Skill';

export interface SkillRepository {
  getAll(): Promise<Skill[]>;
  create(payload: SkillPayload): Promise<Skill>;
  update(id: string, payload: SkillPayload): Promise<Skill>;
  delete(id: string): Promise<void>;
}
