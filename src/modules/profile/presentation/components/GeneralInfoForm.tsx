import type {
  UpdateUserProfileDTO,
  UserProfileEntity,
} from '../../domain/userProfile.entity';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-src-a7aab9 text-xs font-semibold tracking-[1.2px] uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full bg-src-000000 border border-white/8 rounded-[12px] px-4 py-3
          text-white text-sm placeholder-src-727582
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
    <div className="flex flex-col bg-src-091328 border border-white/5 rounded-[16px] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-8 border-b border-white/5">
        <h2 className="text-src-e5e7f6 font-bold text-xl">
          Información General
        </h2>
      </div>

      <div className="px-8 py-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Field
            label="Nombre"
            value={form.firstName ?? ''}
            onChange={(v) => onFieldChange('firstName', v)}
          />

          <Field
            label="Apellido"
            value={form.lastName ?? ''}
            onChange={(v) => onFieldChange('lastName', v)}
          />
        </div>

        <Field
          label="Correo electrónico"
          value={profile.email}
          onChange={() => {}}
          type="email"
          disabled={true}
        />

        <Field
          label="Profesión"
          value={form.profession ?? ''}
          onChange={(v) => onFieldChange('profession', v)}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <label className="text-src-a7aab9 text-xs font-semibold tracking-[1.2px] uppercase">
              Biografía
            </label>
            <span
              className={`text-xs font-normal ${bioLen > BIO_MAX ? 'text-red-400' : 'text-src-a7aab9'}`}
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
              w-full bg-src-000000 border border-white/8 rounded-[12px] px-4 py-3
              text-white text-sm placeholder-src-727582 resize-none
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
