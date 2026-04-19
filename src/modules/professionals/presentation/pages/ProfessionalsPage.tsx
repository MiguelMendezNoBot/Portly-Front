import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../../infrastructure/http/httpClient';

interface PublicProfessional {
  idUsuario: string;
  nombre: string;
  apellido: string;
  email?: string;
  titularProfesional?: string;
  acercaDeMi?: string;
  enlaceFoto?: string;
}

function PersonIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<PublicProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    httpClient
      .get<PublicProfessional[]>('/api/public/profesionales')
      .then(setProfessionals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f24] text-white">
      <div className="max-w-2xl mx-auto px-5 pt-12 pb-16">

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </button>

        <h1 className="text-3xl font-extrabold text-white mb-6">
          Profesionales en el sistema
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
          </div>
        ) : professionals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <PersonIcon />
            <p className="text-slate-500 text-sm">No hay profesionales registrados aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {professionals.map((p) => {
              const avatar = p.enlaceFoto
                ? <img src={p.enlaceFoto} alt={p.nombre} className="w-full h-full object-cover" />
                : <PersonIcon />;

              return (
                <button
                  key={p.idUsuario}
                  type="button"
                  onClick={() => navigate(`/profesionales/${p.idUsuario}`)}
                  className="w-full bg-[#0e1428] border border-white/8 rounded-[14px] p-5 text-left hover:border-white/20 hover:bg-[#131a35] transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-[64px] h-[64px] rounded-full bg-[#1a1f3a] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-base leading-tight">
                        {p.nombre} {p.apellido}
                      </p>
                      {p.titularProfesional && (
                        <p className="text-teal-400 text-sm mt-0.5 leading-snug">{p.titularProfesional}</p>
                      )}
                    </div>
                  </div>

                  {p.acercaDeMi && (
                    <p className="text-slate-400 text-sm leading-relaxed mt-3 line-clamp-3 break-words">
                      {p.acercaDeMi}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
