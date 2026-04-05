import { useCallback, useEffect, useState } from 'react';
import type { UserProfileEntity, UpdateUserProfileDTO } from '../domain/userProfile.entity';
import { userProfileRepository } from '../infrastructure/userProfile.repository';

// 1️⃣ AQUÍ ESTÁ EL MOCK (Usuario Tradicional, CON contraseña local)
const mockProfileWithPassword: any = {
  id: "uuid-9876-5432",
  firstName: "Carlos",
  lastName: "Dev",
  email: "carlos.dev@hotmail.com",
  profession: "Ingeniero Backend",
  bio: "Probando mi perfil tradicional. Debería poder ver el cambio de contraseña.",
  avatarUrl: "https://i.pravatar.cc/150?u=carlos",
  visibility: { showEmail: false, showProfession: true, showBio: true },
  socialLinks: { github: "", linkedin: "https://linkedin.com/in/carlos", instagram: "", facebook: "", youtube: "" },
  connectedProviders: [], // Vacío porque no inició sesión con Google
  hasLocalPassword: true // 🟢 ESTO HARÁ QUE SE MUESTRE EL FORMULARIO
};

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
  // 2️⃣ INICIAMOS EL ESTADO CON EL MOCK DE CONTRASEÑA ACTIVA
  const [profile, setProfile] = useState<UserProfileEntity | null>(mockProfileWithPassword);
  
  // 3️⃣ PONEMOS LOADING EN FALSE PARA VER LA PANTALLA DIRECTO
  const [loading, setLoading] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    // 4️⃣ CANCELAMOS TEMPORALMENTE LA LLAMADA REAL AL BACKEND
    // (Cuando el backend esté listo, solo borra este "return;" y descomenta lo de abajo)
    return; 
    /*
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
    */
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