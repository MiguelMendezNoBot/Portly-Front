// Entidad de dominio para Formación Académica
// Refleja el DTO FormacionAcademicaResponse del backend
export interface FormacionAcademica {
  idFormacionAcademica?: number;
  institucion: string;
  carrera: string;
  fechaInicio: string;       // LocalDate → "YYYY-MM-DD"
  fechaFinalizacion: string | null;
  actualmenteEstudiando: boolean;
  descripcion: string;
  nivel: string;
}

// DTO que se envía al backend en POST / PUT
export interface FormacionAcademicaRequest {
  institucion: string;
  carrera: string;
  fechaInicio: string;
  fechaFinalizacion: string | null;
  actualmenteEstudiando: boolean;
  descripcion: string;
  nivel: string;
}
