import type { AuthResponse } from '../domain/authTypes';
import type {
  LoginFormErrors,
  LoginFormFields,
} from '../domain/loginCredentials';
import {
  isLoginFormValid,
  validateLoginFields,
} from '../domain/loginCredentials';
import type { IAuthRepository } from './IAuthRepository';

export type LoginUseCaseResult =
  | { success: true; response: AuthResponse }
  | { success: false; errors: LoginFormErrors };

export async function executeLoginUseCase(
  repo: IAuthRepository,
  fields: LoginFormFields
): Promise<LoginUseCaseResult> {
  const errors = validateLoginFields(fields);
  if (!isLoginFormValid(errors)) {
    return { success: false, errors };
  }
  const response = await repo.login({
    identifier: fields.identifier.trim(),
    contraseña: fields.password,
  });
  return { success: true, response };
}
