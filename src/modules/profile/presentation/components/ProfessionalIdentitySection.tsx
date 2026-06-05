import type { UpdateUserProfileDTO } from '../../domain/userProfile.entity';

const BIO_MAX = 500;

const inputClass = `
  w-full bg-[#0d1117] border border-white/10 rounded-2xl px-5 py-4
  text-white text-sm placeholder-[#6b7280]
  focus:outline-none focus:ring-2 focus:ring-[#6b72ff]/40
  transition-all
`;

interface ProfessionalIdentitySectionProps {
  form: UpdateUserProfileDTO;
  onFieldChange: <K extends keyof UpdateUserProfileDTO>(
    key: K,
    value: UpdateUserProfileDTO[K]
  ) => void;
}

export default function ProfessionalIdentitySection({
  form,
  onFieldChange,
}: ProfessionalIdentitySectionProps) {
  const bioLen = (form.bio ?? '').length;

  return (
    <section className="space-y-6 p-6 rounded-2xl">
      <header>
        <h2 className="text-white text-3xl font-bold tracking-tight">
          Perfil profesional
        </h2>
        <p className="text-[#9ca3af] text-sm mt-1">
          Define cómo te presentas en tus portafolios por defecto.
        </p>
      </header>

      <div className="bg-[#1a1a2e]/40 rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
            Profesión
          </label>
          <input
            type="text"
            value={form.profession ?? ''}
            onChange={(e) => onFieldChange('profession', e.target.value)}
            placeholder="Ej: Diseñador UX Senior"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest">
              Descripción profesional
            </label>
            <span
              className={`text-xs ${
                bioLen > BIO_MAX ? 'text-red-400' : 'text-[#6b7280]'
              }`}
            >
              {bioLen} / {BIO_MAX}
            </span>
          </div>
          <textarea
            value={form.bio ?? ''}
            onChange={(e) => onFieldChange('bio', e.target.value)}
            maxLength={BIO_MAX}
            rows={4}
            placeholder="Cuéntanos sobre ti..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </section>
  );
}
