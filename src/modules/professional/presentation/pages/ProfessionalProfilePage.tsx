import BotonInicioR from '../../../../shared/components/BotonInicioR';
import { HomeIcon } from '../components/icons/index';
import ProfileTabs from '../components/ProfileTabs';

export default function ProfessionalProfilePage() {
  return (
    <div className="max-w-6xl mx-auto pb-20">
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
