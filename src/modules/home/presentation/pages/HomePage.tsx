import { UserTab } from '../components/UserTab';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import PestanaEsquina from '../../../../shared/components/CornerTab';

export const HomePage = () => {
  return (
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center font-sans">
      <div className="relative w-full h-[calc(100vh-2.5rem)] bg-[#0d152b] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        <PestanaEsquina>
          <UserTab />
        </PestanaEsquina>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-20 sm:pt-0 scrollbar-thin">
          <Navbar />
          <HeroSection />
        </div>
      </div>
    </div>
  );
};
