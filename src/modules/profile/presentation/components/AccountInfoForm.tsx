import type {
  UpdateUserProfileDTO,
  UserProfileEntity,
} from '../../domain/userProfile.entity';

const PHONE_CODES = [
  { code: '+591', label: '+591 Bolivia' },
  { code: '+54',  label: '+54 Argentina' },
  { code: '+56',  label: '+56 Chile' },
  { code: '+57',  label: '+57 Colombia' },
  { code: '+52',  label: '+52 México' },
  { code: '+51',  label: '+51 Perú' },
  { code: '+55',  label: '+55 Brasil' },
  { code: '+593', label: '+593 Ecuador' },
  { code: '+595', label: '+595 Paraguay' },
  { code: '+598', label: '+598 Uruguay' },
  { code: '+58',  label: '+58 Venezuela' },
  { code: '+507', label: '+507 Panamá' },
  { code: '+503', label: '+503 El Salvador' },
  { code: '+502', label: '+502 Guatemala' },
  { code: '+504', label: '+504 Honduras' },
  { code: '+505', label: '+505 Nicaragua' },
  { code: '+506', label: '+506 Costa Rica' },
  { code: '+53',  label: '+53 Cuba' },
  { code: '+1',   label: '+1 EE.UU. / Canadá' },
  { code: '+34',  label: '+34 España' },
  { code: '+44',  label: '+44 Reino Unido' },
  { code: '+33',  label: '+33 Francia' },
  { code: '+49',  label: '+49 Alemania' },
  { code: '+39',  label: '+39 Italia' },
  { code: '+351', label: '+351 Portugal' },
  { code: '+7',   label: '+7 Rusia' },
  { code: '+81',  label: '+81 Japón' },
  { code: '+86',  label: '+86 China' },
  { code: '+91',  label: '+91 India' },
  { code: '+61',  label: '+61 Australia' },
];

const NATIONALITIES = [
  'Bolivia', 'Argentina', 'Chile', 'Colombia', 'México', 'Perú', 'Brasil',
  'Ecuador', 'Paraguay', 'Uruguay', 'Venezuela', 'Panamá', 'El Salvador',
  'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica', 'Cuba',
  'República Dominicana', 'Puerto Rico', 'España', 'Estados Unidos',
  'Canadá', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal',
  'Japón', 'China', 'India', 'Rusia', 'Australia', 'Sudáfrica', 'Otra',
];

const inputClass = `
  w-full bg-[#2D3449] border border-transparent rounded-[12px] px-4 py-3
  text-white text-sm placeholder-src-727582
  focus:outline-none focus:border-transparent focus:ring-0
  transition-colors
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const selectClass = `
  w-full bg-[#2D3449] border border-transparent rounded-[12px] px-4 py-3
  text-white text-sm
  focus:outline-none focus:border-transparent focus:ring-0
  transition-colors appearance-none cursor-pointer
`;

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

function Field({ label, value, onChange, type = 'text', placeholder, disabled }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
      />
    </div>
  );
}

interface AccountInfoFormProps {
  form: UpdateUserProfileDTO;
  profile: UserProfileEntity;
  onFieldChange: <K extends keyof UpdateUserProfileDTO>(
    key: K,
    value: UpdateUserProfileDTO[K]
  ) => void;
}

export default function AccountInfoForm({ form, profile, onFieldChange }: AccountInfoFormProps) {
  return (
    <div className="flex flex-col bg-[#171B28] border border-white/5 rounded-[16px] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-8 border-b border-white/5">
        <h2 className="text-src-dae2fd font-bold text-3xl">
          Información de Cuenta
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

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Número de teléfono</label>
          <div className="flex gap-2">
            <div className="relative w-44 shrink-0">
              <select
                value={form.phoneCode ?? '+591'}
                onChange={(e) => onFieldChange('phoneCode', e.target.value)}
                className={selectClass}
                style={{ backgroundImage: 'none' }}
              >
                {PHONE_CODES.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-src-a7aab9"
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <input
              type="tel"
              value={form.phone ?? ''}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="70000000"
              className={`${inputClass} flex-1`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Nacionalidad</label>
          <div className="relative">
            <select
              value={form.nationality ?? ''}
              onChange={(e) => onFieldChange('nationality', e.target.value)}
              className={selectClass}
              style={{ backgroundImage: 'none' }}
            >
              <option value="">Selecciona tu país</option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-src-a7aab9"
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
