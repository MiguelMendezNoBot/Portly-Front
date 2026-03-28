import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f1629] flex items-center justify-center p-4 font-sans">
      <LoginForm />
    </div>
  );
}