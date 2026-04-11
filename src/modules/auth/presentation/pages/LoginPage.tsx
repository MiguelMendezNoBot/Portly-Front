import { LoginForm } from '../components/LoginForm';
import BotonInicio from '../../../../shared/components/BotonInicio';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white p-2 md:p-4 box-border">
      <div className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] bg-src-0f111a rounded-[2rem] flex items-center justify-center shadow-2xl">
        <BotonInicio texto="Volver al inicio" />

        <div className="mt-20 md:mt-0 w-full flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
