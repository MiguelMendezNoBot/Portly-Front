import type { Template } from '../../domain/entities/Template';
import {
  useProfessionalData,
  type ProfessionalData,
} from '../../application/useProfessionalData';

interface TemplatePreviewProps {
  template: Template;
  creating: boolean;
  onCreatePortfolio: (templateId: string) => void;
}

const StatBox = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-white font-bold text-base leading-none">{value}</span>
    <span className="text-[#4b5563] text-[10px] uppercase tracking-wider leading-none">
      {unit}
    </span>
    <span className="text-[#6b7280] text-[11px] mt-0.5">{label}</span>
  </div>
);

/** Renderiza una miniatura grande de la plantilla con datos reales */
const LargePreview = ({
  template,
  data,
}: {
  template: Template;
  data: ProfessionalData;
}) => {
  const isDark = template.schema.colorScheme !== 'light';
  const accent =
    template.schema.colorScheme === 'colorful'
      ? '#f97316'
      : template.schema.colorScheme === 'dark'
        ? '#7c6bec'
        : '#3b82f6';

  const userName = data.user
    ? `${data.user.firstName} ${data.user.lastName}`
    : 'Tu Nombre';
  const userProfession = data.user?.profession || 'Tu Profesión';
  const avatarUrl = data.user?.avatarUrl;

  const topSkills = data.skills.slice(0, 4);
  const topProjects = data.projects.slice(0, 2);

  // Mapeo de niveles a porcentajes
  const levelToPct: Record<string, number> = {
    Básico: 25,
    Intermedio: 50,
    Avanzado: 75,
    Experto: 90,
    Maestro: 100,
  };

  return (
    <div
      className={`w-full h-full rounded-xl overflow-hidden ${isDark ? 'bg-[#0f111a]' : 'bg-gray-50'} border border-white/8 flex flex-col`}
    >
      {/* Barra de navegación mockup */}
      <div
        className={`flex items-center gap-2 px-3 py-2 border-b ${isDark ? 'border-white/8 bg-[#13151f]' : 'border-gray-200 bg-white'}`}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div
          className={`flex-1 h-4 rounded text-[9px] flex items-center px-2 font-mono truncate ${isDark ? 'bg-white/5 text-[#4b5563]' : 'bg-gray-100 text-gray-400'}`}
        >
          preview.portly.app/p/tu-portafolio
        </div>
      </div>

      {/* Contenido de la plantilla */}
      <div className="flex-1 overflow-hidden p-3 flex flex-col gap-2">
        {/* Hero section */}
        <div
          className="rounded-lg p-3 flex items-center gap-3"
          style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full shrink-0 object-cover"
              style={{ border: `1px solid ${accent}` }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full shrink-0"
              style={{ background: `${accent}30` }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div
              className={`text-[11px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {userName}
            </div>
            <div
              className={`text-[9px] truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              style={{ color: accent }}
            >
              {userProfession}
            </div>
          </div>
        </div>

        {/* Secciones */}
        <div className="flex gap-2 flex-1 min-h-0">
          {/* Skills column */}
          <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
            <div
              className={`text-[8px] font-bold uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Skills
            </div>
            {topSkills.length > 0
              ? topSkills.map((skill, i) => {
                  const pct = levelToPct[skill.level] || 50;
                  return (
                    <div key={i} className={`flex flex-col gap-0.5`}>
                      <span
                        className={`text-[8px] truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        {skill.name}
                      </span>
                      <div
                        className={`h-1.5 rounded-full ${isDark ? 'bg-white/8' : 'bg-gray-200'} flex-1`}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: accent }}
                        />
                      </div>
                    </div>
                  );
                })
              : // Fallback si no hay skills
                [80, 65, 90].map((pct, i) => (
                  <div key={i} className={`flex items-center gap-2 mt-1`}>
                    <div
                      className={`h-1.5 rounded-full ${isDark ? 'bg-white/8' : 'bg-gray-200'} flex-1`}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: accent }}
                      />
                    </div>
                  </div>
                ))}
          </div>
          {/* Projects column */}
          <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
            <div
              className={`text-[8px] font-bold uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Proyectos
            </div>
            {topProjects.length > 0
              ? topProjects.map((p, i) => (
                  <div
                    key={i}
                    className={`rounded-md p-1.5 flex flex-col gap-0.5 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}
                  >
                    <div
                      className={`text-[8px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}
                    >
                      {p.nombre}
                    </div>
                    <div
                      className={`text-[7px] line-clamp-2 leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {p.descripcionCorta}
                    </div>
                  </div>
                ))
              : // Fallback si no hay proyectos
                [1, 2].map((i) => (
                  <div
                    key={i}
                    className={`rounded-md p-1.5 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}
                  >
                    <div
                      className={`h-1.5 rounded mb-1 w-3/4 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`}
                    />
                    <div
                      className={`h-1 rounded w-1/2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TemplatePreview({
  template,
  creating,
  onCreatePortfolio,
}: TemplatePreviewProps) {
  const { data: profData, loading } = useProfessionalData();

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-full gap-6">
      {/* Columna Izquierda: Preview visual (Scrollable) */}
      <div className="flex-1 min-w-0 flex flex-col h-[300px] lg:h-auto shrink-0">
        <div className="relative rounded-xl overflow-hidden flex-1 bg-[#0f111a] border border-white/5 shadow-inner">
          <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            {template.previewImageUrl || template.previewUrl ? (
              <img
                src={template.previewImageUrl || template.previewUrl}
                alt={`Vista previa de ${template.nombre}`}
                className="w-full h-auto block"
              />
            ) : (
              <div className="h-full min-h-[300px] lg:min-h-0">
                <LargePreview template={template} data={profData} />
              </div>
            )}
          </div>
          {/* Badge de color scheme */}
          <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-black/60 text-white/90 backdrop-blur-md border border-white/10 uppercase tracking-wider font-bold z-10 shadow-lg">
            {typeof template.schema.colorScheme === 'string'
              ? template.schema.colorScheme
              : 'Custom'}
          </span>
        </div>
      </div>

      {/* Columna Derecha: Información y Detalles */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5 overflow-y-visible lg:overflow-y-auto pr-1 pb-4 lg:pb-0">
        {/* Nombre y descripción */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white font-black text-2xl tracking-tight leading-tight">
            {template.nombre}
          </h3>
          <div className="h-1 w-12 bg-[#7c6bec] rounded-full" />
          <p className="text-[#9ca3af] text-sm leading-relaxed mt-1 font-medium italic">
            "{template.descripcion}"
          </p>
        </div>


        {/* Tags */}
        <div className="flex flex-col gap-2">
          <p className="text-[#4b5563] text-[10px] uppercase tracking-[0.2em] font-bold">
            Estilo y Enfoque
          </p>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-white/60 border border-white/10 font-bold hover:bg-[#7c6bec]/10 hover:text-[#b0a8f5] hover:border-[#7c6bec]/30 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Secciones de la plantilla */}
        <div className="flex flex-col gap-2">
          <p className="text-[#4b5563] text-[10px] uppercase tracking-[0.2em] font-bold">
            Módulos Incluidos
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {[...template.schema.sections]
              .filter((s) => s.visible)
              .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
              .map((s, idx) => (
                <div
                  key={`${s.type}-${idx}`}
                  className="flex items-center gap-2 text-[11px] text-[#6b7280] font-medium"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7c6bec]/40" />
                  <span className="truncate">{s.title || s.type}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
