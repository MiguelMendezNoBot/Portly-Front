import { useState } from 'react';
import { Project } from '../../../domain/entities/Project';

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

interface ProjectCardProps {
  project: Project;
  mode?: 'edit' | 'delete' | null;
  onClick?: () => void;
}

export default function ProjectCard({
  project,
  mode,
  onClick,
}: ProjectCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = project.evidencias || [];
  const hasImages = images.length > 0;

  const nextSlide = () => {
    if (hasImages) setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (hasImages)
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-6 transition-all border ${
        mode === 'edit'
          ? 'bg-[#1a1c29] border-white/20 cursor-pointer hover:bg-[#2a3060] hover:border-white/30'
          : mode === 'delete'
          ? 'bg-[#1a1c29] border-red-500/20 cursor-pointer hover:bg-red-500/10 hover:border-red-500/40'
          : 'bg-[#1a1c29] border-white/5 hover:border-white/10'
      }`}
    >
      {mode === 'edit' && (
        <div className="absolute top-5 right-5 p-2 bg-white/10 rounded-lg text-white z-10 pointer-events-none">
          <EditIcon />
        </div>
      )}
      {mode === 'delete' && (
        <div className="absolute top-5 right-5 p-2 bg-red-500/20 rounded-lg text-red-400 z-10 pointer-events-none">
          <TrashIcon />
        </div>
      )}

      {/* Header: Icon + Name + Date */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {project.iconoUrl ? (
            <img
              src={project.iconoUrl}
              alt={project.nombre}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#2c2f48] flex items-center justify-center text-[#6c63ff]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-white text-xl font-bold pr-12">{project.nombre}</h3>
            {(project.fechaInicio || project.esActual) && (
              <div className="flex items-center gap-1.5 mt-1 text-[#9ca3af] text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>
                  {project.fechaInicio
                    ? new Date(project.fechaInicio + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
                    : ''}
                  {project.fechaInicio && (project.fechaFin || project.esActual) ? ' — ' : ''}
                  {project.esActual ? (
                    <span className="inline-block bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                      Actual
                    </span>
                  ) : project.fechaFin ? (
                    new Date(project.fechaFin + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
                  ) : null}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body: Carousel + Description */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Carousel */}
        <div className="w-full md:w-[280px] shrink-0">
          <div className="relative bg-[#0f111a] rounded-xl overflow-hidden aspect-video">
            {hasImages ? (
              <>
                <img
                  src={images[currentSlide].url}
                  alt={images[currentSlide].nombre}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(images[currentSlide].url);
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#4b5563]">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Dots indicator */}
          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentSlide
                      ? 'bg-[#6c63ff]'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Description & meta */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-base font-semibold mb-2">
            Descripción
          </h4>
          <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">
            {project.descripcionCorta || project.descripcionDetallada}
          </p>

          {/* Tech tags */}
          {project.tecnologias && project.tecnologias.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tecnologias.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#6c63ff]/15 text-[#a3a6ff] px-2.5 py-1 rounded-full font-medium uppercase tracking-wide"
                >
                  #{tech}
                </span>
              ))}
            </div>
          )}



          {/* Action buttons */}
          {project.enlaces && project.enlaces.length > 0 && (
            <div className="mt-4">
              <h4 className="text-white text-base font-semibold mb-2">
                Enlaces:
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.enlaces.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 bg-[#1a1c29] border border-white/10 rounded-xl py-3 px-4 text-white text-sm font-medium hover:border-[#6c63ff]/40 transition-colors max-w-full"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span className="truncate">{link.titulo}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {project.documentos && project.documentos.length > 0 && (
            <div className="mt-4">
              <h4 className="text-white text-base font-semibold mb-2">
                Documentos:
              </h4>
              <div className="space-y-2">
                {project.documentos.map((doc, index) => {
                  const ext = doc.tipo?.toLowerCase() || doc.nombre?.split('.').pop()?.toLowerCase() || '';
                  const isPdf = ext === 'pdf';
                  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

                  return (
                    <a
                      key={index}
                      href={`${baseUrl}${doc.urlDescarga}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-3 bg-[#0f111a] border border-white/5 rounded-xl p-3 hover:border-[#6c63ff]/30 transition-colors group"
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isPdf ? 'bg-red-500/15' : 'bg-blue-500/15'
                      }`}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={isPdf ? '#ef4444' : '#3b82f6'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-[#a3a6ff] transition-colors">
                          {doc.nombre}
                        </p>
                        <p className="text-[#6b7280] text-xs mt-0.5">
                          {ext.toUpperCase()}
                          {doc.pesoBytes ? ` • ${(doc.pesoBytes / (1024 * 1024)).toFixed(1)} MB` : ''}
                        </p>
                      </div>

                      {/* Download arrow */}
                      {!isPdf && (
                        <div className="shrink-0 text-[#6b7280] group-hover:text-[#6c63ff] transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(null);
          }}
        >
          <img 
            src={selectedImage} 
            alt="Detalle" 
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
