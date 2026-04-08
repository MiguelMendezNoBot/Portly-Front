import { describe, expect, it } from '@jest/globals';
import {
  mapBackendToUserProfile,
  mapUpdateDtoToBackend,
} from '../userProfile.mapping';

describe('mapBackendToUserProfile', () => {
  it('mapea campos planos y listas de enlaces/proveedores', () => {
    const entity = mapBackendToUserProfile({
      idUsuario: 'u1',
      nombre: 'N',
      apellido: 'A',
      email: 'n@e.com',
      titularProfesional: 'Ing',
      acercaDeMi: 'Hola',
      enlaceFoto: 'https://x.com/p.png',
      enlaces: [
        { plataformaProfesional: 'github', direccionEnlace: 'https://gh' },
        { plataformaProfesional: 'linkedin', direccionEnlace: 'https://li' },
      ],
      proveedores: [{ nombreProveedor: 'Google' }],
    });

    expect(entity).toMatchObject({
      id: 'u1',
      firstName: 'N',
      lastName: 'A',
      email: 'n@e.com',
      profession: 'Ing',
      bio: 'Hola',
      avatarUrl: 'https://x.com/p.png',
      socialLinks: { github: 'https://gh', linkedin: 'https://li' },
      connectedProviders: ['google'],
    });
  });
});

describe('mapUpdateDtoToBackend', () => {
  it('traduce solo los campos presentes', () => {
    expect(
      mapUpdateDtoToBackend({
        firstName: 'A',
        lastName: 'B',
        profession: 'P',
        bio: 'Bio',
      })
    ).toEqual({
      nombre: 'A',
      apellido: 'B',
      titularProfesional: 'P',
      acercaDeMi: 'Bio',
    });
  });
});
