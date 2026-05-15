import { ActualizacionAcademica, ActualizacionAcademicaRequest } from '../entities/ActualizacionAcademica';

export interface ActualizacionAcademicaRepository {
  getAll(): Promise<ActualizacionAcademica[]>;
  create(request: ActualizacionAcademicaRequest): Promise<ActualizacionAcademica>;
  update(id: number, request: ActualizacionAcademicaRequest): Promise<ActualizacionAcademica>;
  delete(id: number): Promise<void>;
}
