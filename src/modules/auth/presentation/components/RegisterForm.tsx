import { Link } from 'react-router-dom';
import { Input } from '../../../../shared/components/Input';
import { useRegisterForm } from '../../application/useRegisterForm';
import {
  GitHubIcon,
  GoogleIcon,
  LinkedInIcon,
} from '../../../../shared/components/SocialIcons';
import { PROFESIONES } from '../constants/register.constants';
import { OAUTH_URLS } from '../constants/oauth.constants';

interface RegisterFormProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const RegisterForm = ({ step, setStep }: RegisterFormProps) => {
  const { fields, errors, toast, handleChange, handleSubmit, validate } =
    useRegisterForm();

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validate(step)) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const subtitles: Record<number, string> = {
    1: 'Regístrate en el sistema, mediante el siguiente formulario',
    2: 'Completa tus datos para identificarte',
    3: 'Completa tus datos sobre tu perfil profesional',
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="w-[85%] sm:w-full max-w-[25rem] mx-auto px-5 sm:px-9 py-6 bg-white rounded-[35px] relative">
        {toast && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] text-center text-sm px-4 py-2 rounded-lg text-white shadow-lg transition-all z-50
                        ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {toast.message}
          </div>
        )}
        <div className="pb-1 text-center">
          <h1 className="font-bold text-3xl pb-1">Crea tu cuenta</h1>
          <h2 className="text-gray-500 font-thin text-[12px] tracking-tight">
            {subtitles[step]}
          </h2>
        </div>
        <form onSubmit={handleSubmit} noValidate className="p-4 pt-0">
          {step === 1 && (
            <div className="animate-fadeIn">
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="nombre@dominio.com"
                value={fields.email}
                onChange={handleChange('email')}
                error={errors.email}
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
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs font-normal text-gray-800 mr-3">
                  O continua con:
                </span>
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => (window.location.href = OAUTH_URLS.google)}
                    className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <GoogleIcon className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => (window.location.href = OAUTH_URLS.github)}
                    className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <GitHubIcon className="w-8 h-8" />
                  </button>
                  <button
                    type="button"
                    onClick={() => (window.location.href = OAUTH_URLS.linkedin)}
                    className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <LinkedInIcon className="w-8 h-8 text-[#0077B5]" />
                  </button>
                </div>
              </div>
              <button
                onClick={nextStep}
                className="mt-4 w-full py-2 rounded-lg text-sm text-white font-light bg-[#8781fa] hover:bg-[#6960ec] transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn">
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
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 py-1 rounded-lg text-[#6C63FF] font-light text-sm border border-[#6C63FF] hover:bg-gray-50 transition-colors"
                >
                  {' '}
                  Atrás
                </button>
                <button
                  onClick={nextStep}
                  className="w-2/3 py-2 text-sm rounded-lg text-white font-light bg-[#8781fa] hover:bg-[#6960ec] transition-colors"
                >
                  {' '}
                  Siguiente{' '}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn">
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
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 py-1 rounded-lg text-[#6C63FF] font-light text-sm border border-[#6C63FF] hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 text-sm rounded-lg text-white font-light bg-[#8781fa] hover:bg-[#6960ec] transition-colors"
                >
                  Finalizar registro
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-2">
            <span className="text-gray-500 text-sm">¿Ya tienes cuenta? </span>
            <Link
              to="/login"
              className="text-[#6C63FF] font-medium text-sm cursor-pointer hover:underline"
            >
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
