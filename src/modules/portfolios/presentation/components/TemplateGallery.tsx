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
      'w-full text-left rounded-2xl overflow-hidden border transition-all duration-300 group relative',
      selected
        ? 'border-[#7c6bec] ring-2 ring-[#7c6bec]/20 shadow-[0_8px_25px_-5px_rgba(124,107,236,0.3)] bg-[#1a1d2e]'
        : 'border-white/5 hover:border-[#7c6bec]/30 hover:bg-white/5 bg-[#13151f]',
    ].join(' ')}
  >
    {/* Área de preview */}
    <div className="relative h-32 bg-[#0f111a] overflow-hidden border-b border-white/5">
      {template.previewImageUrl || template.previewUrl ? (
        <img
          src={template.previewImageUrl || template.previewUrl}
          alt={template.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        /* Placeholder generado con el esquema de la plantilla */
        <TemplatePlaceholder template={template} />
      )}

      {/* Overlay al seleccionar */}
      {selected && (
        <div className="absolute inset-0 bg-[#7c6bec]/10 pointer-events-none" />
      )}

      {/* Badge de selección */}
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#7c6bec] flex items-center justify-center shadow-lg animate-scale-in">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>

    {/* Nombre y detalles rápidos */}
    <div className="px-3.5 py-3">
      <p className={`text-[11px] font-bold tracking-tight uppercase ${selected ? 'text-[#C9BEFF]' : 'text-gray-400'} group-hover:text-white transition-colors`}>
        {template.nombre}
      </p>
      <div className="flex items-center gap-1.5 mt-1">
        {template.tags.slice(0, 1).map(tag => (
           <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 font-medium">
             {tag}
           </span>
        ))}
        <div className="flex-1" />
        <div className="flex gap-0.5">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-1 h-1 rounded-full ${selected ? 'bg-[#7c6bec]/40' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
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
      className={`w-full h-full p-3 flex flex-col gap-2 relative ${isDark ? 'bg-[#0f111a]' : 'bg-gray-50'}`}
    >
      {/* Decoración abstracta */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Mockup Barra de nav */}
      <div className="flex items-center gap-1.5 mb-1 opacity-40">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
        <div className={`h-1.5 rounded w-10 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
        <div className="flex-1" />
        <div className="flex gap-1">
          {[1, 2].map((i) => (
            <div key={i} className={`h-1 rounded w-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      {/* Mockup Hero */}
      <div
        className="flex-1 rounded-xl flex flex-col items-center justify-center gap-2 px-2 shadow-inner"
        style={{ background: `${accent}10`, border: `1px dashed ${accent}30` }}
      >
        <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: `${accent}40`, border: `1px solid ${accent}60` }} />
        <div className="flex flex-col items-center gap-1 w-full">
           <div className={`h-2 rounded w-16 ${isDark ? 'bg-white/30' : 'bg-gray-400'}`} />
           <div className={`h-1.5 rounded w-10 ${isDark ? 'bg-white/15' : 'bg-gray-300'}`} />
        </div>
      </div>

      {/* Mockup Secciones Inferiores */}
      <div className="flex gap-1.5 mt-1 opacity-30">
        {[4, 6, 5].map((w, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1`}
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
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
    <div className="flex flex-row lg:flex-col gap-3 lg:gap-2.5 w-max lg:w-full">
      {templates.map((t) => (
        <div key={t.id} className="w-48 lg:w-full shrink-0">
          <TemplateThumbnail
            template={t}
            selected={selectedId === t.id}
            onClick={() => onSelect(t)}
          />
        </div>
      ))}
    </div>
  );
}
