import type { Template } from '../../domain/entities/Template';

interface TemplateGalleryProps {
  templates: Template[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (template: Template) => void;
}

const TemplateThumbnail = ({
  template,
  selected,
  onClick,
}: {
  template: Template;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'w-full text-left rounded-xl overflow-hidden border transition-all duration-150 group',
      selected
        ? 'border-[#7c6bec] ring-1 ring-[#7c6bec]/40 shadow-lg shadow-[#7c6bec]/10'
        : 'border-white/8 hover:border-[#7c6bec]/40 hover:bg-white/3',
    ].join(' ')}
  >
    {/* Área de preview */}
    <div className="relative h-24 bg-gradient-to-br from-[#1a1d2e] to-[#0f111a] overflow-hidden">
      {template.previewImageUrl ? (
        <img
          src={template.previewImageUrl}
          alt={template.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        /* Placeholder generado con el esquema de la plantilla */
        <TemplatePlaceholder template={template} />
      )}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#7c6bec] flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
    {/* Nombre */}
    <div className="px-2.5 py-2 bg-[#13151f]">
      <p className={`text-xs font-semibold truncate ${selected ? 'text-[#b0a8f5]' : 'text-[#9ca3af]'}`}>
        {template.nombre}
      </p>
    </div>
  </button>
);

/** Placeholder visual basado en el esquema de la plantilla */
const TemplatePlaceholder = ({ template }: { template: Template }) => {
  const isDark = template.schema.colorScheme !== 'light';
  const accent =
    template.schema.colorScheme === 'colorful'
      ? '#f97316'
      : template.schema.colorScheme === 'dark'
      ? '#7c6bec'
      : '#3b82f6';

  return (
    <div
      className={`w-full h-full p-2 flex flex-col gap-1 ${isDark ? 'bg-[#0f111a]' : 'bg-gray-100'}`}
    >
      {/* Barra de nav */}
      <div className="flex items-center gap-1 mb-0.5">
        <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
        <div className={`h-1.5 rounded w-8 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
        <div className="flex-1" />
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1 rounded w-4 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        ))}
      </div>
      {/* Hero */}
      <div
        className="flex-1 rounded-md flex flex-col items-center justify-center gap-1 px-1"
        style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
      >
        <div className="w-5 h-5 rounded-full" style={{ background: `${accent}40` }} />
        <div className={`h-1.5 rounded w-12 ${isDark ? 'bg-white/30' : 'bg-gray-400'}`} />
        <div className={`h-1 rounded w-8 ${isDark ? 'bg-white/15' : 'bg-gray-300'}`} />
      </div>
      {/* Secciones */}
      <div className="flex gap-1 mt-0.5">
        {[3, 5, 4].map((w, i) => (
          <div
            key={i}
            className={`h-1 rounded`}
            style={{ width: `${w * 6}px`, background: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
          />
        ))}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden border border-white/5 animate-pulse">
    <div className="h-24 bg-white/5" />
    <div className="px-2.5 py-2 bg-[#13151f]">
      <div className="h-2.5 rounded bg-white/10 w-3/4" />
    </div>
  </div>
);

export default function TemplateGallery({
  templates,
  loading,
  selectedId,
  onSelect,
}: TemplateGalleryProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2.5">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
        <p className="text-[#5a6278] text-sm">No hay plantillas disponibles</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {templates.map((t) => (
        <TemplateThumbnail
          key={t.id}
          template={t}
          selected={selectedId === t.id}
          onClick={() => onSelect(t)}
        />
      ))}
    </div>
  );
}
