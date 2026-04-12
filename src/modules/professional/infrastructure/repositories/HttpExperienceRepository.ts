import { Experience } from '../../domain/entities/Experience';
import { ExperienceRepository } from '../../domain/repositories/ExperienceRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

export class HttpExperienceRepository implements ExperienceRepository {
  private readonly PATH = '/api/profile/experiencia';

  async getAll(): Promise<Experience[]> {
    // Usamos el cliente centralizado con tipado genérico
    return httpClient.getAuth<Experience[]>(
      this.PATH,
      'No se pudo obtener la trayectoria profesional'
    );
  }

  async save(experience: Experience): Promise<void> {
    return httpClient.postAuth<void>(
      this.PATH,
      experience,
      'Error al registrar la nueva experiencia'
    );
  }

  async update(experience: Experience): Promise<void> {
    return httpClient.putAuth<void>(
      `${this.PATH}/${experience.id}`,
      experience,
      'Error al actualizar la experiencia laboral'
    );
  }

  async delete(id: number): Promise<void> {
    return httpClient.deleteAuth<void>(
      `${this.PATH}/${id}`,
      'Error al eliminar la experiencia'
    );
  }
}
