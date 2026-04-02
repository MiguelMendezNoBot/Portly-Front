import { Navbar } from '../features/home/components/Navbar';
import { HeroSection } from '../features/home/components/HeroSection';
import { UserTab } from '../features/home/components/UserTab';
import PestanaEsquina from '../components/CornerTab';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="relative w-full max-w-6xl bg-[#0f1629] rounded-[32px] shadow-2xl overflow-hidden">
        <PestanaEsquina>
          <UserTab />
        </PestanaEsquina>

        <Navbar />
        <HeroSection />
      </div>
    </div>
  );
};
