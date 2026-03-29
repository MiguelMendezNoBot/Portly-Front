import { useState } from 'react';
import { Input } from '../../../components/Input';

// Icono circular del candado
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

// Icono de la flecha pequeña en el botón
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

// Icono de volver al inicio
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando correo de recuperación a:', email);
    // Aquí iría la llamada al backend: sendRecoveryEmail(email)
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
        <div className="mt-2">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full py-3 rounded-2xl text-white font-semibold bg-[#6C63FF] hover:bg-[#5a52d5] transition-colors text-[14px] flex items-center justify-center"
        >
          Enviar enlace
          <ArrowRightIcon />
        </button>
      </form>

      {/* Enlace para volver (Idealmente esto usará <Link to="/login"> de react-router-dom) */}
      <a
        href="/login"
        className="mt-8 text-[#3B3066] font-semibold text-[13px] flex items-center cursor-pointer hover:underline"
      >
        <ArrowLeftIcon />
        Volver al inicio
      </a>
    </div>
  );
};
