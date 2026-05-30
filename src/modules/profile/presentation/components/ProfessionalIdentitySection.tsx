import type { UpdateUserProfileDTO } from '../../domain/userProfile.entity';

const BIO_MAX = 500;

const inputClass = `
  w-full bg-[#2D3449] border border-transparent rounded-[12px] px-4 py-3
  text-white text-sm placeholder-src-727582
  focus:outline-none focus:border-transparent focus:ring-0
  transition-colors
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-[#171B28] border border-white/5 rounded-[16px] overflow-hidden">
        <div className="px-8 py-8 border-b border-white/5">
          <h2 className="text-src-dae2fd font-bold text-3xl">
            Perfil Profesional
          </h2>
          <p className="text-src-6b7280 text-sm mt-1">
            Define cómo te presentas en tus portafolios por defecto.
          </p>
        </div>

        <div className="px-8 py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">Profesion</label>
            <input
              type="text"
              value={form.profession ?? ''}
              onChange={(e) => onFieldChange('profession', e.target.value)}
              placeholder="Ej: Diseñador UX Senior"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-0.5">
              <label className="text-white text-sm">Descripción profesional</label>
              <span
                className={`text-xs font-normal ${
                  bioLen > BIO_MAX ? 'text-red-400' : 'text-src-a7aab9'
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
              className="
                w-full bg-[#2D3449] border border-transparent rounded-[12px] px-4 py-3
                text-white text-sm placeholder-src-727582 resize-none
                focus:outline-none focus:border-transparent focus:ring-0
                transition-colors font-normal
              "
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 bg-src-7c6bec/5 border border-src-7c6bec/15 border-dashed rounded-[16px] px-6 py-5">
        <div className="w-8 h-8 rounded-[8px] bg-src-7c6bec/15 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-src-9fa2ff">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 8h5M7 12h8M7 16h4" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-src-b0a8f5 font-semibold text-sm">Perfiles Profesionales</span>
            <span className="text-[10px] bg-src-7c6bec/20 text-src-b0a8f5 px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
              Próximamente
            </span>
          </div>
          <p className="text-src-6b7280 text-xs leading-relaxed">
            Podrás crear múltiples perfiles con titular, descripción, foto y redes distintas,
            y asignar uno diferente a cada portafolio.
          </p>
        </div>
      </div>
    </div>
  );
}
