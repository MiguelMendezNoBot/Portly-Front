import { useState } from 'react';
import { Input } from '../../../../shared/components/Input';
import { forgotPassword } from '../../infrastructure/authService';
import { useNavigate } from 'react-router-dom';

const ResetIcon = () => (
  <div className="w-14 h-14 bg-src-eef2ff rounded-full flex items-center justify-center mb-6">
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-src-6c63ff">
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525M12 22H3L4.99999 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16V14C12 12.8954 11.1046 12 10 12C8.89543 12 8 12.8954 8 14V16M12 16H8M12 16C12 16.5523 11.5523 17 11 17H9C8.44772 17 8 16.5523 8 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('El correo ingresado no tiene un formato válido.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Intentamos enviar el código; si el correo no está registrado,
      // el backend no lo enviará pero igualmente avanzamos a verify-code
      // para no revelar qué correos están registrados.
      await forgotPassword(email.trim());
    } catch (_err) {
      // Silenciamos el error intencionalmente: el usuario siempre avanza.
    } finally {
      setIsLoading(false);
    }

    navigate('/verify-code', { state: { email: email.trim() } });
  };

  return (
    <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-10 py-10 bg-white rounded-[35px] relative shadow-lg flex flex-col items-center">
      <ResetIcon />

      <div className="pb-6 text-center">
        <h1 className="font-bold text-3xl leading-tight">
          Recuperar
          <br />
          cuenta
        </h1>
        <h2 className="text-gray-500 font-normal text-[13px] mt-4 px-2">
          Ingresa tu correo para recibir un código de recuperación de tu cuenta
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full">
        <div className="mt-2 flex flex-col gap-1">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            error={error || undefined}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-8 w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center transition-colors text-[14px] ${isLoading ? 'bg-src-5a52d5 cursor-wait' : 'bg-src-6c63ff hover:bg-src-5a52d5'}`}
        >
          {isLoading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
        </button>
      </form>
    </div>
  );
};
