import FormacionAcademicaSection from './trayectoria/FormacionAcademicaSection';
import TrayectoriaProfesional from './trayectoria/TrayectoriaProfesionalSection';

export default function TrayectoriaSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
      <TrayectoriaProfesional />

      <FormacionAcademicaSection />
    </div>
  );
}
