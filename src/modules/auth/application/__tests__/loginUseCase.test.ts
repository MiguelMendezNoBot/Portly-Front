import { describe, expect, it, jest } from '@jest/globals';
import type { AuthResponse } from '../../domain/authTypes';
import type { IAuthRepository } from '../IAuthRepository';
import { executeLoginUseCase } from '../loginUseCase';

describe('executeLoginUseCase', () => {
  it('no llama al repositorio si la validación falla', async () => {
    const login = jest.fn<IAuthRepository['login']>();
    const repo = { login, register: jest.fn() } as IAuthRepository;

    const result = await executeLoginUseCase(repo, { email: '', password: '' });

    expect(login).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.email).toBeDefined();
    }
  });

  it('llama al repositorio con datos mapeados cuando la validación pasa', async () => {
    const response: AuthResponse = {
      token: 't',
      idUsuario: '1',
      email: 'u@u.com',
      rol: 'USER',
    };
    const login = jest
      .fn<IAuthRepository['login']>()
      .mockResolvedValue(response);
    const repo = { login, register: jest.fn() } as IAuthRepository;

    const result = await executeLoginUseCase(repo, {
      email: '  u@u.com  ',
      password: 'secret',
    });

    expect(login).toHaveBeenCalledWith({
      correoElectronico: 'u@u.com',
      contraseña: 'secret',
    });
    expect(result).toEqual({ success: true, response });
  });
});
