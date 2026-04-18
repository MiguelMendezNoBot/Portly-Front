import { Project } from '../entities/Project';

export interface ProjectRepository {
  getAll(): Promise<Project[]>;
  save(project: Project): Promise<void>;
  update(project: Project): Promise<void>;
  delete(id: number): Promise<void>;
}
