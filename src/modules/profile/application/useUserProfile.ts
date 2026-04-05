import { useCallback, useEffect, useState } from 'react';
import type { UserProfileEntity, UpdateUserProfileDTO } from '../domain/userProfile.entity';
import { userProfileRepository } from '../infrastructure/userProfile.repository';

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
  const [profile, setProfile] = useState<UserProfileEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userProfileRepository.getProfile();
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = useCallback(
    async (dto: UpdateUserProfileDTO) => {
      setSaving(true);
      setError(null);
      try {
        const updated = await userProfileRepository.updateProfile(dto);
        setProfile(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al guardar');
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const uploadAvatar = useCallback(async (file: File) => {
    setSaving(true);
    try {
      const { avatarUrl } = await userProfileRepository.updateAvatar(file);
      setProfile((prev) => (prev ? { ...prev, avatarUrl } : prev));
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
    refetch: fetchProfile,
  };
}
