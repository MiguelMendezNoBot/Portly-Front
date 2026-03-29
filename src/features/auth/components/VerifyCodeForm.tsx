import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Icono circular de verificación (similar al estilo de candado de image_14.png)
const CodeIcon = () => (
  <div className="w-16 h-16 bg-[#EEF2FF] rounded-full flex items-center justify-center mb-6 shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#6C63FF]">
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

// Función auxiliar para formatear segundos a MM:SS
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const VerifyCodeForm = () => {
  // Estado para los 6 dígitos del código
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  // Referencias a los inputs para manejar el foco automáticamente
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(6).fill(null)
  );
  // Estado del temporizador
  const [secondsLeft, setSecondsLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  //const navigate = useNavigate();

  // Lógica del temporizador de cuenta regresiva
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

  // Manejar el cambio de texto en un input individual
  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Saltar automáticamente al siguiente input si se escribe un dígito
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Manejar la pulsación de teclas (Backspace)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Volver automáticamente al input anterior si se presiona Backspace en un campo vacío
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Manejar el pegado de código (Paste)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d{6}$/.test(pastedData)) return; // Asegurar que sean 6 dígitos numéricos

    const newCode = pastedData.split('');
    setCode(newCode);
    // Poner el foco en el último input
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    console.log('Verificando código:', fullCode);
    // Aquí iría la llamada al backend para verificar el código
    // navigate('/reset-password'); // Ejemplo de redirección a la siguiente pantalla
  };

  const handleResend = () => {
    console.log('Reenviando código...');
    setSecondsLeft(59); // Reiniciar temporizador
    setCanResend(false);
    // Aquí iría la llamada al backend para reenviar el código
  };

  return (
    <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-10 py-10 bg-white rounded-[35px] relative shadow-lg flex flex-col items-center">
      <CodeIcon />

      <div className="pb-8 text-center">
        {/* Tipografía grande y negrita */}
        <h1 className="font-bold text-3xl leading-tight">Verificar Código</h1>
        {/* Tipografía pequeña y gris */}
        <h2 className="text-gray-500 font-normal text-[13px] mt-4 px-2">
          Ingresa el código de 6 dígitos que enviamos a tu correo
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {/* Contenedor de los 6 inputs de código */}
        <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1} // Solo un carácter por campo
              value={digit}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              // Clases de Tailwind para inputs cuadrados, centrados y redondeados
              className="w-12 h-12 border border-gray-300 rounded-xl text-center text-2xl font-bold text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          ))}
        </div>

        {/* Botón principal morado */}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl text-white font-semibold bg-[#6C63FF] hover:bg-[#5a52d5] transition-colors text-[14px] flex items-center justify-center tracking-wide"
        >
          VERIFICAR
        </button>
      </form>

      {/* Enlace de reenvío con temporizador */}
      <div className="mt-8 text-center text-[13px] text-gray-500">
        ¿No recibiste el código?{' '}
        <button
          onClick={handleResend}
          disabled={!canResend}
          // Color azul/morado para el enlace
          className={`font-semibold transition-colors ${canResend ? 'text-[#6C63FF] hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
        >
          Reenviar {canResend ? '' : `en ${formatTime(secondsLeft)}`}
        </button>
      </div>
    </div>
  );
};
