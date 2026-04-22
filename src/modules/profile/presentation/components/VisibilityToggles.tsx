import Toggle from '../../../../shared/components/Toggle';
import type { UserProfileEntity } from '../../domain/userProfile.entity';

interface VisibilityTogglesProps {
  visibility: UserProfileEntity['visibility'];
  onChange: (
    key: keyof UserProfileEntity['visibility'],
    value: boolean
  ) => void;
}

const items: { key: keyof UserProfileEntity['visibility']; label: string }[] = [
  { key: 'showInstagram',  label: 'Mostrar links de Instagram' },
  { key: 'showFacebook',   label: 'Mostrar links de Facebook' },
  { key: 'showYoutube',    label: 'Mostrar links de YouTube' },
  { key: 'showEmail',      label: 'Mostrar Correo electrónico' },
  { key: 'showProfession', label: 'Mostrar Profesión' },
  { key: 'showBio',        label: 'Mostrar Descripción profesional' },
  { key: 'showTechSkills', label: 'Mostrar habilidades técnicas' },
  { key: 'showSoftSkills', label: 'Mostrar habilidades blandas' },
  { key: 'showExperience', label: 'Mostrar trayectoria profesional' },
  { key: 'showEducation',  label: 'Mostrar formación académica' },
];

export default function VisibilityToggles({
  visibility,
  onChange,
}: VisibilityTogglesProps) {
  return (
    <div className="flex flex-col bg-[#171B28] border border-white/5 rounded-[12px] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <p className="text-src-a7aab9 text-xs font-semibold tracking-[1.2px]">
          Visibilidad rápida
        </p>
      </div>

      <div className="px-6 py-4 flex flex-col gap-4">
        {items.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-src-e5e7f6 text-sm font-normal">{label}</span>
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
