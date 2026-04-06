import BotonInicio from '../../../../shared/components/BotonInicio';
import { NewPasswordForm } from '../components/NewPasswordForm';

export const NewPasswordPage = () => {
  return (
    <div className="min-h-screen bg-white p-2 md:p-4 box-border">
      <div className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] bg-[#0f111a] rounded-[2rem] flex items-center justify-center shadow-2xl">
        <BotonInicio texto="CANCELAR" to="/login" />
        <NewPasswordForm />
      </div>
    </div>
  );
};
