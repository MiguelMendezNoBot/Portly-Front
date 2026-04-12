import { useRef, useState } from 'react';

interface ProfileAvatarProps {
  name: string;
  profession: string;
  avatarUrl?: string;
  onFileChange: (file: File) => void;
  uploading?: boolean;
}

export default function ProfileAvatar({
  name,
  profession,
  avatarUrl,
  onFileChange,
  uploading = false,
}: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const MAX_SIZE_MB = 5;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setSizeError(`La foto debe ser menor a ${MAX_SIZE_MB} MB.`);
      e.target.value = '';
      return;
    }

    setSizeError(null);
    onFileChange(file);
  }

  return (
    <div className="relative flex flex-col bg-src-0f111a border border-white/5 rounded-[12px] overflow-hidden">
      <div className="absolute w-full h-full bg-white/1 pointer-events-none rounded-[12px]" />

      <div className="relative p-8 flex flex-col items-center gap-6">
        <div
          className="relative cursor-pointer group"
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-32 h-32 rounded-2xl bg-src-000000 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                role="img"
                aria-label={`Foto de perfil de ${name}`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-src-a3a6ff to-src-a28efc flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="24" r="14" fill="white" opacity="0.3" />
                  <path
                    d="M8 58c0-13.3 10.7-24 24-24s24 10.7 24 24"
                    fill="white"
                    opacity="0.2"
                  />
                </svg>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={uploading}
            className={`
              absolute -bottom-2 -right-2 w-10 h-10 rounded-[12px]
              flex items-center justify-center 
              shadow-lg border border-white/5 transition-colors
              ${
                uploading
                  ? 'bg-src-8a4cfc/40 cursor-not-allowed'
                  : 'bg-src-8a4cfc hover:bg-src-9b5ffd cursor-pointer'
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            aria-label="Cambiar foto de perfil"
          >
            <svg
              width="15"
              height="13"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        <div className="text-center">
          <h3 className="text-src-e5e7f6 font-bold text-xl">{name}</h3>
          <p className="text-src-a7aab9 text-sm mt-1 leading-snug line-clamp-2">
            {profession || 'Sin profesión'}
          </p>
          {sizeError && (
            <p className="mt-2 text-xs text-red-400 font-medium">
              ⚠ {sizeError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
