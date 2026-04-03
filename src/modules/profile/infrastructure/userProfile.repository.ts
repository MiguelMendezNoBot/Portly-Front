import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../domain/userProfile.entity';

// ─── Base URL del backend ────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ─── Mock (se usa mientras el backend no esté disponible) ────────────────────
const MOCK_PROFILE: UserProfileEntity = {
  id: '1',
  firstName: 'Victor',
  lastName: 'Terrazas',
  email: 'victorterrazas@linx.soft',
  profession: 'UI/UX Designer & Creative Strategist',
  bio: 'Diseñador multidisciplinario enfocado en crear experiencias digitales inmersivas. Me apasiona la intersección entre la tecnología y el arte visual, buscando siempre el equilibrio entre funcionalidad y estética neon-futurista.',
  avatarUrl: undefined,
  visibility: {
    showEmail: true,
    showProfession: true,
    showBio: false,
  },
  socialLinks: {
    github: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Repository ───────────────────────────────────────────────────────────────
export const userProfileRepository = {
  /**
   * Obtiene el perfil del usuario autenticado.
   * Mientras el backend no esté disponible, devuelve el mock.
   */
  async getProfile(): Promise<UserProfileEntity> {
    try {
      const res = await fetch(`${API_BASE}/api/profile/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      return handleResponse<UserProfileEntity>(res);
    } catch {
      // Devuelve el mock si el backend no responde
      console.warn(
        '[userProfileRepository] Backend no disponible, usando mock.'
      );
      return Promise.resolve(MOCK_PROFILE);
    }
  },

  /**
   * Actualiza el perfil del usuario autenticado.
   */
  async updateProfile(dto: UpdateUserProfileDTO): Promise<UserProfileEntity> {
    try {
      const res = await fetch(`${API_BASE}/api/profile/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dto),
      });
      return handleResponse<UserProfileEntity>(res);
    } catch {
      console.warn(
        '[userProfileRepository] Backend no disponible, simulando update.'
      );
      return Promise.resolve({ ...MOCK_PROFILE, ...dto } as UserProfileEntity);
    }
  },

  /**
   * Actualiza el avatar del usuario (multipart/form-data).
   */
  async updateAvatar(file: File): Promise<{ avatarUrl: string }> {
    const form = new FormData();
    form.append('avatar', file);
    try {
      const res = await fetch(`${API_BASE}/api/profile/me/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      return handleResponse<{ avatarUrl: string }>(res);
    } catch {
      console.warn(
        '[userProfileRepository] Backend no disponible, usando mock avatar.'
      );
      return Promise.resolve({ avatarUrl: URL.createObjectURL(file) });
    }
  },
};
