import type { Template } from '../../domain/entities/Template';

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
    <span className="text-[#4b5563] text-[10px] uppercase tracking-wider leading-none">{unit}</span>
    <span className="text-[#6b7280] text-[11px] mt-0.5">{label}</span>
  </div>
);

/** Renderiza una miniatura grande de la plantilla */
const LargePreview = ({ template }: { template: Template }) => {
  const isDark = template.schema.colorScheme !== 'light';
  const accent =
    template.schema.colorScheme === 'colorful'
      ? '#f97316'
      : template.schema.colorScheme === 'dark'
      ? '#7c6bec'
      : '#3b82f6';

  return (
    <div
      className={`w-full h-full rounded-xl overflow-hidden ${isDark ? 'bg-[#0f111a]' : 'bg-gray-50'} border border-white/8 flex flex-col`}
    >
      {/* Barra de navegación mockup */}
      <div className={`flex items-center gap-2 px-3 py-2 border-b ${isDark ? 'border-white/8 bg-[#13151f]' : 'border-gray-200 bg-white'}`}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className={`flex-1 h-4 rounded text-[9px] flex items-center px-2 ${isDark ? 'bg-white/5 text-[#4b5563]' : 'bg-gray-100 text-gray-400'}`}>
          preview.portly.app/tu-portafolio
        </div>
      </div>

      {/* Contenido de la plantilla */}
      <div className="flex-1 overflow-hidden p-3 flex flex-col gap-2">
        {/* Hero section */}
        <div
          className="rounded-lg p-4 flex items-center gap-3"
          style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
        >
          <div className="w-10 h-10 rounded-full shrink-0" style={{ background: `${accent}30` }} />
          <div className="flex-1">
            <div className={`h-3 rounded mb-1.5 w-3/4 ${isDark ? 'bg-white/30' : 'bg-gray-400'}`} />
            <div className={`h-2 rounded w-1/2 ${isDark ? 'bg-white/15' : 'bg-gray-300'}`} />
          </div>
        </div>

        {/* Secciones */}
        <div className="flex gap-2 flex-1">
          {/* Skills column */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className={`h-2 rounded w-16 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
            {[80, 65, 90, 75].map((pct, i) => (
              <div key={i} className={`flex items-center gap-2`}>
                <div className={`h-1.5 rounded-full ${isDark ? 'bg-white/8' : 'bg-gray-200'} flex-1`}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: accent }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Projects column */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className={`h-2 rounded w-12 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-md p-1.5 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}
              >
                <div className={`h-1.5 rounded mb-1 w-3/4 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
                <div className={`h-1 rounded w-1/2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
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
  return (
    <div className="flex flex-col h-full">
      {/* Preview visual */}
      <div className="relative rounded-xl overflow-hidden h-48 shrink-0 mb-4">
        {template.previewImageUrl ? (
          <img
            src={template.previewImageUrl}
            alt={`Vista previa de ${template.nombre}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <LargePreview template={template} />
        )}
        {/* Badge de color scheme */}
        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white/70 backdrop-blur-sm border border-white/10 uppercase tracking-wider">
          {typeof template.schema.colorScheme === 'string' 
            ? template.schema.colorScheme 
            : 'Custom'}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {/* Nombre y descripción */}
        <div>
          <h3 className="text-white font-bold text-lg leading-snug">{template.nombre}</h3>
          <p className="text-[#6b7280] text-sm mt-1 leading-relaxed">{template.descripcion}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-[#7c6bec]/12 text-[#b0a8f5] border border-[#7c6bec]/20 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-5 py-3 border-t border-b border-white/6">
          <StatBox
            label="Estructura"
            value={template.stats.secciones}
            unit="Secciones"
          />
          <StatBox
            label="Impacto"
            value={template.stats.impacto}
            unit="Visualizaciones"
          />
          <StatBox
            label="Tiempo"
            value={template.stats.tiempoConfiguracion}
            unit="Configuración"
          />
        </div>

        {/* Secciones de la plantilla */}
        <div>
          <p className="text-[#6b7280] text-xs uppercase tracking-wider font-semibold mb-2">
            Secciones incluidas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[...template.schema.sections]
              .filter((s) => s.visible)
              .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
              .map((s, idx) => (
                <span
                  key={`${s.type}-${idx}`}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-[#9ca3af] border border-white/6"
                >
                  {s.title || s.type}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-4 shrink-0 flex flex-col items-start">
        <button
          type="button"
          id="btn-create-portfolio"
          onClick={() => onCreatePortfolio(template.id)}
          disabled={creating}
          className={[
            'bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:from-[#a092ec] hover:to-[#8a7be8] text-[#0D0096] py-2.5 px-6 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm',
            creating ? 'opacity-70 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {creating ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Creando…
            </span>
          ) : (
            'CREAR CON ESTA PLANTILLA'
          )}
        </button>
        <p className="text-left text-[#4b5563] text-[11px] mt-2 ml-2">
          Se incluirá tu perfil profesional completo
        </p>
      </div>
    </div>
  );
}
