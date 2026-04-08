import type {
  LoginData,
  RegisterData,
  AuthResponse,
} from '../domain/authTypes';

export interface IAuthRepository {
  login(data: LoginData): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
}
