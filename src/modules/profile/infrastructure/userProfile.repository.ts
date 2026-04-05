import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../domain/userProfile.entity';
import { httpClient } from '../../../infrastructure/http/httpClient';

// Mapea la respuesta del backend (español) al formato del frontend (inglés)
function mapBackendToFrontend(data: any): UserProfileEntity {
  const socialLinks: UserProfileEntity['socialLinks'] = {
    github: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
  };

  if (data.enlaces && Array.isArray(data.enlaces)) {
    for (const enlace of data.enlaces) {
      const plataforma = (enlace.plataformaProfesional || '').toLowerCase();
      if (plataforma in socialLinks) {
        (socialLinks as any)[plataforma] = enlace.direccionEnlace || '';
      }
    }
  }

  // Extraer proveedores vinculados
  const connectedProviders: string[] = [];
  if (data.proveedores && Array.isArray(data.proveedores)) {
    for (const p of data.proveedores) {
      connectedProviders.push((p.nombreProveedor || '').toLowerCase());
    }
  }

  return {
    id: data.idUsuario || '',
    firstName: data.nombre || '',
    lastName: data.apellido || '',
    email: data.email || '',
    profession: data.titularProfesional || '',
    bio: data.acercaDeMi || '',
    avatarUrl: data.enlaceFoto || undefined,
    visibility: {
      showEmail: true,
      showProfession: true,
      showBio: true,
    },
    socialLinks,
    connectedProviders,
  };
}

// Mapea el DTO del frontend (inglés) al formato del backend (español)
function mapFrontendToBackend(dto: UpdateUserProfileDTO): any {
  return {
    nombre: dto.firstName,
    apellido: dto.lastName,
    titularProfesional: dto.profession,
    acercaDeMi: dto.bio,
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────
export const userProfileRepository = {
  async getProfile(): Promise<UserProfileEntity> {
    const data = await httpClient.getAuth<any>('/api/profile', 'Error al cargar perfil');
    return mapBackendToFrontend(data);
  },

  async updateProfile(dto: UpdateUserProfileDTO): Promise<UserProfileEntity> {
    const data = await httpClient.putAuth<any>('/api/profile', mapFrontendToBackend(dto), 'Error al guardar perfil');
    return mapBackendToFrontend(data);
  },

  async updateAvatar(file: File): Promise<{ avatarUrl: string }> {
    // No hay endpoint de upload todavía, se usa URL local temporal
    const localUrl = URL.createObjectURL(file);
    return { avatarUrl: localUrl };
  },
};
