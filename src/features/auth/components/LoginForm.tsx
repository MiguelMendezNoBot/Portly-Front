import { useState, useRef } from 'react';
import { GoogleIcon, GitHubIcon, LinkedInIcon, EyeIcon, EyeOffIcon } from '../../../components/SocialIcons';
import { Link } from 'react-router-dom';

const GOOGLE_AUTH_URL = 'http://localhost:8080/auth/google';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2. Creamos el "control remoto" para el input de contraseña
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // 3. Función que detecta el Enter en el correo
  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita que el formulario intente enviarse antes de tiempo
      passwordInputRef.current?.focus(); // Salta al campo de contraseña
    }
  };

  // 4. Función que maneja el envío final (aquí conectarás el endpoint después)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando datos al servidor...', { email, password });
    alert('¡Procesando inicio de sesión!');
  };

  return (
    <div className="min-h-screen bg-[#0f1629] flex items-center justify-center p-4 font-sans text-gray-900">
      
      <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2">Bienvenido de nuevo</h2>
          <p className="text-gray-600 text-sm">Ingresa en la plataforma con tus redes profesionales</p>
        </div>

        {/* Botones Sociales */}
        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={() => { window.location.href = GOOGLE_AUTH_URL; }}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3.5 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon className="w-5 h-5" />
            Google
          </button>
          <div className="flex gap-4">
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3.5 text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
              <GitHubIcon className="w-5 h-5" />
              GitHub
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3.5 text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
              <LinkedInIcon className="w-5 h-5 text-[#0077B5]" />
              LinkedIn
            </button>
          </div>
        </div>

        {/* Divisor */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 font-semibold text-gray-400 tracking-wider">INICIO DE SESION</span>
          </div>
        </div>

        {/* 5. Agregamos el onSubmit al formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-1">Correo Electronico</label>
            <input 
              type="email" 
              placeholder="nombre@dominio.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEmailKeyDown} // Conectamos el detector de teclas
              required
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold">Contraseña</label>
              <a href="#" className="text-sm font-bold text-gray-900 hover:text-indigo-600">¿Olvidaste tu contraseña?</a>
            </div>
            
            <div className="relative">
              <input 
                ref={passwordInputRef} // 6. Conectamos el "control remoto" aquí
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <button 
                type="button" 
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" // 7. Importante: debe ser tipo submit
            className="w-full bg-[#6B72FF] hover:bg-[#585fe6] text-white font-bold py-4 rounded-xl transition-colors mt-2 shadow-lg shadow-indigo-200"
          >
            Iniciar Sesion
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          ¿Nuevo en la plataforma? <Link to="/auth/register" className="text-[#6B72FF] font-bold hover:underline">Crea una cuenta</Link>
        </p>
      </div>
    </div>
  );
}