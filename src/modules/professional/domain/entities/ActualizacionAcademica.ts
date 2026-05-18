export interface ActualizacionAcademica {
  idActualizacionAcademica?: number;
  institucion: string;
  tipo: string;
  titulo: string;
  fechaInicio: string;
  fechaFinalizacion: string | null;
  aunNoLoFinalice: boolean;
  descripcion: string;
}

export interface ActualizacionAcademicaRequest {
  institucion: string;
  tipo: string;
  titulo: string;
  fechaInicio: string;
  fechaFinalizacion: string | null;
  aunNoLoFinalice: boolean;
  descripcion: string;
}
