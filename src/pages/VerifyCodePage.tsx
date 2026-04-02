import PestanaEsquina from '../components/PestanaEsquina';
import { VerifyCodeForm } from '../features/auth/components/VerifyCodeForm';

export const VerifyCodePage = () => {
  return (
    <div className="bg-white p-3 min-h-screen">
      {/* Fondo con degradado azul oscuro para imitar image_16.png */}
      <div className="bg-gradient-to-br from-[#0d152b] to-[#1a2e5d] rounded-[20px] min-h-[calc(100vh-25px)] flex items-center justify-center py-6 relative overflow-hidden">
        <VerifyCodeForm />
        {/* Reutilizando PestanaEsquina con el texto exacto */}
        <PestanaEsquina texto="*CUADRITO CON ANIMACION*" />
      </div>
    </div>
  );
};
