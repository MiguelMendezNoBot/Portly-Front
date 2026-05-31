import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type CSSProperties,
} from 'react';
import PreviewBanner from './PreviewBanner';
import type {
  PortfolioPublicData,
  PortfolioPublicUser,
  PortfolioPublicExperience,
  PortfolioPublicProject,
  PortfolioPublicFormacion,
} from '../../domain/entities/PortfolioPublicData';
import type { TemplateSection } from '../../domain/entities/Template';
import { TechIcon } from '../../../professional/presentation/components/Skills/icons/TechIcon';
import { BASE_URL } from '../../../../infrastructure/http/httpClient';
import heroFallback from '../../../../assets/templatesAssets/template1.jpg';

// ─── Theme ───────────────────────────────────────────────────────────────────

const T = {
  bg: '#050816',
  bgRgb: '5, 8, 22',
  bgCard: '#0f0f1a',
  purple: '#7c3aed',
  purpleLight: '#a78bfa',
  purpleDark: '#5b21b6',
  purpleGrad: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
  text: '#ffffff',
  textMuted: '#94a3b8',
  border: 'rgba(255,255,255,0.08)',
  cursor: '#22d3ee',
};

const HEADER_H = 64;
const SOCIAL_KEYS = [
  { key: 'github' as const, label: 'GitHub' },
  { key: 'linkedin' as const, label: 'LinkedIn' },
  { key: 'instagram' as const, label: 'Instagram' },
  { key: 'facebook' as const, label: 'Facebook' },
  { key: 'youtube' as const, label: 'YouTube' },
];

