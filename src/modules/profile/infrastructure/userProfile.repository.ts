import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../domain/userProfile.entity';
import { httpClient } from '../../../infrastructure/http/httpClient';
import { getToken } from '../../../infrastructure/storage/storage';

const API_BASE = import.meta.env.VITE_API_URL;

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
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/api/profile/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error ${res.status} al subir imagen`);
    }

    const data = await res.json();
    return { avatarUrl: data.avatarUrl };
  },
};
