import { useState } from 'react';
import BotonInicio from '../../../../shared/components/BotonInicio';
import { completeOAuthProfile } from '../../infrastructure/authService';
import { saveToken } from '../../../../infrastructure/storage/storage';
import { PROFESIONES } from '../constants/register.constants';

const MAX_CHARS = 500;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

interface FormErrors {
  username?: string;
  profesion?: string;
  resena?: string;
}

export const CompleteProfilePage = () => {
  const [username, setUsername] = useState('');
  const [profesion, setProfesion] = useState('');
  const [resena, setResena] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (username.trim().length < 3 || username.trim().length > 30) {
      newErrors.username = 'Entre 3 y 30 caracteres';
    } else if (!USERNAME_REGEX.test(username.trim())) {
      newErrors.username = 'Solo letras, números y guión bajo (_)';
    }

    if (!profesion) {
      newErrors.profesion = 'Seleccione una profesión';
    }
    if (!resena.trim()) {
      newErrors.resena = 'Este campo no puede estar vacío';
    } else if (resena.length > MAX_CHARS) {
      newErrors.resena = 'La descripción debe tener menos de 500';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const response = await completeOAuthProfile({ username: username.trim().toLowerCase(), profesion, resena });
      saveToken(response.token);
      window.location.replace('/');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : 'Error al completar el perfil.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const charCountColor = resena.length > MAX_CHARS ? 'text-red-500' : 'text-gray-400';

  return (
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden">
      <div className="relative w-full h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)] bg-[#0f111a] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
        <BotonInicio texto="VOLVER AL INICIO" to="/" />

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin flex justify-center px-4 pt-20 pb-6 md:py-6">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-[85%] sm:w-full max-w-[25rem] mx-auto px-5 sm:px-9 py-8 bg-white rounded-[35px] my-auto"
          >
            <div className="pb-4 text-center">
              <h1 className="font-bold text-3xl pb-1">Completa tu perfil</h1>
              <p className="text-gray-500 font-thin text-[12px] tracking-tight">
                Completa tu perfil con tus datos personales
              </p>
            </div>

            {serverError && (
              <div className="mb-3 text-center text-sm px-4 py-2 rounded-lg text-white bg-red-500">
                {serverError}
              </div>
            )}

            {/* Nombre de Usuario */}
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-black text-[13.5px] font-semibold mt-3">
                Nombre de Usuario<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="ej: juan_perez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={`w-full text-xs px-2 pt-2 pb-1 border rounded-xl outline-none bg-white ${
                  errors.username ? 'border-red-400' : 'border-gray-400'
                } text-black`}
              />
              {errors.username && (
                <span className="text-red-500 text-[11px]">{errors.username}</span>
              )}
              <p className="text-gray-400 text-[10px] leading-snug">
                Solo letras, números y guión bajo (_). Entre 3 y 30 caracteres.
              </p>
            </div>

            {/* Profesión */}
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-black text-[13.5px] font-semibold mt-3">
                Profesión<span className="text-red-500">*</span>
              </label>
              <select
                value={profesion}
                onChange={(e) => setProfesion(e.target.value)}
                className={`w-full text-xs px-2 pt-2 pb-1 border rounded-xl outline-none bg-white text-black ${
                  errors.profesion ? 'border-red-400' : 'border-gray-400'
                }`}
              >
                <option value="" disabled>Selecciona tu profesión</option>
                {PROFESIONES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.profesion && (
                <span className="text-red-500 text-[11px]">{errors.profesion}</span>
              )}
            </div>

            {/* Reseña Profesional */}
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-black text-[13.5px] font-semibold mt-3">
                Descripción Profesional<span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Escribe tu descripción profesional."
                value={resena}
                onChange={(e) => setResena(e.target.value)}
                rows={6}
                className={`resize-none w-full text-[12px] px-2 py-1 border rounded-xl outline-none ${
                  errors.resena ? 'border-red-400' : 'border-gray-400'
                }`}
              />
              <div className="flex items-start justify-between mt-1 gap-2">
                {errors.resena && (
                  <span className="text-red-500 text-[11px]">{errors.resena}</span>
                )}
                <span className={`text-[10px] ml-auto shrink-0 ${charCountColor}`}>
                  {resena.length}/{MAX_CHARS}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.location.replace('/')}
                disabled={loading}
                className="w-full py-2 rounded-lg text-sm font-light border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-sm text-white font-light bg-[#8781fa] hover:bg-[#6960ec] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'PROCESANDO...' : 'COMPLETAR PERFIL'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
