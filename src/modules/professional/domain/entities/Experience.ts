export interface Experience {
  id?: number;
  nombreEmpresa: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string | null;
  actualmenteTrabajando: boolean;
  descripcion: string;
  funcionesPrincipales: string[];
  logros: string[];
  referenciaProfesional: {
    correoJefe: string;
    numeroJefe: string;
    cargoJefe: string;
  };
}
