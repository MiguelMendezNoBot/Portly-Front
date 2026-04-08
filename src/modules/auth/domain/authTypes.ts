export interface RegisterData {
  nombre: string;
  apellido: string;
  profesion: string;
  correoElectronico: string;
  biografia: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface LoginData {
  correoElectronico: string;
  contraseña: string;
}

export interface AuthResponse {
  token: string;
  idUsuario: string;
  email: string;
  rol: string;
}
