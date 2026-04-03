import CornerTab from '../../../../shared/components/CornerTab';
import { NewPasswordForm } from '../components/NewPasswordForm';

export const NewPasswordPage = () => {
  return (
    <div className="bg-white p-3 min-h-screen">
      <div className="bg-gradient-to-br from-[#0d152b] to-[#1a2e5d] rounded-[20px] min-h-[calc(100vh-25px)] flex items-center justify-center py-6 relative overflow-hidden">
        <NewPasswordForm />
        <CornerTab texto="*CUADRITO CON ANIMACION*" />
      </div>
    </div>
  );
};
