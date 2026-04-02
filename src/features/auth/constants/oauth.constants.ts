// para que sea mas facil el deploy pol fa hagas ref a esas variables si van a usar
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const OAUTH_URLS = {
  google:   `${API_URL}/auth/google`,
  github:   `${API_URL}/auth/github`,
  linkedin: `${API_URL}/auth/linkedin`,
} as const;
