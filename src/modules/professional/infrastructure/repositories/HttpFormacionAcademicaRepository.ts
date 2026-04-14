import { FormacionAcademica, FormacionAcademicaRequest } from '../../domain/entities/FormacionAcademica';
import { FormacionAcademicaRepository } from '../../domain/repositories/FormacionAcademicaRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

export class HttpFormacionAcademicaRepository implements FormacionAcademicaRepository {
  private readonly PATH = '/api/profile/formacion';

  async getAll(): Promise<FormacionAcademica[]> {
    return httpClient.getAuth<FormacionAcademica[]>(
      this.PATH,
      'No se pudo obtener la formación académica'
    );
  }

  async create(request: FormacionAcademicaRequest): Promise<FormacionAcademica> {
    return httpClient.postAuth<FormacionAcademica>(
      this.PATH,
      request,
      'Error al registrar la formación académica'
    );
  }

  async update(id: number, request: FormacionAcademicaRequest): Promise<FormacionAcademica> {
    return httpClient.putAuth<FormacionAcademica>(
      `${this.PATH}/${id}`,
      request,
      'Error al actualizar la formación académica'
    );
  }

  async delete(id: number): Promise<void> {
    return httpClient.deleteAuth<void>(
      `${this.PATH}/${id}`,
      'Error al eliminar la formación académica'
    );
  }
}
