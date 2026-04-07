import type { UpdateUserProfileDTO, UserProfileEntity } from './userProfile.entity';

export function mapBackendToUserProfile(data: Record<string, unknown>): UserProfileEntity {
  const socialLinks: UserProfileEntity['socialLinks'] = {
    github: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
  };

  const enlaces = data.enlaces;
  if (enlaces && Array.isArray(enlaces)) {
    for (const enlace of enlaces as { plataformaProfesional?: string; direccionEnlace?: string }[]) {
      const plataforma = (enlace.plataformaProfesional || '').toLowerCase();
      if (plataforma in socialLinks) {
        (socialLinks as Record<string, string>)[plataforma] = enlace.direccionEnlace || '';
      }
    }
  }

  const connectedProviders: string[] = [];
  const proveedores = data.proveedores;
  if (proveedores && Array.isArray(proveedores)) {
    for (const p of proveedores as { nombreProveedor?: string }[]) {
      connectedProviders.push((p.nombreProveedor || '').toLowerCase());
    }
  }

  return {
    id: String(data.idUsuario ?? ''),
    firstName: String(data.nombre ?? ''),
    lastName: String(data.apellido ?? ''),
    email: String(data.email ?? ''),
    profession: String(data.titularProfesional ?? ''),
    bio: String(data.acercaDeMi ?? ''),
    avatarUrl: data.enlaceFoto ? String(data.enlaceFoto) : undefined,
    visibility: {
      showEmail: true,
      showProfession: true,
      showBio: true,
    },
    socialLinks,
    connectedProviders,
  };
}

export function mapUpdateDtoToBackend(dto: UpdateUserProfileDTO): Record<string, unknown> {
  return {
    nombre: dto.firstName,
    apellido: dto.lastName,
    titularProfesional: dto.profession,
    acercaDeMi: dto.bio,
  };
}
