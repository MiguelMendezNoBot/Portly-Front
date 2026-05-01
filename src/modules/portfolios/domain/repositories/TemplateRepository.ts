import { Template } from '../entities/Template';

export interface TemplateRepository {
  getAll(): Promise<Template[]>;
}
