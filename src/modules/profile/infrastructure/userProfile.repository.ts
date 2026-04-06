import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../domain/userProfile.entity';
import { mapBackendToUserProfile, mapUpdateDtoToBackend } from '../domain/userProfile.mapping';
import type { IUserProfileRepository } from '../application/IUserProfileRepository';
import { httpClient } from '../../../infrastructure/http/httpClient';
import { getToken } from '../../../infrastructure/storage/storage';

const API_BASE = import.meta.env.VITE_API_URL;

export const userProfileRepository: IUserProfileRepository = {
  async getProfile(): Promise<UserProfileEntity> {
    const data = await httpClient.getAuth<Record<string, unknown>>(
      '/api/profile',
      'Error al cargar perfil',
    );
    return mapBackendToUserProfile(data);
  },

  async updateProfile(dto: UpdateUserProfileDTO): Promise<UserProfileEntity> {
    const data = await httpClient.putAuth<Record<string, unknown>>(
      '/api/profile',
      mapUpdateDtoToBackend(dto),
      'Error al guardar perfil',
    );
    return mapBackendToUserProfile(data);
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

    const data = (await res.json()) as { avatarUrl: string };
    return { avatarUrl: data.avatarUrl };
  },
};
