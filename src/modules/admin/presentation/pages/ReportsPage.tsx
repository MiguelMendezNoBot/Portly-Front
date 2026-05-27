import { useState } from 'react';
import { UserReportModal } from '../components/UserReportModal';
import { SkillReportModal } from '../components/SkillReportModal';
import { TemplateReportModal } from '../components/TemplateReportModal';
import { HttpAdminReportRepository } from '../../infrastructure/repositories/HttpAdminReportRepository';

const cards = [
  {
    id: 'users',
    title: 'Reporte de usuarios registrados',
    description: 'Genera un PDF con el listado de usuarios filtrando por rango de fechas y estado de cuenta.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    id: 'portfolios',
    title: 'Reporte de uso de plantillas',
    description: 'Genera un PDF con las plantillas más utilizadas por los usuarios, filtrando por fecha y estado.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    )
  },
  {
    id: 'skills',
    title: 'Reporte de habilidades registradas',
    description: 'Genera un PDF con el ranking de habilidades más registradas filtrando por tipo y periodo.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  }
];

export function ReportsPage() {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const repo = new HttpAdminReportRepository();

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-transparent border-2 border-white/10 rounded-2xl p-6 flex flex-col h-full hover:border-src-7c6bec/50 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-src-7c6bec mb-5">
              {card.icon}
            </div>
            <h3 className="text-white text-xl font-bold mb-3">{card.title}</h3>
            <p className="text-src-9ca3af text-sm mb-8 flex-1 leading-relaxed">
              {card.description}
            </p>
            <button
              onClick={() => {
                if (card.id === 'users') setUserModalOpen(true);
                if (card.id === 'skills') setSkillModalOpen(true);
                if (card.id === 'portfolios') setTemplateModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Generar reporte
            </button>
          </div>
        ))}
      </div>

      <UserReportModal 
        isOpen={userModalOpen} 
        onClose={() => setUserModalOpen(false)}
        repository={repo}
      />

      <SkillReportModal 
        isOpen={skillModalOpen} 
        onClose={() => setSkillModalOpen(false)}
        repository={repo}
      />

      <TemplateReportModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        repository={repo}
      />
    </div>
  );
}
