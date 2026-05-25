export interface PlantillaStats {
  nombre: string;
  cantidad: number;
}

export interface ProfesionStats {
  nombre: string;
  cantidad: number;
}

export interface DashboardStats {
  usuariosRegistradosSemana: number;
  portafoliosPublicosSemana: number;
  denunciasPendientes: number;
  cuentasSuspendidas: number;
  plantillasMasUsadas: PlantillaStats[];
  profesionesMasRegistradas: ProfesionStats[];
}
