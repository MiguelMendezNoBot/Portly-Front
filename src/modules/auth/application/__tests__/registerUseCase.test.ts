import { describe, expect, it, jest } from '@jest/globals';
import type { AuthResponse } from '../../domain/authTypes';
import type { IAuthRepository } from '../IAuthRepository';
import { executeRegisterUseCase } from '../registerUseCase';

const validForm = {
  nombre: 'Ana',
  apellido: 'Gomez',
  profesion: 'Dev',
  email: 'ana@example.com',
  biografia: 'Bio',
  password: 'Aa1!aaaa',
  confirmPassword: 'Aa1!aaaa',
};

describe('executeRegisterUseCase', () => {
  it('no registra si la validación falla', async () => {
    const register = jest.fn<IAuthRepository['register']>();
    const repo = { login: jest.fn(), register } as IAuthRepository;

    const result = await executeRegisterUseCase(repo, {
      ...validForm,
      email: 'mal',
    });

    expect(register).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it('envía RegisterData al repositorio cuando todo es válido', async () => {
    const response: AuthResponse = {
      token: 't',
      idUsuario: '1',
      email: 'ana@example.com',
      rol: 'USER',
    };
    const register = jest
      .fn<IAuthRepository['register']>()
      .mockResolvedValue(response);
    const repo = { login: jest.fn(), register } as IAuthRepository;

    const result = await executeRegisterUseCase(repo, validForm);

    expect(register).toHaveBeenCalledWith({
      nombre: 'Ana',
      apellido: 'Gomez',
      profesion: 'Dev',
      correoElectronico: 'ana@example.com',
      biografia: 'Bio',
      contrasena: 'Aa1!aaaa',
      confirmarContrasena: 'Aa1!aaaa',
    });
    expect(result).toEqual({ success: true, response });
  });
});
