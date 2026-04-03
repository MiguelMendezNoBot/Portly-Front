import type { UpdateUserProfileDTO, UserProfileEntity } from '../../domain/userProfile.entity';

// Ícono de ojo
function EyeIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className={className}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
}

function Field({ label, value, onChange, type = 'text', placeholder, showVisibility, visible }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[#6b7280] text-xs font-semibold tracking-widest uppercase">
          {label}
        </label>
        {showVisibility !== undefined && (
          <button type="button" className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
            {visible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-[#0d1117] border border-white/8 rounded-xl px-4 py-2.5
          text-white text-sm placeholder-[#4b5563]
          focus:outline-none focus:border-[#7c6bec]/60 focus:ring-1 focus:ring-[#7c6bec]/30
          transition-colors
        "
      />
    </div>
  );
}

interface GeneralInfoFormProps {
  form: UpdateUserProfileDTO;
  profile: UserProfileEntity;
  onFieldChange: <K extends keyof UpdateUserProfileDTO>(key: K, value: UpdateUserProfileDTO[K]) => void;
}

const BIO_MAX = 500;

export default function GeneralInfoForm({ form, profile, onFieldChange }: GeneralInfoFormProps) {
  const bioLen = (form.bio ?? '').length;

  return (
    <div className="bg-[#141824] rounded-2xl p-6 border border-white/5 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-base">Información General</h2>
        <button type="button" className="text-[#6b7280] hover:text-[#9ca3af] transition-colors">
          <EditIcon />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 min-w-0">
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
      <div className="mt-4">
        <Field
          label="Correo electrónico"
          value={profile.email}
          onChange={() => {/* email no editable desde aquí */}}
          type="email"
          showVisibility
          visible={profile.visibility.showEmail}
        />
      </div>

      {/* Profesión */}
      <div className="mt-4">
        <Field
          label="Profesión"
          value={form.profession ?? ''}
          onChange={(v) => onFieldChange('profession', v)}
          showVisibility
          visible={profile.visibility.showProfession}
        />
      </div>

      {/* Biografía */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[#6b7280] text-xs font-semibold tracking-widest uppercase">
            Biografía (máx {BIO_MAX})
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${bioLen > BIO_MAX ? 'text-red-400' : 'text-[#6b7280]'}`}>
              {bioLen} / {BIO_MAX}
            </span>
            <button type="button" className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
              <EyeIcon />
            </button>
          </div>
        </div>
        <textarea
          value={form.bio ?? ''}
          onChange={(e) => onFieldChange('bio', e.target.value)}
          maxLength={BIO_MAX}
          rows={4}
          className="
            w-full bg-[#0d1117] border border-white/8 rounded-xl px-4 py-2.5
            text-white text-sm placeholder-[#4b5563] resize-none
            focus:outline-none focus:border-[#7c6bec]/60 focus:ring-1 focus:ring-[#7c6bec]/30
            transition-colors
          "
        />
      </div>
    </div>
  );
}
