import { Project } from '../../domain/entities/Project';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

export class HttpProjectRepository implements ProjectRepository {
  private readonly PATH = '/api/profile/proyectos';

  async getAll(): Promise<Project[]> {
    return httpClient.getAuth<Project[]>(
      this.PATH,
      'No se pudo obtener los proyectos'
    );
  }

  async save(project: Project): Promise<void> {
    return httpClient.postAuth<void>(
      this.PATH,
      project,
      'Error al registrar el nuevo proyecto'
    );
  }

  async update(project: Project): Promise<void> {
    return httpClient.putAuth<void>(
      `${this.PATH}/${project.id}`,
      project,
      'Error al actualizar el proyecto'
    );
  }

  async delete(id: number): Promise<void> {
    return httpClient.deleteAuth<void>(
      `${this.PATH}/${id}`,
      'Error al eliminar el proyecto'
    );
  }
}
