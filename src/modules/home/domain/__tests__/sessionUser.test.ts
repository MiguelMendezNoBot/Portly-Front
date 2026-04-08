import { describe, expect, it } from '@jest/globals';
import { decodeJwtEmail, emailToDisplayName } from '../sessionUser';

describe('decodeJwtEmail', () => {
  it('extrae email del payload', () => {
    const payload = btoa(
      JSON.stringify({ email: 'user@test.com', sub: 'ignored' })
    );
    const token = `h.${payload}.s`;
    expect(decodeJwtEmail(token)).toBe('user@test.com');
  });

  it('usa sub si parece email', () => {
    const payload = btoa(JSON.stringify({ sub: 'other@test.com' }));
    expect(decodeJwtEmail(`h.${payload}.s`)).toBe('other@test.com');
  });

  it('devuelve null si el token es inválido', () => {
    expect(decodeJwtEmail('not-a-jwt')).toBeNull();
  });
});

describe('emailToDisplayName', () => {
  it('formatea la parte local del correo', () => {
    expect(emailToDisplayName('ana.perez@mail.com')).toBe('Ana Perez');
  });
});
