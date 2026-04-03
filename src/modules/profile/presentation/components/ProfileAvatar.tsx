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

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  }

  return (
    <div className="bg-[#141824] rounded-2xl p-6 flex flex-col items-center gap-3 border border-white/5">
      {/* Avatar clickeable */}
      <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
        <div className="w-28 h-28 rounded-2xl bg-[#7c6bec]/20 border border-[#7c6bec]/30 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            /* Avatar placeholder SVG */
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="24" r="14" fill="#7c6bec" opacity="0.6" />
              <path d="M8 58c0-13.3 10.7-24 24-24s24 10.7 24 24" fill="#7c6bec" opacity="0.4" />
            </svg>
          )}
        </div>
        {/* Botón de cámara */}
        <button
          type="button"
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#7c6bec] flex items-center justify-center shadow-lg hover:bg-[#6a5ad4] transition-colors"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
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
        <p className="text-white font-semibold text-base">{name}</p>
        <p className="text-[#6b7280] text-sm mt-0.5 leading-snug">{profession}</p>
      </div>
    </div>
  );
}
