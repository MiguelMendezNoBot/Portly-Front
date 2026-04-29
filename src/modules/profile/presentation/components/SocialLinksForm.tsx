import type { UserProfileEntity } from '../../domain/userProfile.entity';

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

type SocialKey = keyof UserProfileEntity['socialLinks'];

interface SocialLinksFormProps {
  links: UserProfileEntity['socialLinks'];
  onChange: (key: SocialKey, value: string) => void;
  errors?: Partial<Record<SocialKey, string>>;
}

export default function SocialLinksForm({
  links,
  onChange,
  errors,
}: SocialLinksFormProps) {
  return (
    <div className="flex flex-col bg-[#171B28] border border-white/5 rounded-[16px] overflow-hidden">
      <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-white/5">
        <h2 className="text-src-e5e7f6 font-bold text-lg sm:text-3xl">
          Redes Sociales
        </h2>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-4">
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
            <div className="w-10 h-10 rounded-[8px] bg-[#2D3449] border border-transparent flex items-center justify-center text-src-a7aab9 shrink-0 mt-0.5">
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
                  w-full min-w-0 bg-[#2D3449] border rounded-[12px] px-3 sm:px-4 py-3
                  text-white text-sm placeholder-src-6b7280
                  focus:outline-none focus:ring-0
                  transition-colors truncate overflow-x-hidden
                  ${errors?.[key] ? 'border-red-500/50 focus:border-red-500' : 'border-transparent focus:border-transparent'}
                `}
              />
              {errors?.[key] && (
                <span className="text-red-500 text-xs mt-1.5 pl-1 inline-block">
                  {errors[key]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
