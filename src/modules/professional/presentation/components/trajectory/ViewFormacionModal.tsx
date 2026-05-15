import { useState, useMemo } from 'react';
import { FormacionAcademica } from '../../../domain/entities/FormacionAcademica';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: FormacionAcademica[];
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
};

export default function ViewFormacionModal({ isOpen, onClose, records }: Props) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateA = a.fechaEgreso ?? '';
      const dateB = b.fechaEgreso ?? '';
      const diff = dateA.localeCompare(dateB);
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [records, sortOrder]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-lg max-h-[85vh] flex flex-col rounded-[24px] border border-white/10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">Formación Académica</h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">{records.length} registro{records.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Botón de orden */}
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all text-xs font-medium"
              title={sortOrder === 'asc' ? 'Orden ascendente por fecha' : 'Orden descendente por fecha'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {sortOrder === 'asc' ? (
                  <>
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </>
                ) : (
                  <>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </>
                )}
              </svg>
              {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="overflow-y-auto px-8 py-5 space-y-4 scrollbar-thin scrollbar-thumb-[#2c2f48]">
          {sorted.map((rec) => (
            <div
              key={rec.idFormacionAcademica}
              className="bg-[#171B28] p-5 rounded-2xl border border-white/5"
            >
              <h4 className="text-white text-sm font-bold leading-snug">
                {rec.carrera}
              </h4>
              {rec.nivel && (
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-[#6c63ff]/20 text-[#a598ff] px-2 py-0.5 rounded-full">
                  {rec.nivel}
                </span>
              )}
              <p className="text-[#A8E8FF] text-xs font-medium mt-1">{rec.institucion}</p>
              <p className="text-[#A8E8FF] text-xs font-medium">
                • {rec.actualmenteEstudiando ? 'En curso' : formatDate(rec.fechaEgreso)}
              </p>
              {rec.descripcion && (
                <p className="text-[#9ca3af] text-xs mt-2 leading-relaxed">{rec.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
