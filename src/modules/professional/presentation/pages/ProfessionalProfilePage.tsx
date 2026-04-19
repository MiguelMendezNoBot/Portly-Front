import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BotonInicioR from '../../../../shared/components/BotonInicioR';
import { Toast } from '../../../../shared/components/Toast';
import { HomeIcon } from '../components/icons/index';
import ProfileTabs from '../components/ProfileTabs';

const ERROR_MESSAGES: Record<string, string> = {
  already_linked: 'Esta cuenta ya está vinculada a otro usuario.',
  access_denied: 'Se canceló la vinculación.',
};

export default function ProfessionalProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    const linked = searchParams.get('linked');

    if (error && ERROR_MESSAGES[error]) {
      setToast({ message: ERROR_MESSAGES[error], type: 'error' });
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    } else if (linked) {
      setToast({
        message: `Cuenta de ${linked} vinculada correctamente.`,
        type: 'success',
      });
      searchParams.delete('linked');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      {toast && <Toast toast={toast} />}

      <BotonInicioR
        texto="Volver al inicio"
        to="/"
        iconos={[{ icono: <HomeIcon />, to: '/', label: 'Inicio' }]}
      />

      <div className="pt-8 sm:pt-5 text-white">
        <ProfileTabs />
      </div>
    </div>
  );
}

