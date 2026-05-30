export interface RegisterData {
  username: string;
  nombre: string;
  apellido: string;
  profesion: string;
  correoElectronico: string;
  biografia: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface LoginData {
  identifier: string;  // puede ser email o nombre de usuario
  contraseña: string;
}

export interface AuthResponse {
  token: string;
  idUsuario: string;
  email: string;
  rol: string;
}
