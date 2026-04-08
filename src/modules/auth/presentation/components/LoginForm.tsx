import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../../application/useLoginForm';
import { Toast } from '../../../../shared/components/Toast';
import {
  GoogleIcon,
  GitHubIcon,
  LinkedInIcon,
  EyeIcon,
  EyeOffIcon,
} from '../../../../shared/components/SocialIcons';
import { OAUTH_URLS } from '../constants/oauth.constants';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { fields, errors, toast, handleChange, handleSubmit } = useLoginForm();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-2xl w-full max-w-[480px] z-10 relative text-gray-900 mx-4 box-border">
      <Toast toast={toast} />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2">Bienvenido</h2>
        <p className="text-gray-600 text-sm">
          Ingresa en la plataforma con tus redes profesionales
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          type="button"
          onClick={() => {
            window.location.href = OAUTH_URLS.google;
          }}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3.5 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon className="w-5 h-5" />
          Google
        </button>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => {
              window.location.href = OAUTH_URLS.github;
            }}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3.5 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
          >
            <GitHubIcon className="w-5 h-5" />
            GitHub
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = OAUTH_URLS.linkedin;
            }}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3.5 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
          >
            <LinkedInIcon className="w-5 h-5 text-[#0077B5]" />
            LinkedIn
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 font-semibold text-gray-400 tracking-wider">
            INICIO DE SESION
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-1">
            Correo Electronico
          </label>
          <input
            type="email"
            placeholder="nombre@dominio.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={fields.email}
            onChange={handleChange('email')}
            onKeyDown={handleEmailKeyDown}
            required
          />
          {errors.email && (
            <span className="text-red-500 text-[11px]">{errors.email}</span>
          )}
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-bold">Contraseña</label>
            <Link
              to="/forgot-password"
              className="text-sm font-bold text-gray-900 hover:text-indigo-600"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="relative">
            <input
              ref={passwordInputRef}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={fields.password}
              onChange={handleChange('password')}
              required
            />
            {errors.password && (
              <span className="text-red-500 text-[11px]">
                {errors.password}
              </span>
            )}
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
          type="submit"
          className="w-full bg-[#6B72FF] hover:bg-[#585fe6] text-white font-bold py-4 rounded-xl transition-colors mt-2 shadow-lg shadow-indigo-200"
        >
          Iniciar Sesion
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-8">
        ¿Nuevo en la plataforma?{' '}
        <Link
          to="/register"
          className="text-[#6B72FF] font-bold hover:underline"
        >
          Crea una cuenta
        </Link>
      </p>
    </div>
  );
}
