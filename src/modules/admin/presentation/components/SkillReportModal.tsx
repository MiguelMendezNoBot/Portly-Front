import { useState } from 'react';
import { HttpAdminReportRepository } from '../../infrastructure/repositories/HttpAdminReportRepository';

interface SkillReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: HttpAdminReportRepository;
}

export function SkillReportModal({ isOpen, onClose, repository }: SkillReportModalProps) {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [skillType, setSkillType] = useState('Todas');
  
  const [errorDesde, setErrorDesde] = useState('');
  const [errorHasta, setErrorHasta] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleGenerate = async () => {
    let isValid = true;
    setErrorDesde('');
    setErrorHasta('');
    setGeneralError('');

    if (!desde) {
      setErrorDesde('La fecha de inicio es obligatoria.');
      isValid = false;
    }
    if (!hasta) {
      setErrorHasta('La fecha de fin es obligatoria.');
      isValid = false;
    }

    if (desde && hasta && hasta < desde) {
      setErrorHasta('La fecha de fin no puede ser menor a la fecha de inicio.');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    try {
      await repository.downloadSkillReport({ desde, hasta, skillType });
      onClose();
    } catch (error: any) {
      setGeneralError(error.message || 'Error al generar el reporte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-lg rounded-[24px] border border-white/10 p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="text-[#EF4444]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold">Reporte de habilidades registradas</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Rango de fechas *</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[#9ca3af] text-xs mb-1">Desde</label>
                <div className="relative">
                  <input
                    type="date"
                    max={today}
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#7c6bec]"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
                {errorDesde && <p className="text-[#EF4444] text-xs mt-1">{errorDesde}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-[#9ca3af] text-xs mb-1">Hasta</label>
                <div className="relative">
                  <input
                    type="date"
                    max={today}
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    className="w-full bg-[#1a1c29] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#7c6bec]"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
                {errorHasta && <p className="text-[#EF4444] text-xs mt-1">{errorHasta}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Tipo de habilidad</label>
            <select
              value={skillType}
              onChange={(e) => setSkillType(e.target.value)}
              className="w-full bg-[#1a1c29] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#7c6bec] appearance-none"
            >
              <option value="Todas">Todas</option>
              <option value="Técnicas">Técnicas</option>
              <option value="Blandas">Blandas</option>
            </select>
            <div className="absolute right-[40px] bottom-[115px] pointer-events-none text-white/50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          
          {generalError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
              {generalError}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            CANCELAR
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full bg-[#b0a8f5] text-[#1c1154] font-bold hover:bg-[#c4bef8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#1c1154] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            GENERAR PDF
          </button>
        </div>
      </div>
    </div>
  );
}
