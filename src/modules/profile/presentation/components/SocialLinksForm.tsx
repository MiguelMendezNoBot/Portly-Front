import type { UserProfileEntity } from '../../domain/userProfile.entity';
import { getToken } from '../../../../infrastructure/storage/storage';
import {
  PORTLY_PENDING_OAUTH_PROVIDER_KEY,
  type PortlyOAuthLinkProvider,
} from '../constants/oauthLink.constants';

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon
        points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type SocialKey = keyof UserProfileEntity['socialLinks'];

import { API_BASE } from '../constants/api.constants';

interface SocialLinksFormProps {
  links: UserProfileEntity['socialLinks'];
  connectedProviders: string[];
  onChange: (key: SocialKey, value: string) => void;
  onLinked?: (provider: 'github' | 'linkedin') => void;
  errors?: Partial<Record<SocialKey, string>>;
}

export default function SocialLinksForm({
  links,
  connectedProviders,
  onChange,
  onLinked: _onLinked,
  errors,
}: SocialLinksFormProps) {
  const isGithubConnected = connectedProviders.includes('github');
  const isLinkedinConnected = connectedProviders.includes('linkedin');

  function handleVincular(provider: PortlyOAuthLinkProvider) {
    const token = getToken();
    if (!token) {
      alert('Debes iniciar sesión para vincular una cuenta.');
      return;
    }
    sessionStorage.setItem(PORTLY_PENDING_OAUTH_PROVIDER_KEY, provider);
    window.location.href = `${API_BASE}/auth/link/${provider}?token=${token}`;
  }

  return (
    <div className="flex flex-col bg-src-0f111a border border-white/5 rounded-[16px] overflow-hidden">
      <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-white/5">
        <h2 className="text-src-e5e7f6 font-bold text-lg sm:text-3xl">
          Redes Sociales
        </h2>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={isGithubConnected}
            onClick={() => !isGithubConnected && handleVincular('github')}
            className={`
              flex items-center justify-center gap-3 py-3 px-4 rounded-[12px]
              text-sm font-semibold transition-all duration-200
              ${
                isGithubConnected
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 cursor-default'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer'
              }
            `}
          >
            {isGithubConnected ? <CheckIcon /> : <GithubIcon />}
            {isGithubConnected ? 'GitHub conectado' : 'Vincular GitHub'}
          </button>

          <button
            type="button"
            disabled={isLinkedinConnected}
            onClick={() => !isLinkedinConnected && handleVincular('linkedin')}
            className={`
              flex items-center justify-center gap-3 py-3 px-4 rounded-[12px]
              text-sm font-semibold transition-all duration-200
              ${
                isLinkedinConnected
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 cursor-default'
                  : 'bg-src-2f2ebe/20 border border-src-9093ff/20 text-src-9093ff hover:bg-src-2f2ebe/35 cursor-pointer'
              }
            `}
          >
            {isLinkedinConnected ? <CheckIcon /> : <LinkedinIcon />}
            {isLinkedinConnected ? 'LinkedIn vinculado' : 'Vincular LinkedIn'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {(
            [
              {
                key: 'instagram' as SocialKey,
                icon: <InstagramIcon />,
                placeholder: 'https://instagram.com/usuario',
                label: 'Instagram',
              },
              {
                key: 'facebook' as SocialKey,
                icon: <FacebookIcon />,
                placeholder: 'https://facebook.com/usuario',
                label: 'Facebook',
              },
              {
                key: 'youtube' as SocialKey,
                icon: <YoutubeIcon />,
                placeholder: 'https://youtube.com/c/canal',
                label: 'YouTube',
              },
            ] as {
              key: SocialKey;
              icon: React.ReactNode;
              placeholder: string;
              label: string;
            }[]
          ).map(({ key, icon, placeholder, label }) => (
            <div key={key} className="flex items-start gap-2 sm:gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-src-1e293b border border-transparent flex items-center justify-center text-src-a7aab9 shrink-0 mt-0.5">
                {icon}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <input
                  type="text"
                  value={links[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={placeholder}
                  aria-label={`URL de ${label}`}
                  className={`
                    w-full min-w-0 bg-src-1e293b border rounded-[12px] px-3 sm:px-4 py-3
                    text-white text-sm placeholder-src-6b7280
                    focus:outline-none focus:ring-0
                    transition-colors truncate overflow-x-hidden
                    ${errors && errors[key] ? 'border-red-500/50 focus:border-red-500' : 'border-transparent focus:border-transparent'}
                  `}
                />
                {errors && errors[key] && (
                  <span className="text-red-500 text-xs mt-1.5 pl-1 inline-block">
                    {errors[key]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
