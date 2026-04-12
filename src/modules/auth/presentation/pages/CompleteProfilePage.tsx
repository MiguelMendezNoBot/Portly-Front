import { useState } from 'react';
import BotonInicio from '../../../../shared/components/BotonInicio';
import { completeOAuthProfile } from '../../infrastructure/authService';
import { saveToken } from '../../../../infrastructure/storage/storage';
import { PROFESIONES } from '../constants/register.constants';

const MAX_CHARS = 500;

interface FormErrors {
  profesion?: string;
  resena?: string;
}

export const CompleteProfilePage = () => {
  const [profesion, setProfesion] = useState('');
  const [resena, setResena] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!profesion) {
      newErrors.profesion = 'Seleccione una profesion';
    }
    if (!resena.trim()) {
      newErrors.resena = 'Este campo no puede estar vacio';
    } else if (resena.length > MAX_CHARS) {
      newErrors.resena = 'La descripcion debe tener menos de 500';
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
      const response = await completeOAuthProfile({ profesion, resena });
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
    <div className="min-h-screen bg-white p-2 md:p-4 box-border">
      <div className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] bg-[#0f111a] rounded-[2rem] flex items-center justify-center shadow-2xl">
        <BotonInicio texto="VOLVER AL INICIO" to="/" />

        <div className="mt-20 md:mt-0 w-full flex justify-center px-4">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-[85%] sm:w-full max-w-[25rem] mx-auto px-5 sm:px-9 py-8 bg-white rounded-[35px]"
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

            {/* Profesión */}
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-black text-[13.5px] font-semibold mt-3">
                Profesion
              </label>
              <select
                value={profesion}
                onChange={(e) => setProfesion(e.target.value)}
                className={`w-full text-xs px-2 pt-2 pb-1 border rounded-xl outline-none bg-white ${
                  errors.profesion ? 'border-red-400' : 'border-gray-400'
                }`}
              >
                <option value="">Ej: UI/UX designer</option>
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
                Reseña Profesional
              </label>
              <textarea
                placeholder="Escribe tu reseña personal."
                value={resena}
                onChange={(e) => setResena(e.target.value)}
                rows={4}
                className={`resize-none w-full text-[12px] px-2 py-1 border rounded-xl outline-none ${
                  errors.resena ? 'border-red-400' : 'border-gray-400'
                }`}
              />
              <span className={`text-[10px] mt-1 text-right block ${charCountColor}`}>
                {resena.length}/{MAX_CHARS}
              </span>
              {errors.resena && (
                <span className="text-red-500 text-[11px]">{errors.resena}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg text-sm text-white font-light bg-[#8781fa] hover:bg-[#6960ec] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Finalizar Registro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
