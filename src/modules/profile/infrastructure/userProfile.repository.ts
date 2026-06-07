import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../domain/userProfile.entity';
import {
  mapBackendToUserProfile,
  mapUpdateDtoToBackend,
} from '../domain/userProfile.mapping';
import type { IUserProfileRepository } from '../application/IUserProfileRepository';
import { httpClient } from '../../../infrastructure/http/httpClient';
import { getToken } from '../../../infrastructure/storage/storage';

const API_BASE = import.meta.env.VITE_API_URL;

export const userProfileRepository: IUserProfileRepository = {
  async getProfile(): Promise<UserProfileEntity> {
    const data = await httpClient.getAuth<Record<string, unknown>>(
      '/api/profile',
      'Error al cargar perfil'
    );
    return mapBackendToUserProfile(data);
  },

  async updateProfile(dto: UpdateUserProfileDTO): Promise<UserProfileEntity> {
    const profilePromise = httpClient.putAuth<Record<string, unknown>>(
      '/api/profile',
      mapUpdateDtoToBackend(dto),
      'Error al guardar perfil'
    );

    if (dto.socialLinks) {
      await profilePromise;
      await httpClient.postAuth(
        '/api/redes-sociales',
        {
          gmail:     '',
          instagram: dto.socialLinks.instagram || '',
          facebook:  dto.socialLinks.facebook  || '',
          youtube:   dto.socialLinks.youtube   || '',
          github:    dto.socialLinks.github    || '',
          linkedin:  dto.socialLinks.linkedin  || '',
        },
        'Error al guardar redes sociales'
      );
    } else {
      await profilePromise;
    }

    // Refetch to get the updated state including social links potentially processed by backend
    const data = await httpClient.getAuth<Record<string, unknown>>(
      '/api/profile',
      'Error al cargar perfil actualizado'
    );
    const updatedProfile = mapBackendToUserProfile(data);

    // Explicitly merge the just-saved socialLinks into the updated profile to prevent them from disappearing
    // in case the backend GET /api/profile response does not immediately reflect the new state.
    if (dto.socialLinks) {
      updatedProfile.socialLinks = {
        ...updatedProfile.socialLinks,
        ...dto.socialLinks,
      };
    }

    return updatedProfile;
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
