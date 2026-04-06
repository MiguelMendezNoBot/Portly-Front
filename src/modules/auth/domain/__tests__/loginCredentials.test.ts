import { describe, expect, it } from '@jest/globals';
import { isLoginFormValid, validateLoginFields } from '../loginCredentials';

describe('validateLoginFields', () => {
  it('marca correo y contraseña vacíos', () => {
    const errors = validateLoginFields({ email: '', password: '' });
    expect(errors.email).toBe('El correo es obligatorio');
    expect(errors.password).toBe('La contraseña es obligatoria');
    expect(isLoginFormValid(errors)).toBe(false);
  });

  it('acepta correo con espacios solo si trim no vacío — correo solo espacios falla', () => {
    const errors = validateLoginFields({ email: '   ', password: 'x' });
    expect(errors.email).toBe('El correo es obligatorio');
  });

  it('pasa con credenciales mínimas válidas', () => {
    const errors = validateLoginFields({ email: 'a@b.co', password: 'secret' });
    expect(isLoginFormValid(errors)).toBe(true);
  });
});
