import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../domain/userProfile.entity';
import { getToken } from '../../../infrastructure/storage/storage';

// ─── Base URL del backend ────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

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
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error ${res.status} al cargar perfil`);
    }

    const data = await res.json();
    return mapBackendToFrontend(data);
  },

  async updateProfile(dto: UpdateUserProfileDTO): Promise<UserProfileEntity> {
    const body = mapFrontendToBackend(dto);

    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error ${res.status} al guardar perfil`);
    }

    const data = await res.json();
    return mapBackendToFrontend(data);
  },

  async updateAvatar(file: File): Promise<{ avatarUrl: string }> {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error ${res.status} al subir avatar`);
    }

    const data = await res.json();
    return { avatarUrl: data.avatarUrl || data.url };
  },
};