const H_SCROLL_CSS = `
  .la-red-hscroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .la-red-hscroll::-webkit-scrollbar {
    display: none;
  }
  .la-red-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .la-red-scroll::-webkit-scrollbar {
    display: none;
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return url;
}

function projectImages(p: PortfolioPublicProject): string[] {
  const imgs: string[] = [];
  const icon = resolveMediaUrl(p.iconoUrl);
  if (icon) imgs.push(icon);
  p.evidencias?.forEach((e) => {
    const u = resolveMediaUrl(e);
    if (u && !imgs.includes(u)) imgs.push(u);
  });
  return imgs;
}

function hasContactInfo(u: PortfolioPublicUser): boolean {
  return !!(
    u.email ||
    u.telefono ||
    u.github ||
    u.linkedin ||
    u.instagram ||
    u.facebook ||
    u.youtube
  );
}

function sectionHasContent(type: string, data: PortfolioPublicData): boolean {
  switch (type) {
    case 'hero':
      return !!(data.usuario.nombre || data.usuario.apellido);
    case 'about':
      return !!data.usuario.descripcion?.trim();
    case 'skills':
      return data.skills.length > 0;
    case 'softskills':
      return data.softSkills.length > 0;
    case 'experience':
      return data.experiencias.length > 0;
    case 'education':
      return data.formaciones.length > 0;
    case 'projects':
      return data.proyectos.length > 0;
    case 'contact':
      return hasContactInfo(data.usuario);
    default:
      return false;
  }
}

function resolveNavSections(
  schemaSections: TemplateSection[],
  data: PortfolioPublicData
): TemplateSection[] {
  return schemaSections
    .filter((s) => s.visible && s.type !== 'hero')
    .filter((s) => sectionHasContent(s.type, data))
    .sort((a, b) => a.order - b.order);
}

function formatNavLabel(title: string | undefined, type: string): string {
  const raw = (title || type).trim();
  if (!raw) return type;
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

function formatPeriod(
  start: string,
  end: string | null,
  current: boolean
): string {
  const fmt = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };
  const endLabel = current ? 'Present' : end ? fmt(end) : '';
  return `${fmt(start)} — ${endLabel}`.trim();
}

// ─── Custom cursor ───────────────────────────────────────────────────────────

type CursorMode = 'default' | 'plus' | 'large';

function CustomCursor({
  enabled,
  mode,
}: {
  enabled: boolean;
  mode: CursorMode;
}) {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = mode === 'large' ? 56 : mode === 'plus' ? 48 : 36;
  const dotSize = mode === 'large' ? 10 : 6;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderRadius: '50%',
          border: `1.5px solid ${T.cursor}`,
          opacity: 0.55,
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s, height 0.2s, margin 0.2s, opacity 0.2s',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: dotSize,
          height: dotSize,
          marginLeft: -dotSize / 2,
          marginTop: -dotSize / 2,
          borderRadius: mode === 'plus' ? 0 : '50%',
          background: mode === 'plus' ? 'transparent' : T.cursor,
          color: T.cursor,
          fontSize: mode === 'plus' ? 22 : 0,
          fontWeight: 300,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10000,
          transition: 'width 0.2s, height 0.2s, margin 0.2s',
        }}
      >
        {mode === 'plus' ? '+' : null}
      </div>
    </>
  );
}

function useCursorHandlers(setMode: (m: CursorMode) => void) {
  const projectEnter = useCallback(() => setMode('plus'), [setMode]);
  const projectLeave = useCallback(() => setMode('default'), [setMode]);
  const linkEnter = useCallback(() => setMode('large'), [setMode]);
  const linkLeave = useCallback(() => setMode('default'), [setMode]);
  return { projectEnter, projectLeave, linkEnter, linkLeave };
}

function hoverLink(handlers: ReturnType<typeof useCursorHandlers>) {
  return {
    onMouseEnter: handlers.linkEnter,
    onMouseLeave: handlers.linkLeave,
  };
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection({
  usuario,
  mobile,
  heroSkills,
  minHeight,
}: {
  usuario: PortfolioPublicUser;
  mobile: boolean;
  heroSkills: { id: string; name: string }[];
  minHeight: string;
}) {
  const fullName = [usuario.nombre, usuario.apellido].filter(Boolean).join(' ');
  const profession = usuario.profesion || 'Profesional';

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroFallback})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 25%, rgba(${T.bgRgb}, 0.35) 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, rgba(${T.bgRgb}, 0.12) 0%, rgba(${T.bgRgb}, 0.45) 75%, rgba(${T.bgRgb}, 1) 100%)`,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, padding: '0 24px', maxWidth: 900 }}>
        <h1
          style={{
            margin: 0,
            fontSize: mobile ? 'clamp(2rem, 10vw, 3rem)' : 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: T.text,
            lineHeight: 1.05,
          }}
        >
          {fullName || 'Tu Nombre'}
        </h1>
        <p
          style={{
            margin: '16px 0 0',
            fontSize: mobile ? 13 : 15,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: T.textMuted,
          }}
        >
          {profession}
        </p>

        {heroSkills.length > 0 && (
          <div
            style={{
              width: mobile ? '100%' : '70%',
              margin: mobile ? '28px auto 0' : '36px auto 0',
            }}
          >
            <div
              className="la-red-hscroll"
              style={{
                display: 'flex',
                gap: mobile ? 20 : 28,
                overflowX: 'auto',
                padding: '4px 0',
                justifyContent: heroSkills.length <= 4 ? 'center' : 'flex-start',
              }}
            >
              {heroSkills.map((s) => (
                <span
                  key={s.id}
                  style={{
                    flexShrink: 0,
                    fontSize: mobile ? 12 : 13,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: 'rgba(255,255,255,0.55)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 24,
          height: 38,
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 12,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 4,
            height: 8,
            background: T.purpleLight,
            borderRadius: 2,
            margin: '6px auto 0',
            animation: 'laRedScroll 1.5s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
}

function ExpertiseSection({
  skills,
  mobile,
}: {
  skills: PortfolioPublicData['skills'];
  mobile: boolean;
}) {
  if (!skills.length) return null;

  return (
    <section id="skills" style={{ padding: mobile ? '64px 20px' : '80px clamp(32px, 6vw, 96px)' }}>
      <h2
        style={{
          fontSize: mobile ? 28 : 36,
          fontWeight: 800,
          margin: '0 0 40px',
          color: T.text,
        }}
      >
        Habilidades técnicas
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mobile
            ? '1fr'
            : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {skills.map((s) => (
          <div
            key={s.id}
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 28,
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.purple;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ marginBottom: 16, width: 32, height: 32 }}>
              <TechIcon name={s.name} />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: T.purpleLight,
              }}
            >
              Habilidad técnica
            </p>
            <h3
              style={{
                margin: '8px 0 12px',
                fontSize: 20,
                fontWeight: 700,
                color: T.text,
              }}
            >
              {s.name}
            </h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: T.textMuted }}>
              Nivel: {s.level}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ text, mobile }: { text: string; mobile: boolean }) {
  return (
    <section id="about" style={{ padding: mobile ? '64px 20px' : '80px clamp(32px, 6vw, 96px)' }}>
      <h2 style={{ fontSize: mobile ? 28 : 36, fontWeight: 800, margin: '0 0 24px', color: T.text }}>
        Acerca de
      </h2>
      {text.split(/\n+/).filter(Boolean).map((p, i) => (
        <p
          key={i}
          style={{
            margin: i === 0 ? 0 : '16px 0 0',
            fontSize: 16,
            lineHeight: 1.75,
            color: T.textMuted,
            maxWidth: 720,
          }}
        >
          {p}
        </p>
      ))}
    </section>
  );
}

function ProjectCarousel({
  images,
  mobile,
}: {
  images: string[];
  mobile: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      4000
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        aspectRatio: mobile ? '16/10' : '16/9',
        maxWidth: 640,
        margin: mobile ? '32px auto 0' : '40px 0 0',
        border: `1px solid ${T.border}`,
        background: T.bgCard,
      }}
    >
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      ))}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Imagen ${i + 1}`}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? 20 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: i === index ? T.purpleLight : 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsSection({
  proyectos,
  mobile,
  cursorHandlers,
  onProjectClick,
}: {
  proyectos: PortfolioPublicProject[];
  mobile: boolean;
  cursorHandlers: ReturnType<typeof useCursorHandlers>;
  onProjectClick?: (id: number) => void;
}) {
  const [selected, setSelected] = useState<PortfolioPublicProject | null>(null);

  const carouselImages = useMemo(() => {
    const all = proyectos.flatMap(projectImages);
    return all.length > 0 ? all : [heroFallback];
  }, [proyectos]);

  const openProject = (p: PortfolioPublicProject) => {
    if (p.urlDemo) {
      window.open(p.urlDemo, '_blank', 'noopener,noreferrer');
      if (p.id) onProjectClick?.(p.id);
      return;
    }
    const hasDetail =
      (p.descripcionDetallada?.trim().length ?? 0) > 0 ||
      projectImages(p).length > 0 ||
      (p.enlaces?.length ?? 0) > 0;
    if (hasDetail) {
      setSelected(p);
      if (p.id) onProjectClick?.(p.id);
    }
  };

  return (
    <section id="projects" style={{ padding: mobile ? '64px 20px' : '80px clamp(32px, 6vw, 96px)' }}>
      <div
        style={{
          display: mobile ? 'block' : 'grid',
          gridTemplateColumns: mobile ? undefined : '1fr 1fr',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: mobile ? 36 : 48,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.1,
              color: T.text,
            }}
          >
            Mi
            <br />
            trabajo
          </h2>
          <p style={{ margin: '20px 0 0', fontSize: 15, lineHeight: 1.7, color: T.textMuted, maxWidth: 420 }}>
            Proyectos seleccionados que reflejan mi experiencia y capacidades
            técnicas.
          </p>
        </div>
        {!mobile && <ProjectCarousel images={carouselImages} mobile={false} />}
      </div>
      {mobile && <ProjectCarousel images={carouselImages} mobile />}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
          marginTop: 48,
        }}
      >
        {proyectos.map((p, i) => {
          const cover = projectImages(p)[0] || heroFallback;
          const clickable =
            !!p.urlDemo ||
            (p.descripcionDetallada?.trim().length ?? 0) > 0 ||
            projectImages(p).length > 0;

          return (
            <div
              key={p.id ?? i}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={() => clickable && openProject(p)}
              onKeyDown={(e) => {
                if (clickable && (e.key === 'Enter' || e.key === ' ')) openProject(p);
              }}
              onMouseEnter={clickable ? cursorHandlers.projectEnter : undefined}
              onMouseLeave={clickable ? cursorHandlers.projectLeave : undefined}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                cursor: clickable ? 'none' : 'default',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
            >
              <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                <img
                  src={cover}
                  alt={p.nombre}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>
                  {p.nombre}
                  {p.urlDemo && (
                    <span style={{ color: T.purpleLight, marginLeft: 6 }}>↗</span>
                  )}
                </h3>
                {p.descripcionCorta && (
                  <p style={{ margin: '8px 0 0', fontSize: 14, color: T.textMuted, lineHeight: 1.5 }}>
                    {p.descripcionCorta}
                  </p>
                )}
                {p.tecnologias.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {p.tecnologias.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: 11,
                          padding: '3px 10px',
                          borderRadius: 999,
                          background: 'rgba(124,58,237,0.2)',
                          color: T.purpleLight,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(5,8,22,0.9)',
            display: 'flex',
            alignItems: mobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: mobile ? 0 : 24,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: T.bgCard,
              borderRadius: mobile ? '16px 16px 0 0' : 16,
              border: `1px solid ${T.border}`,
              maxWidth: 560,
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              padding: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: T.text, fontSize: 20 }}>{selected.nombre}</h3>
            {projectImages(selected)[0] && (
              <img
                src={projectImages(selected)[0]}
                alt={selected.nombre}
                style={{
                  width: '100%',
                  marginTop: 16,
                  borderRadius: 8,
                  objectFit: 'cover',
                }}
              />
            )}
            {selected.descripcionDetallada && (
              <p style={{ color: T.textMuted, marginTop: 16, lineHeight: 1.6 }}>
                {selected.descripcionDetallada}
              </p>
            )}
            {selected.urlDemo && (
              <a
                href={selected.urlDemo}
                target="_blank"
                rel="noopener noreferrer"
                {...hoverLink(cursorHandlers)}
                style={{ color: T.purpleLight, marginTop: 16, display: 'inline-block' }}
              >
                Ver demo ↗
              </a>
            )}
            <button
              type="button"
              onClick={() => setSelected(null)}
              style={{
                marginTop: 20,
                width: mobile ? '100%' : 'auto',
                padding: '10px 20px',
                background: T.purple,
                border: 'none',
                borderRadius: 8,
                color: T.text,
                fontWeight: 600,
                cursor: 'none',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ExperienceSection({
  items,
  mobile,
  cursorHandlers,
  onExperienceClick,
}: {
  items: PortfolioPublicExperience[];
  mobile: boolean;
  cursorHandlers: ReturnType<typeof useCursorHandlers>;
  onExperienceClick?: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" style={{ padding: mobile ? '64px 20px' : '80px clamp(32px, 6vw, 96px)' }}>
      <h2
        style={{
          fontSize: mobile ? 32 : 40,
          fontWeight: 800,
          margin: '0 0 32px',
          color: T.text,
          lineHeight: 1.1,
        }}
      >
        Experiencia
        <br />
        profesional
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((exp, i) => {
          const id = exp.id?.toString() ?? String(i);
          const isOpen = open === i;
          return (
            <div key={id} style={{ borderRadius: 8, overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  onExperienceClick?.(id, exp.nombreEmpresa);
                }}
                {...(!mobile ? hoverLink(cursorHandlers) : {})}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: mobile ? '16px 18px' : '20px 28px',
                  background: T.purpleGrad,
                  border: 'none',
                  cursor: 'none',
                  textAlign: 'left',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: mobile ? 14 : 16, fontWeight: 700, color: T.text }}>
                    {exp.cargo}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>
                    {' '}
                    @ {exp.nombreEmpresa}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.8)',
                    flexShrink: 0,
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  {formatPeriod(exp.fechaInicio, exp.fechaFin, exp.actualmenteTrabajando)}
                </span>
              </button>
              {isOpen && (
                <div
                  style={{
                    padding: mobile ? '16px 18px' : '20px 28px',
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderTop: 'none',
                  }}
                >
                  {exp.descripcion && (
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.textMuted }}>
                      {exp.descripcion}
                    </p>
                  )}
                  {exp.funcionesPrincipales?.map((f, j) => (
                    <p key={j} style={{ margin: '8px 0 0', fontSize: 14, color: T.textMuted }}>
                      · {f}
                    </p>
                  ))}
                  {exp.correoJefe && (
                    <a
                      href={`mailto:${exp.correoJefe}`}
                      style={{ display: 'inline-block', marginTop: 12, color: T.purpleLight }}
                    >
                      {exp.correoJefe}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EducationSection({
  items,
  mobile,
}: {
  items: PortfolioPublicFormacion[];
  mobile: boolean;
}) {
  return (
    <section id="education" style={{ padding: mobile ? '64px 20px' : '80px clamp(32px, 6vw, 96px)' }}>
      <h2 style={{ fontSize: mobile ? 28 : 36, fontWeight: 800, margin: '0 0 32px', color: T.text }}>
        Formación académica
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((f, i) => (
          <div
            key={f.idFormacionAcademica ?? i}
            style={{
              padding: 24,
              borderRadius: 12,
              background: T.bgCard,
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>
                {f.carrera}
              </h3>
              <span style={{ fontSize: 13, color: T.textMuted, fontFamily: 'ui-monospace, monospace' }}>
                {formatPeriod(f.fechaInicio, f.fechaFinalizacion, f.actualmenteEstudiando)}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: T.purpleLight }}>{f.institucion}</p>
            {f.descripcion && (
              <p style={{ margin: '12px 0 0', fontSize: 14, color: T.textMuted, lineHeight: 1.6 }}>
                {f.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({
  usuario,
  mobile,
  cursorHandlers,
  onSocialClick,
}: {
  usuario: PortfolioPublicUser;
  mobile: boolean;
  cursorHandlers: ReturnType<typeof useCursorHandlers>;
  onSocialClick?: (name: string) => void;
}) {
  return (
    <section id="contact" style={{ padding: mobile ? '64px 20px 80px' : '80px clamp(32px, 6vw, 96px) 96px' }}>
      <h2 style={{ fontSize: mobile ? 28 : 36, fontWeight: 800, margin: '0 0 16px', color: T.text }}>
        Contacto
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 15, color: T.textMuted, maxWidth: 480 }}>
        ¿Tienes un proyecto interesante? Escríbeme o contáctame por mis redes.
      </p>
      {usuario.email && (
        <a
          href={`mailto:${usuario.email}`}
          {...hoverLink(cursorHandlers)}
          style={{
            display: 'inline-block',
            fontSize: 18,
            fontWeight: 600,
            color: T.purpleLight,
            textDecoration: 'none',
            marginBottom: 20,
            cursor: 'none',
          }}
        >
          {usuario.email}
        </a>
      )}
      {usuario.telefono && (
        <p style={{ margin: '0 0 16px', color: T.textMuted }}>{usuario.telefono}</p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {SOCIAL_KEYS.filter((s) => usuario[s.key]).map((s) => (
          <a
            key={s.key}
            href={usuario[s.key]}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSocialClick?.(s.label)}
            {...hoverLink(cursorHandlers)}
            style={{
              color: T.textMuted,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'none',
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

export interface LaRedProfesionalLayoutProps {
  data: PortfolioPublicData;
  isPrivate: boolean;
  font: string;
  visibleSections: TemplateSection[];
  isMobile: boolean;
  onProjectClick?: (id: number) => void;
  onExperienceClick?: (id: string, name: string) => void;
  onSocialClick?: (name: string) => void;
  reportButton?: React.ReactNode;
  reportModal?: React.ReactNode;
}

export default function LaRedProfesionalLayout({
  data,
  isPrivate,
  font,
  visibleSections,
  isMobile,
  onProjectClick,
  onExperienceClick,
  onSocialClick,
  reportButton,
  reportModal,
}: LaRedProfesionalLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const cursorHandlers = useCursorHandlers(setCursorMode);

  const navSections = useMemo(
    () =>
      resolveNavSections(visibleSections, data).filter(
        (s) => s.type !== 'softskills'
      ),
    [visibleSections, data]
  );

  const showHero = sectionHasContent('hero', data);
  const showSkillsSection = sectionHasContent('skills', data);
  const heroSkills = useMemo(
    () => [
      ...data.skills.map((s) => ({ id: `t-${s.id}`, name: s.name })),
      ...data.softSkills.map((s) => ({
        id: `s-${s.id}`,
        name: s.nombreHabilidad,
      })),
    ],
    [data.skills, data.softSkills]
  );

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      const container = scrollRef.current;
      if (!el || !container) return;
      const top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        16;
      container.scrollTo({ top, behavior: 'smooth' });
    },
    []
  );

  const rootCursor: CSSProperties = !isMobile ? { cursor: 'none' } : {};

  return (
    <div
      style={{
        ...rootCursor,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: T.bg,
        color: T.text,
        fontFamily: `'${font}', system-ui, sans-serif`,
        overflow: 'hidden',
      }}
    >
      {isPrivate && (
        <div style={{ flexShrink: 0 }}>
          <PreviewBanner />
        </div>
      )}

      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`}
      />
      <style>{`
        ${H_SCROLL_CSS}
        @keyframes laRedScroll {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
      `}</style>

      <CustomCursor enabled={!isMobile} mode={cursorMode} />

      {/* Fixed header */}
      <header
        style={{
          flexShrink: 0,
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 5vw, 48px)',
          borderBottom: `1px solid ${T.border}`,
          background: 'rgba(5,8,22,0.92)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
        }}
      >
        <button
          type="button"
          onClick={() => scrollTo('hero')}
          {...(!isMobile ? hoverLink(cursorHandlers) : {})}
          style={{
            background: 'none',
            border: 'none',
            color: T.text,
            fontSize: 16,
            fontWeight: 700,
            cursor: isMobile ? 'pointer' : 'none',
            padding: 0,
          }}
        >
          {[data.usuario.nombre, data.usuario.apellido].filter(Boolean).join(' ') || 'Portafolio'}
          <span style={{ color: T.purpleLight }}>.</span>
        </button>
        <nav
          className="la-red-hscroll"
          style={{
            display: 'flex',
            gap: isMobile ? 16 : 28,
            overflowX: 'auto',
            maxWidth: isMobile ? '60%' : undefined,
          }}
          aria-label="Navegación"
        >
          {navSections.map((s) => (
            <button
              key={s.type}
              type="button"
              onClick={() => scrollTo(s.type)}
              {...(!isMobile ? hoverLink(cursorHandlers) : {})}
              style={{
                background: 'none',
                border: 'none',
                color: T.textMuted,
                fontSize: isMobile ? 11 : 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: isMobile ? 'pointer' : 'none',
                padding: '4px 0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = T.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = T.textMuted;
              }}
            >
              {'// '}
              {formatNavLabel(s.title, s.type)}
            </button>
          ))}
        </nav>
      </header>

      {/* Scrollable body */}
      <div
        ref={scrollRef}
        className="la-red-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: T.bg,
        }}
      >
        {showHero && (
          <HeroSection
            usuario={data.usuario}
            mobile={isMobile}
            heroSkills={heroSkills}
            minHeight="100%"
          />
        )}

        {showSkillsSection && (
          <ExpertiseSection skills={data.skills} mobile={isMobile} />
        )}

        {sectionHasContent('about', data) && (
          <AboutSection text={data.usuario.descripcion!} mobile={isMobile} />
        )}

        {sectionHasContent('projects', data) && (
          <ProjectsSection
            proyectos={data.proyectos}
            mobile={isMobile}
            cursorHandlers={cursorHandlers}
            onProjectClick={onProjectClick}
          />
        )}

        {sectionHasContent('experience', data) && (
          <ExperienceSection
            items={data.experiencias}
            mobile={isMobile}
            cursorHandlers={cursorHandlers}
            onExperienceClick={onExperienceClick}
          />
        )}

        {sectionHasContent('education', data) && (
          <EducationSection items={data.formaciones} mobile={isMobile} />
        )}

        {sectionHasContent('contact', data) && (
          <ContactSection
            usuario={data.usuario}
            mobile={isMobile}
            cursorHandlers={cursorHandlers}
            onSocialClick={onSocialClick}
          />
        )}

        <footer
          style={{
            padding: '32px clamp(20px, 5vw, 48px)',
            borderTop: `1px solid ${T.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>
            Portafolio creado con{' '}
            <span style={{ color: T.purpleLight, fontWeight: 600 }}>Portly</span>
          </p>
        </footer>
      </div>

      {reportButton}
      {reportModal}
    </div>
  );
}
