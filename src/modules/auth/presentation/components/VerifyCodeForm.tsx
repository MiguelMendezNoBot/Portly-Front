import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyCode, forgotPassword } from '../../infrastructure/authService';

const CodeIcon = () => (
  <div className="w-16 h-16 bg-src-eef2ff rounded-full flex items-center justify-center mb-6 shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-src-6c63ff">
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

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const VerifyCodeForm = () => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(6).fill(null)
  );

  const [secondsLeft, setSecondsLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setError(null);

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d{6}$/.test(pastedData)) return;

    setError(null);
    setCode(pastedData.split(''));
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length < 6) {
      setError('Por favor, ingresa el código de 6 dígitos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyCode(email, fullCode);

      navigate('/reset-password', {
        state: { email: email, codigo: fullCode },
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Código inválido. Intenta nuevamente.'
      );
      setCode(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setError(null);
    setCanResend(false);

    try {
      await forgotPassword(email);
      setSecondsLeft(59);
    } catch (_err: unknown) {
      setError('No se pudo reenviar el código. Intenta de nuevo.');
      setCanResend(true);
    }
  };

  return (
    <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-10 py-10 bg-white rounded-[35px] relative shadow-lg flex flex-col items-center">
      <CodeIcon />

      <div className="pb-6 text-center">
        <h1 className="font-bold text-3xl leading-tight">Verificar Código</h1>
        <h2 className="text-gray-500 font-normal text-[13px] mt-4 px-2">
          Ingresa el código de 6 dígitos que enviamos a
          <br />
          <span className="font-bold text-gray-800">{email}</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="flex justify-center gap-2 sm:gap-3 mb-2"
          onPaste={handlePaste}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-10 h-12 sm:w-12 sm:h-12 border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-center text-xl sm:text-2xl font-bold text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`}
            />
          ))}
        </div>

        <div className="h-6 mb-4 text-center">
          {error && (
            <span className="text-red-500 text-[12px] font-medium">
              {error}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center transition-colors text-[14px] tracking-wide ${isLoading ? 'bg-src-5a52d5 cursor-wait' : 'bg-src-6c63ff hover:bg-src-5a52d5'}`}
        >
          {isLoading ? 'VERIFICANDO...' : 'VERIFICAR'}
        </button>
      </form>

      <div className="mt-8 text-center text-[13px] text-gray-500">
        ¿No recibiste el código?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className={`font-semibold transition-colors ${canResend ? 'text-src-6c63ff hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
        >
          Reenviar {canResend ? '' : `en ${formatTime(secondsLeft)}`}
        </button>
      </div>
    </div>
  );
};
