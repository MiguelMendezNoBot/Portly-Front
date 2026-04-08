import type { AuthResponse, RegisterData } from '../domain/authTypes';
import type {
  RegisterFormErrors,
  RegisterFormFields,
} from '../domain/registerValidation';
import { validateRegisterFields } from '../domain/registerValidation';
import type { IAuthRepository } from './IAuthRepository';

export type RegisterUseCaseResult =
  | { success: true; response: AuthResponse }
  | { success: false; errors: RegisterFormErrors };

export async function executeRegisterUseCase(
  repo: IAuthRepository,
  fields: RegisterFormFields
): Promise<RegisterUseCaseResult> {
  const { errors, isValid } = validateRegisterFields(fields);
  if (!isValid) {
    return { success: false, errors };
  }

  const data: RegisterData = {
    nombre: fields.nombre.trim(),
    apellido: fields.apellido.trim(),
    profesion: fields.profesion.trim(),
    correoElectronico: fields.email.trim(),
    biografia: fields.biografia?.trim() ?? '',
    contrasena: fields.password,
    confirmarContrasena: fields.confirmPassword,
  };

  const response = await repo.register(data);
  return { success: true, response };
}
