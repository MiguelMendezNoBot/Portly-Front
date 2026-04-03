import type {
  UpdateUserProfileDTO,
  UserProfileEntity,
} from '../../domain/userProfile.entity';

// Ícono de ojo
function EyeIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="18"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  showVisibility?: boolean;
  visible?: boolean;
  disabled?: boolean;
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  showVisibility,
  visible,
  disabled,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[#a7aab9] text-xs font-semibold tracking-[1.2px] uppercase">
          {label}
        </label>
        {showVisibility !== undefined && (
          <button
            type="button"
            className="text-[#727582] hover:text-[#a7aab9] transition-colors"
            disabled={disabled}
          >
            {visible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full bg-[#000000] border border-white/8 rounded-[12px] px-4 py-3
          text-white text-sm placeholder-[#727582]
          focus:outline-none focus:border-white/16 focus:ring-0
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
    </div>
  );
}

interface GeneralInfoFormProps {
  form: UpdateUserProfileDTO;
  profile: UserProfileEntity;
  onFieldChange: <K extends keyof UpdateUserProfileDTO>(
    key: K,
    value: UpdateUserProfileDTO[K]
  ) => void;
}

const BIO_MAX = 500;

export default function GeneralInfoForm({
  form,
  profile,
  onFieldChange,
}: GeneralInfoFormProps) {
  const bioLen = (form.bio ?? '').length;

  return (
    <div className="flex flex-col bg-[#091328] border border-white/5 rounded-[16px] overflow-hidden">
      {/* Header with border bottom */}
      <div className="flex items-center justify-between px-8 py-8 border-b border-white/5">
        <h2 className="text-[#e5e7f6] font-bold text-xl">
          Información General
        </h2>
        <button
          type="button"
          className="text-[#a7aab9] hover:text-[#e5e7f6] transition-colors"
        >
          <EditIcon />
        </button>
      </div>

      {/* Content */}
      <div className="px-8 py-8 flex flex-col gap-6">
        {/* Name & Last Name row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Nombre */}
          <Field
            label="Nombre"
            value={form.firstName ?? ''}
            onChange={(v) => onFieldChange('firstName', v)}
            showVisibility
            visible={profile.visibility.showEmail}
          />

          {/* Apellido */}
          <Field
            label="Apellido"
            value={form.lastName ?? ''}
            onChange={(v) => onFieldChange('lastName', v)}
            showVisibility
            visible={profile.visibility.showEmail}
          />
        </div>

        {/* Correo (fila completa) */}
        <Field
          label="Correo electrónico"
          value={profile.email}
          onChange={() => {
            /* email no editable desde aquí */
          }}
          type="email"
          showVisibility
          visible={profile.visibility.showEmail}
          disabled={true}
        />

        {/* Profesión */}
        <Field
          label="Profesión"
          value={form.profession ?? ''}
          onChange={(v) => onFieldChange('profession', v)}
          showVisibility
          visible={profile.visibility.showProfession}
        />

        {/* Biografía */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <label className="text-[#a7aab9] text-xs font-semibold tracking-[1.2px] uppercase">
              Biografía (máx {BIO_MAX})
            </label>
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-normal ${bioLen > BIO_MAX ? 'text-red-400' : 'text-[#a7aab9]'}`}
              >
                {bioLen} / {BIO_MAX}
              </span>
              <button
                type="button"
                className="text-[#727582] hover:text-[#a7aab9] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M3 8C3 5.24 5 3 8 3s5 2.24 5 5-2 5-5 5-5-2.24-5-5z" />
                </svg>
              </button>
            </div>
          </div>
          <textarea
            value={form.bio ?? ''}
            onChange={(e) => onFieldChange('bio', e.target.value)}
            maxLength={BIO_MAX}
            rows={4}
            placeholder="Cuéntanos sobre ti..."
            className="
              w-full bg-[#000000] border border-white/8 rounded-[12px] px-4 py-3
              text-white text-sm placeholder-[#727582] resize-none
              focus:outline-none focus:border-white/16 focus:ring-0
              transition-colors
              font-normal
            "
          />
        </div>
      </div>
    </div>
  );
}
