import Toggle from '../../../../shared/components/Toggle';
import type { UserProfileEntity } from '../../domain/userProfile.entity';

interface VisibilityTogglesProps {
  visibility: UserProfileEntity['visibility'];
  onChange: (key: keyof UserProfileEntity['visibility'], value: boolean) => void;
}

const items: { key: keyof UserProfileEntity['visibility']; label: string }[] = [
  { key: 'showEmail',      label: 'Mostrar Correo' },
  { key: 'showProfession', label: 'Mostrar Profesión' },
  { key: 'showBio',        label: 'Mostrar Biografía' },
];

export default function VisibilityToggles({ visibility, onChange }: VisibilityTogglesProps) {
  return (
    <div className="bg-[#141824] rounded-2xl p-5 border border-white/5">
      <p className="text-[#9ca3af] text-xs font-semibold tracking-widest uppercase mb-4">
        Visibilidad rápida
      </p>
      <div className="flex flex-col gap-3">
        {items.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[#9ca3af] text-sm">{label}</span>
            <Toggle
              checked={visibility[key]}
              onChange={(val) => onChange(key, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
