import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../../shared/components/Input';
import { useRegisterForm } from '../../application/useRegisterForm';
import { PROFESIONES } from '../constants/register.constants';

interface RegisterFormProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

/* ── OTP Input ─────────────────────────────────────────────────── */
function OtpInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const r0 = useRef<HTMLInputElement>(null);
  const r1 = useRef<HTMLInputElement>(null);
  const r2 = useRef<HTMLInputElement>(null);
  const r3 = useRef<HTMLInputElement>(null);
  const r4 = useRef<HTMLInputElement>(null);
  const r5 = useRef<HTMLInputElement>(null);
  const refs = [r0, r1, r2, r3, r4, r5];

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const next = [...value];
      if (next[i]) {
        next[i] = '';
        onChange(next);
      } else if (i > 0) {
        refs[i - 1].current?.focus();
      }
    }
  };

  const handleInput = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = char;
    onChange(next);
    if (char && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = new Array(6).fill('') as string[];
    pasted.split('').forEach((c, i) => { next[i] = c; });
    onChange(next);
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex justify-center gap-3 my-2">
      {refs.map((ref, i) => (
        <input
          key={`otp-${i}`}
          ref={ref}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i]}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-10 h-12 text-center text-xl font-bold border-b-2 border-gray-300 focus:border-src-6c63ff outline-none bg-transparent text-gray-800 transition-colors"
        />
      ))}
    </div>
  );
}

/* ── Countdown ─────────────────────────────────────────────────── */
function Countdown({ onResend }: { onResend: () => void }) {
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <p className="text-gray-500 text-sm text-center mt-3">
      ¿No recibiste el código?{' '}
      {seconds > 0 ? (
        <span className="text-src-6c63ff font-medium">
          Reenviar en 00:{pad(seconds)}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => { onResend(); setSeconds(59); }}
          className="text-src-6c63ff font-medium hover:underline"
        >
          Reenviar
        </button>
      )}
    </p>
  );
}

/* ── Main Form ─────────────────────────────────────────────────── */
export const RegisterForm = ({ step, setStep }: RegisterFormProps) => {
  const {
    fields,
    errors,
    codeError,
    loading,
    toast,
    handleChange,
    submitStep1,
    submitStep2,
    submitStep3,
  } = useRegisterForm();

  const [otpDigits, setOtpDigits] = useState<string[]>(new Array(6).fill('') as string[]);

  const goStep1 = async (e: React.MouseEvent) => {
    e.preventDefault();
    const ok = await submitStep1();
    if (ok) setStep(2);
  };

  const goStep2 = async (e: React.MouseEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    const ok = await submitStep2(code);
    if (ok) setStep(3);
  };

  const goStep3 = async (e: React.MouseEvent) => {
    e.preventDefault();
    await submitStep3();
  };

  const handleResend = async () => {
    await submitStep1();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="w-[85%] sm:w-full max-w-[25rem] mx-auto px-5 sm:px-9 py-6 bg-white rounded-[35px] relative">
        {toast && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] text-center text-sm px-4 py-2 rounded-lg text-white shadow-lg z-50
              ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {toast.message}
          </div>
        )}

        {/* ── Paso 1: Email ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="pb-3 text-center">
              <h1 className="font-bold text-3xl pb-1">Crea tu cuenta</h1>
              <p className="text-gray-500 font-thin text-[12px] tracking-tight">
                Regístrate en el sistema, mediante el siguiente formulario.
              </p>
            </div>
            <form noValidate className="p-4 pt-0">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="nombre@dominio.com"
                value={fields.email}
                onChange={handleChange('email')}
                error={errors.email}
              />
              <p className="text-gray-400 text-xs mt-1 mb-4 leading-snug">
                Se te enviará un código de verificación el cual debe ser llenado en el próximo paso.
              </p>
              <button
                onClick={goStep1}
                disabled={loading}
                className="w-full py-2 rounded-lg text-sm text-white font-light bg-src-8781fa hover:bg-src-6960ec transition-colors disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Siguiente'}
              </button>
              <div className="text-center mt-3">
                <span className="text-gray-500 text-sm">¿Ya tienes cuenta? </span>
                <Link to="/login" className="text-src-6c63ff font-medium text-sm hover:underline">
                  Iniciar Sesión
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* ── Paso 2: Verificar Código ─────────────────────────── */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="pb-3 text-center">
              <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                  fill="none" stroke="#8781fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
              </div>
              <h1 className="font-bold text-2xl pb-1">Verificar Código</h1>
              <p className="text-gray-500 font-thin text-[12px]">
                Ingresa el código de 6 dígitos que enviamos a tu correo
              </p>
            </div>
            <form noValidate className="p-4 pt-0">
              <OtpInput value={otpDigits} onChange={setOtpDigits} />
              {codeError && (
                <p className="text-red-500 text-xs text-center mt-1">{codeError}</p>
              )}
              <button
                onClick={goStep2}
                disabled={loading}
                className="mt-5 w-full py-2 rounded-lg text-sm text-white font-light bg-src-8781fa hover:bg-src-6960ec transition-colors disabled:opacity-60"
              >
                {loading ? 'Verificando...' : 'VERIFICAR'}
              </button>
              <Countdown onResend={handleResend} />
            </form>
          </div>
        )}

        {/* ── Paso 3: Datos personales ─────────────────────────── */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="pb-3 text-center">
              <h1 className="font-bold text-3xl pb-1">Crea tu cuenta</h1>
              <p className="text-gray-500 font-thin text-[12px] tracking-tight">
                Regístrate en el sistema, mediante el siguiente formulario.
              </p>
            </div>
            <form noValidate className="p-4 pt-0">
              <Input
                label="Nombre/s"
                type="text"
                placeholder="Nombre/s"
                value={fields.nombre}
                onChange={handleChange('nombre')}
                error={errors.nombre}
              />
              <Input
                label="Apellidos"
                type="text"
                placeholder="Apellidos"
                value={fields.apellido}
                onChange={handleChange('apellido')}
                error={errors.apellido}
              />
              <Input
                label="Contraseña"
                type="password"
                value={fields.password}
                onChange={handleChange('password')}
                error={errors.password}
              />
              <Input
                label="Confirmar Contraseña"
                type="password"
                value={fields.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
              />
              <Input
                label="Profesión"
                select={true}
                placeholder="Selecciona tu profesión"
                options={PROFESIONES}
                value={fields.profesion}
                onChange={handleChange('profesion')}
                error={errors.profesion}
              />
              <Input
                label="Biografía"
                textArea={true}
                placeholder="Cuéntanos un poco sobre ti..."
                value={fields.biografia}
                onChange={handleChange('biografia')}
                error={errors.biografia}
              />
              <p className="text-right text-gray-400 text-[10px] -mt-2 mb-2">
                Máx. 500 caracteres
              </p>
              <button
                onClick={goStep3}
                disabled={loading}
                className="w-full py-2 rounded-lg text-sm text-white font-light bg-src-8781fa hover:bg-src-6960ec transition-colors disabled:opacity-60"
              >
                {loading ? 'Registrando...' : 'Finalizar registro'}
              </button>
              <div className="text-center mt-3">
                <span className="text-gray-500 text-sm">¿Ya tienes cuenta? </span>
                <Link to="/login" className="text-src-6c63ff font-medium text-sm hover:underline">
                  Iniciar Sesión
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
