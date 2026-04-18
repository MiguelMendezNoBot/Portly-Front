import { useState } from 'react';
import { Project } from '../../../domain/entities/Project';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <div className="bg-[#1a1c29] rounded-2xl border border-white/5 p-6 transition-all hover:border-white/10">
      {/* Header: Icon + Name + Action Buttons */}
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
          <h3 className="text-white text-xl font-bold">{project.nombre}</h3>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors flex flex-col items-center gap-1"
          >
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
            <span className="text-[10px] text-gray-400">Editar</span>
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors flex flex-col items-center gap-1"
          >
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
            <span className="text-[10px] text-gray-400 hover:text-red-400">
              Eliminar
            </span>
          </button>
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
                  className="w-full h-full object-cover"
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

          {/* Visibility badge */}
          <div className="flex items-center gap-1.5 text-[#9ca3af] text-xs mb-4">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {project.visibilidad === 'publico' ? (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
            {project.visibilidad === 'publico' ? 'Público' : 'Privado'}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {project.urlDemo && (
              <a
                href={project.urlDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#1a1c29] border border-white/10 rounded-xl py-3 text-white text-sm font-medium hover:border-[#6c63ff]/40 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                VER DEMO
              </a>
            )}
            {project.repositorios && project.repositorios.length > 0 && (
              <a
                href={project.repositorios[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#1a1c29] border border-white/10 rounded-xl py-3 text-white text-sm font-medium hover:border-[#6c63ff]/40 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                REPOSITORIO
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
