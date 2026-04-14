import { useState } from 'react';
import { cn } from '../../../../shared/utils/cn';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ExperienceSection from './ExperienceSection';

type TabType = 'habilidades' | 'trayectoria' | 'proyectos';

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('trayectoria');

  const tabs = [
    { id: 'habilidades', label: 'Habilidades' }, // [cite: 11]
    { id: 'trayectoria', label: 'Trayectoria' }, // [cite: 12]
    { id: 'proyectos', label: 'Proyectos' }, // [cite: 13]
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      {/* Selector de Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0F131F] rounded-2xl border border-white/5 self-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-6 py-2.5 rounded-xl text-button transition-all duration-200',
              activeTab === tab.id
                ? 'bg-[#182141] text-white shadow-md'
                : 'text-src-6b7280 hover:text-white hover:bg-white/5'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido Dinámico */}
      <div className="min-h-[400px]">
        {activeTab === 'habilidades' && <SkillsSection />}
        {activeTab === 'trayectoria' && <ExperienceSection />}
        {activeTab === 'proyectos' && <ProjectsSection />}
      </div>
    </div>
  );
}
