import { useState } from 'react';
import { Input } from '../../../../shared/components/Input';
import { forgotPassword } from '../../infrastructure/authService';
import { useNavigate, Link } from 'react-router-dom';

const ResetIcon = () => (
  <div className="w-14 h-14 bg-[#EEF2FF] rounded-full flex items-center justify-center mb-6">
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#6C63FF]">
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

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 ml-2">
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mr-2">
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

    setError(null);
    setIsLoading(true);

    try {
      await forgotPassword(email);

      navigate('/verify-code', { state: { email: email } });
    } catch (err: any) {
      console.error('Error al solicitar recuperación:', err);
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-10 py-10 bg-white rounded-[35px] relative shadow-lg flex flex-col items-center">
      <ResetIcon />

      <div className="pb-6 text-center">
        <h1 className="font-bold text-3xl leading-tight">
          Recuperar
          <br />
          contraseña
        </h1>
        <h2 className="text-gray-500 font-normal text-[13px] mt-4 px-2">
          Ingresa tu correo para recibir un enlace de recuperación
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
          className={`mt-8 w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center transition-colors text-[14px] ${isLoading ? 'bg-[#5a52d5] cursor-wait' : 'bg-[#6C63FF] hover:bg-[#5a52d5]'}`}
        >
          {isLoading ? 'Enviando...' : 'Enviar enlace'}
          {!isLoading && <ArrowRightIcon />}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-8 text-[#3B3066] font-semibold text-[13px] flex items-center cursor-pointer hover:underline"
      >
        <ArrowLeftIcon />
        Volver al inicio
      </Link>
    </div>
  );
};
