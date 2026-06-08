import { LoginForm } from '../components/LoginForm';
import BotonInicio from '../../../../shared/components/BotonInicio';

export default function LoginPage() {
  return (
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden">
      <div className="relative w-full h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)] bg-src-0f111a rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
        <BotonInicio texto="Volver al inicio" />

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin flex flex-col items-center justify-center px-2 pt-24 pb-6 md:pt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
