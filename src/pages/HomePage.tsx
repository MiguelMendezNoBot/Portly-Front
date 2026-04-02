import { Navbar } from '../features/home/components/Navbar';
import { HeroSection } from '../features/home/components/HeroSection';
import { UserTab } from '../features/home/components/UserTab';
import PestanaEsquina from '../components/CornerTab';

export const HomePage = () => {
  return (
    <div className="bg-white p-3 min-h-screen font-sans">
      <div className="relative bg-[#0d152b] rounded-[20px] min-h-[calc(100vh-25px)] overflow-hidden">
        <PestanaEsquina>
          <UserTab />
        </PestanaEsquina>

        <Navbar />
        <HeroSection />
      </div>
    </div>
  );
};
