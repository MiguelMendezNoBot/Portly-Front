import { useRef } from 'react';

interface ProfileAvatarProps {
  name: string;
  profession: string;
  avatarUrl?: string;
  onFileChange: (file: File) => void;
}

export default function ProfileAvatar({
  name,
  profession,
  avatarUrl,
  onFileChange,
}: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  }

  return (
    <div className="flex flex-col bg-[#091328] border border-white/5 rounded-[12px] overflow-hidden">
      {/* Background shadow layer */}
      <div className="absolute w-full h-full bg-white/1 pointer-events-none rounded-[12px]" />

      {/* Content */}
      <div className="relative p-8 flex flex-col items-center gap-6">
        {/* Avatar clickeable */}
        <div
          className="relative cursor-pointer group"
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-32 h-32 rounded-2xl bg-[#000000] border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
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
              /* Avatar placeholder SVG */
              <div className="w-full h-full bg-gradient-to-br from-[#a3a6ff] to-[#a28efc] flex items-center justify-center">
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
          </div>

          {/* Botón de cámara */}
          <button
            type="button"
            className="
              absolute -bottom-2 -right-2 w-10 h-10 rounded-[12px]
              bg-[#8a4cfc] flex items-center justify-center 
              shadow-lg hover:bg-[#9b5ffd] transition-colors
              border border-white/5
            "
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

        {/* Nombre y profesión */}
        <div className="text-center">
          <h3 className="text-[#e5e7f6] font-bold text-xl">{name}</h3>
          <p className="text-[#a7aab9] text-sm mt-1 leading-snug line-clamp-2">
            {profession || 'Sin profesión'}
          </p>
        </div>
      </div>
    </div>
  );
}
