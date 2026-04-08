import { describe, expect, it } from '@jest/globals';
import {
  validateAlphaField,
  validateEmail,
  validatePassword,
  validateRegisterFields,
} from '../registerValidation';

const validFields = () => ({
  nombre: 'Ana',
  apellido: 'Gomez',
  profesion: 'Dev',
  email: 'ana@example.com',
  biografia: 'Bio corta',
  password: 'Aa1!aaaa',
  confirmPassword: 'Aa1!aaaa',
});

describe('validateEmail', () => {
  it('rechaza vacío y formato inválido', () => {
    expect(validateEmail('')).toBe('El correo es obligatorio');
    expect(validateEmail('no-arroba')).toBe(
      'Ingresa un correo válido (ej: nombre@dominio.com)'
    );
  });

  it('acepta correo válido', () => {
    expect(validateEmail('user@domain.com')).toBeUndefined();
  });
});

describe('validateAlphaField', () => {
  it('rechaza corto o con dígitos', () => {
    expect(validateAlphaField('ab', 'Campo')).toContain('3 caracteres');
    expect(validateAlphaField('abcd1', 'Campo')).toContain(
      'solo acepta letras'
    );
  });
});

describe('validatePassword', () => {
  it('rechaza débil y acepta fuerte', () => {
    expect(validatePassword('short')).toBeDefined();
    expect(validatePassword('Aa1!aaaa')).toBeUndefined();
  });
});

describe('validateRegisterFields', () => {
  it('valida solo el paso 1 cuando step=1', () => {
    const { errors, isValid } = validateRegisterFields(
      {
        ...validFields(),
        email: '',
        password: '',
        confirmPassword: '',
      },
      1
    );
    expect(isValid).toBe(false);
    expect(errors.email).toBeDefined();
    expect(errors.nombre).toBeUndefined();
  });

  it('valida formulario completo sin step', () => {
    expect(validateRegisterFields(validFields()).isValid).toBe(true);
  });
});
