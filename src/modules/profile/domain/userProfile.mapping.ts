import type {
  UpdateUserProfileDTO,
  UserProfileEntity,
} from './userProfile.entity';

export function mapBackendToUserProfile(
  data: Record<string, unknown>
): UserProfileEntity {
  const socialLinks: UserProfileEntity['socialLinks'] = {
    github: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
  };

  const enlaces = data.enlaces;
  if (enlaces && Array.isArray(enlaces)) {
    for (const enlace of enlaces as {
      plataformaProfesional?: string;
      direccionEnlace?: string;
    }[]) {
      const plataforma = (enlace.plataformaProfesional || '').toLowerCase();
      if (plataforma in socialLinks) {
        (socialLinks as Record<string, string>)[plataforma] =
          enlace.direccionEnlace || '';
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
    phone: data.telefono ? String(data.telefono) : '',
    phoneCode: data.codigoTelefono ? String(data.codigoTelefono) : '+591',
    nationality: data.pais ? String(data.pais) : '',
    avatarUrl: data.enlaceFoto ? String(data.enlaceFoto) : undefined,
    visibility: {
      showEmail:
        data.mostrarCorreo !== undefined ? Boolean(data.mostrarCorreo) : true,
      showProfession:
        data.mostrarProfesion !== undefined
          ? Boolean(data.mostrarProfesion)
          : true,
      showBio:
        data.mostrarBiografia !== undefined
          ? Boolean(data.mostrarBiografia)
          : true,
      showPhone:
        data.mostrarTelefono != null ? Boolean(data.mostrarTelefono) : true,
      showNationality:
        data.mostrarPais != null ? Boolean(data.mostrarPais) : true,
      showLinkedin:
        data.mostrarLinkedin != null ? Boolean(data.mostrarLinkedin) : true,
      showGithub:
        data.mostrarGithub != null ? Boolean(data.mostrarGithub) : true,
      showInstagram:
        data.mostrarInstagram !== undefined
          ? Boolean(data.mostrarInstagram)
          : true,
      showFacebook:
        data.mostrarFacebook !== undefined
          ? Boolean(data.mostrarFacebook)
          : true,
      showYoutube:
        data.mostrarYoutube !== undefined ? Boolean(data.mostrarYoutube) : true,
      showTechSkills:
        data.mostrarHabilidadesTecnicas !== undefined
          ? Boolean(data.mostrarHabilidadesTecnicas)
          : true,
      showSoftSkills:
        data.mostrarHabilidadesBlandas !== undefined
          ? Boolean(data.mostrarHabilidadesBlandas)
          : true,
      showExperience:
        data.mostrarTrayectoria !== undefined
          ? Boolean(data.mostrarTrayectoria)
          : true,
      showEducation:
        data.mostrarFormacion !== undefined
          ? Boolean(data.mostrarFormacion)
          : true,
    },
    socialLinks,
    connectedProviders,
    estado: String(data.estado ?? 'activo'),
  };
}

export function mapUpdateDtoToBackend(
  dto: UpdateUserProfileDTO
): Record<string, unknown> {
  return {
    nombre: dto.firstName,
    apellido: dto.lastName,
    titularProfesional: dto.profession,
    acercaDeMi: dto.bio,
    codigoTelefono: dto.phoneCode,
    telefono: dto.phone,
    pais: dto.nationality,
    ...(dto.visibility !== undefined && {
      mostrarCorreo: dto.visibility.showEmail,
      mostrarProfesion: dto.visibility.showProfession,
      mostrarBiografia: dto.visibility.showBio,
      mostrarTelefono: dto.visibility.showPhone,
      mostrarPais: dto.visibility.showNationality,
      mostrarLinkedin: dto.visibility.showLinkedin,
      mostrarGithub: dto.visibility.showGithub,
      mostrarInstagram: dto.visibility.showInstagram,
      mostrarFacebook: dto.visibility.showFacebook,
      mostrarYoutube: dto.visibility.showYoutube,
      mostrarHabilidadesTecnicas: dto.visibility.showTechSkills,
      mostrarHabilidadesBlandas: dto.visibility.showSoftSkills,
      mostrarTrayectoria: dto.visibility.showExperience,
      mostrarFormacion: dto.visibility.showEducation,
    }),
  };
}
