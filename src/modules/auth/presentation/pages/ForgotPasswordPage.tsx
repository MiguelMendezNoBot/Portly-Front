import CornerTab from '../../../../shared/components/CornerTab';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  return (
    <div className="bg-white p-3 min-h-screen">
      <div className="bg-gradient-to-br from-[#0d152b] to-[#1a2e5d] rounded-[20px] min-h-[calc(100vh-25px)] flex items-center justify-center py-6 relative overflow-hidden">
        <ForgotPasswordForm />
        <CornerTab />
      </div>
    </div>
  );
};
