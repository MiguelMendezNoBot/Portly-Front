import { FormacionAcademica, FormacionAcademicaRequest } from '../entities/FormacionAcademica';

export interface FormacionAcademicaRepository {
  getAll(): Promise<FormacionAcademica[]>;
  create(request: FormacionAcademicaRequest): Promise<FormacionAcademica>;
  update(id: number, request: FormacionAcademicaRequest): Promise<FormacionAcademica>;
  delete(id: number): Promise<void>;
}
