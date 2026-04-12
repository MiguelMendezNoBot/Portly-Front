import { useCallback, useEffect, useState } from 'react';
import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../domain/userProfile.entity';
import { userProfileRepository } from '../infrastructure/userProfile.repository';

// Caché global para evitar recargar el perfil en cada navegación
let globalProfileCache: UserProfileEntity | null = null;
let profileFetchPromise: Promise<UserProfileEntity> | null = null;

interface UseUserProfileReturn {
  profile: UserProfileEntity | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveProfile: (dto: UpdateUserProfileDTO) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  refetch: () => void;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfileEntity | null>(globalProfileCache);
  const [loading, setLoading] = useState(!globalProfileCache);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!globalProfileCache) {
      setLoading(true);
      setError(null);
    }

    try {
      if (!profileFetchPromise) {
        profileFetchPromise = userProfileRepository.getProfile().finally(() => {
          profileFetchPromise = null;
        });
      }
      
      const data = await profileFetchPromise;
      globalProfileCache = data;
      setProfile(globalProfileCache);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el perfil');
    } finally {
      if (!globalProfileCache) {
        setLoading(false);
      } else {
        // En caso de que se haya resuelto y ya esté montado
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = useCallback(async (dto: UpdateUserProfileDTO) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await userProfileRepository.updateProfile(dto);
      globalProfileCache = updated;
      setProfile(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    setSaving(true);
    try {
      const { avatarUrl } = await userProfileRepository.updateAvatar(file);
      setProfile((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, avatarUrl };
        globalProfileCache = updated;
        return updated;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir avatar');
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    profile,
    loading,
    saving,
    error,
    saveProfile,
    uploadAvatar,
    refetch: () => {
       globalProfileCache = null; // Forzamos nueva recarga sin caché
       fetchProfile();
    },
  };
}
