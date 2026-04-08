import type {
  RegisterData,
  LoginData,
  AuthResponse,
} from '../domain/authTypes';
import { httpClient } from '../../../infrastructure/http/httpClient';

export const registerUser = (data: RegisterData) =>
  httpClient.post<AuthResponse>('/auth/register', data);

export const loginUser = (data: LoginData) =>
  httpClient.post<AuthResponse>('/auth/login', data);

export const forgotPassword = (email: string) =>
  httpClient.post(
    '/auth/forgot-password',
    { email },
    'No se encontró una cuenta con este correo.'
  );

export const verifyCode = (email: string, codigo: string) =>
  httpClient.post(
    '/auth/verify-code',
    { email, codigo },
    'El código es incorrecto o ha expirado.'
  );

export const resetPassword = (
  email: string,
  codigo: string,
  nuevaPassword: string
) =>
  httpClient.post(
    '/auth/reset-password',
    { email, codigo, nuevaPassword },
    'Error al cambiar la contraseña.'
  );

export const verifyAccountLink = (email: string) =>
  httpClient.post<boolean>('/auth/verify-account-link', { email });

export const changePassword = (data: any) =>
  httpClient.post(
    '/auth/change-password',
    data,
    'Error al actualizar la contraseña.'
  );
