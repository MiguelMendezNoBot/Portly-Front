import { ActualizacionAcademica, ActualizacionAcademicaRequest } from '../../domain/entities/ActualizacionAcademica';
import { ActualizacionAcademicaRepository } from '../../domain/repositories/ActualizacionAcademicaRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

export class HttpActualizacionAcademicaRepository implements ActualizacionAcademicaRepository {
  private readonly PATH = '/api/profile/actualizacion-academica';

  async getAll(): Promise<ActualizacionAcademica[]> {
    return httpClient.getAuth<ActualizacionAcademica[]>(
      this.PATH,
      'No se pudo obtener la actualización académica'
    );
  }

  async create(request: ActualizacionAcademicaRequest): Promise<ActualizacionAcademica> {
    return httpClient.postAuth<ActualizacionAcademica>(
      this.PATH,
      request,
      'Error al registrar la actualización académica'
    );
  }

  async update(id: number, request: ActualizacionAcademicaRequest): Promise<ActualizacionAcademica> {
    return httpClient.putAuth<ActualizacionAcademica>(
      `${this.PATH}/${id}`,
      request,
      'Error al actualizar la actualización académica'
    );
  }

  async delete(id: number): Promise<void> {
    return httpClient.deleteAuth<void>(
      `${this.PATH}/${id}`,
      'Error al eliminar la actualización académica'
    );
  }
}
