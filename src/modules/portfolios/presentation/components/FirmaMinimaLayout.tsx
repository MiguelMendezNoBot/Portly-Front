import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

// ─── Palette (Brittany Chiang–inspired) ──────────────────────────────────────

const C = {
  bg: '#0a192f',
  surface: '#112240',
  lightest: '#ccd6f6',
  light: '#a8b2d1',
  slate: '#8892b0',
  green: '#64ffda',
  greenTint: 'rgba(100,255,218,0.1)',
};

const SOCIAL_KEYS = [
  { key: 'github' as const, label: 'GitHub' },
  { key: 'linkedin' as const, label: 'LinkedIn' },
  { key: 'instagram' as const, label: 'Instagram' },
  { key: 'facebook' as const, label: 'Facebook' },
  { key: 'youtube' as const, label: 'YouTube' },
];

const SECTION_PAD = (mobile: boolean) => (mobile ? 32 : 48);
const SECTION_RULE = '1px solid rgba(136, 146, 176, 0.18)';
const PREVIEW_BANNER_H = 46;

function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return url;
}

function projectCover(p: PortfolioPublicProject): string | null {
  return (
    resolveMediaUrl(p.iconoUrl) ||
    p.evidencias?.map(resolveMediaUrl).find(Boolean) ||
    null
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function resolveSections(
  schemaSections: TemplateSection[],
  data: PortfolioPublicData
): TemplateSection[] {
  return schemaSections
    .filter((s) => s.visible && s.type !== 'hero')
    .filter((s) => sectionHasContent(s.type, data))
    .sort((a, b) => a.order - b.order);
}

function timelineGrid(mobile: boolean): React.CSSProperties {
  return mobile
    ? { display: 'flex', flexDirection: 'column', gap: 8 }
    : {
        display: 'grid',
        gridTemplateColumns: 'minmax(100px, 140px) 1fr',
        gap: '8px 24px',
      };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavLink({
  section,
  active,
  onClick,
  compact,
}: {
  section: TemplateSection;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const label = (section.title || section.type).toUpperCase();

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          flexShrink: 0,
          background: active ? C.greenTint : 'transparent',
          border: `1px solid ${active ? C.green : 'rgba(136,146,176,0.3)'}`,
          borderRadius: 999,
          padding: '6px 14px',
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: active ? C.green : C.slate,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 0',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          height: 1,
          background: active ? C.green : C.slate,
          width: active ? 48 : 32,
          transition: 'width 0.2s, background 0.2s',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: active ? C.lightest : C.slate,
          transition: 'color 0.2s',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function MobileSectionNav({
  sections,
  activeId,
  onNavigate,
  topOffset,
}: {
  sections: TemplateSection[];
  activeId: string;
  onNavigate: (id: string) => void;
  topOffset: number;
}) {
  return (
    <nav
      aria-label="Secciones del portafolio"
      style={{
        position: 'sticky',
        top: topOffset,
        zIndex: 50,
        margin: '0 -20px 24px',
        padding: '12px 20px',
        background: 'rgba(10,25,47,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(100,255,218,0.08)',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      {sections.map((s) => (
        <NavLink
          key={s.type}
          section={s}
          active={activeId === s.type}
          onClick={() => onNavigate(s.type)}
          compact
        />
      ))}
    </nav>
  );
}

function TagPill({ label, mobile }: { label: string; mobile?: boolean }) {
  return (
    <span
      style={{
        fontSize: mobile ? 11 : 12,
        fontWeight: 500,
        color: C.green,
        background: C.greenTint,
        padding: mobile ? '3px 10px' : '4px 12px',
        borderRadius: 999,
      }}
    >
      {label}
    </span>
  );
}

function ExternalLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      style={{
        color: C.lightest,
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = C.green;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = C.lightest;
      }}
    >
      {children}
      <span style={{ fontSize: 12, opacity: 0.7 }}>↗</span>
    </a>
  );
}

// ─── Section renderers ───────────────────────────────────────────────────────

function SectionShell({
  children,
  isLast,
  mobile,
}: {
  children: React.ReactNode;
  isLast: boolean;
  mobile: boolean;
}) {
  return (
    <div
      style={{
        paddingTop: SECTION_PAD(mobile),
        paddingBottom: SECTION_PAD(mobile),
        borderBottom: isLast ? 'none' : SECTION_RULE,
      }}
    >
      {children}
    </div>
  );
}

function AboutBlock({ text, mobile }: { text: string; mobile: boolean }) {
  const paragraphs = text.split(/\n+/).filter(Boolean);
  return (
    <section id="about">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            color: C.slate,
            fontSize: mobile ? 15 : 16,
            lineHeight: 1.7,
            margin: i === 0 ? 0 : '16px 0 0',
          }}
        >
          {p}
        </p>
      ))}
    </section>
  );
}

function ExperienceBlock({
  items,
  mobile,
  onExperienceClick,
}: {
  items: PortfolioPublicExperience[];
  mobile: boolean;
  onExperienceClick?: (id: string, name: string) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="experience">
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 32 }}>
        {items.map((exp, i) => {
          const id = exp.id?.toString() ?? String(i);
          const hasExtra =
            (exp.funcionesPrincipales?.length ?? 0) > 0 ||
            (exp.logros?.length ?? 0) > 0;
          const isOpen = expanded === i;

          return (
            <div key={id} style={timelineGrid(mobile)}>
              <div
                style={{
                  fontSize: mobile ? 12 : 13,
                  fontWeight: 500,
                  color: C.slate,
                  paddingTop: mobile ? 0 : 4,
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {formatPeriod(
                  exp.fechaInicio,
                  exp.fechaFin,
                  exp.actualmenteTrabajando
                )}
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: mobile ? 15 : 16,
                    fontWeight: 600,
                    color: C.lightest,
                    lineHeight: 1.4,
                  }}
                >
                  {exp.cargo}
                  <span style={{ color: C.slate, fontWeight: 400 }}>
                    {' '}
                    · {exp.nombreEmpresa}
                  </span>
                </h3>
                {exp.modalidadTrabajo && (
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: C.slate }}>
                    {exp.modalidadTrabajo}
                  </p>
                )}
                {exp.descripcion && (
                  <p
                    style={{
                      margin: '12px 0 0',
                      fontSize: mobile ? 14 : 15,
                      lineHeight: 1.6,
                      color: C.slate,
                    }}
                  >
                    {exp.descripcion}
                  </p>
                )}
                {hasExtra && (
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(isOpen ? null : i);
                      onExperienceClick?.(id, exp.nombreEmpresa);
                    }}
                    style={{
                      marginTop: 12,
                      background: 'none',
                      border: 'none',
                      color: C.green,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 0',
                      minHeight: 44,
                    }}
                  >
                    {isOpen ? 'Ocultar detalle ↑' : 'Ver detalle ↓'}
                  </button>
                )}
                {isOpen && (
                  <div style={{ marginTop: 12 }}>
                    {exp.funcionesPrincipales?.map((f, j) => (
                      <p
                        key={j}
                        style={{
                          margin: '4px 0',
                          fontSize: 14,
                          color: C.slate,
                          paddingLeft: 12,
                          borderLeft: `2px solid ${C.green}`,
                        }}
                      >
                        {f}
                      </p>
                    ))}
                    {exp.logros?.map((l, j) => (
                      <p
                        key={j}
                        style={{
                          margin: '4px 0',
                          fontSize: 14,
                          color: C.slate,
                          paddingLeft: 12,
                          borderLeft: `2px solid ${C.surface}`,
                        }}
                      >
                        {l}
                      </p>
                    ))}
                    {exp.correoJefe && (
                      <a
                        href={`mailto:${exp.correoJefe}`}
                        style={{
                          display: 'inline-block',
                          marginTop: 8,
                          fontSize: 13,
                          color: C.green,
                          textDecoration: 'none',
                          padding: '4px 0',
                        }}
                      >
                        {exp.correoJefe}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProjectsBlock({
  items,
  mobile,
  onProjectClick,
}: {
  items: PortfolioPublicProject[];
  mobile: boolean;
  onProjectClick?: (id: number) => void;
}) {
  const [selected, setSelected] = useState<PortfolioPublicProject | null>(null);

  const openProject = (p: PortfolioPublicProject) => {
    if (p.urlDemo) {
      window.open(p.urlDemo, '_blank', 'noopener,noreferrer');
      if (p.id) onProjectClick?.(p.id);
      return;
    }
    const hasDetail =
      (p.descripcionDetallada?.trim().length ?? 0) > 0 ||
      (p.evidencias?.length ?? 0) > 0 ||
      (p.enlaces?.length ?? 0) > 0;
    if (hasDetail) {
      setSelected(p);
      if (p.id) onProjectClick?.(p.id);
    }
  };

  return (
    <section id="projects">
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 32 : 48 }}>
        {items.map((p, i) => {
          const cover = projectCover(p);
          const hasDetail =
            (p.descripcionDetallada?.trim().length ?? 0) > 0 ||
            (p.evidencias?.length ?? 0) > 0 ||
            (p.enlaces?.length ?? 0) > 0;
          const clickable = !!p.urlDemo || hasDetail;

          return (
            <div
              key={p.id ?? i}
              onClick={() => clickable && openProject(p)}
              style={{
                display: 'grid',
                gridTemplateColumns: mobile
                  ? '1fr'
                  : cover
                    ? 'minmax(0, 1fr) 220px'
                    : '1fr',
                gap: mobile ? 12 : 24,
                alignItems: mobile ? 'stretch' : 'center',
                cursor: clickable ? 'pointer' : 'default',
                borderRadius: 4,
                padding: 8,
                margin: -8,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (clickable && !mobile)
                  e.currentTarget.style.background = 'rgba(100,255,218,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ minWidth: 0, order: mobile ? 2 : 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: mobile ? 15 : 16,
                    fontWeight: 600,
                    color: C.lightest,
                    lineHeight: 1.4,
                  }}
                >
                  {p.nombre}
                  {p.urlDemo && (
                    <span style={{ color: C.green, marginLeft: 6, fontSize: 14 }}>
                      ↗
                    </span>
                  )}
                </h3>
                {p.descripcionCorta && (
                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: mobile ? 14 : 15,
                      lineHeight: 1.6,
                      color: C.slate,
                    }}
                  >
                    {p.descripcionCorta}
                  </p>
                )}
                {p.tecnologias.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    {p.tecnologias.map((tech) => (
                      <TagPill key={tech} label={tech} mobile={mobile} />
                    ))}
                  </div>
                )}
                {p.enlaces?.map((en, j) => (
                  <div key={j} style={{ marginTop: 8 }}>
                    <ExternalLink href={en.url}>{en.titulo}</ExternalLink>
                  </div>
                ))}
              </div>
              {cover && (
                <div
                  style={{
                    order: mobile ? 1 : 1,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid rgba(100,255,218,0.15)',
                    aspectRatio: '16/10',
                    width: mobile ? '100%' : 220,
                    maxWidth: '100%',
                    flexShrink: 0,
                    background: C.surface,
                  }}
                >
                  <img
                    src={cover}
                    alt={p.nombre}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(10,25,47,0.85)',
            display: 'flex',
            alignItems: mobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: mobile ? 0 : 24,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: mobile ? '16px 16px 0 0' : 8,
              border: `1px solid rgba(100,255,218,0.2)`,
              maxWidth: 560,
              width: '100%',
              maxHeight: mobile ? '85vh' : '80vh',
              overflow: 'auto',
              padding: mobile ? '20px 20px 28px' : 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: C.lightest, fontSize: mobile ? 18 : 20 }}>
              {selected.nombre}
            </h3>
            {(projectCover(selected) ||
              selected.evidencias?.map(resolveMediaUrl).find(Boolean)) && (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 6,
                  overflow: 'hidden',
                  border: '1px solid rgba(100,255,218,0.15)',
                }}
              >
                <img
                  src={
                    projectCover(selected) ||
                    selected.evidencias!.map(resolveMediaUrl).find(Boolean)!
                  }
                  alt={selected.nombre}
                  style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                />
              </div>
            )}
            {selected.descripcionDetallada && (
              <p
                style={{
                  color: C.slate,
                  fontSize: 15,
                  lineHeight: 1.6,
                  marginTop: 12,
                }}
              >
                {selected.descripcionDetallada}
              </p>
            )}
            {selected.urlDemo && (
              <div style={{ marginTop: 16 }}>
                <ExternalLink href={selected.urlDemo}>Ver demo</ExternalLink>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSelected(null)}
              style={{
                marginTop: 20,
                background: 'none',
                border: `1px solid ${C.slate}`,
                color: C.slate,
                padding: '10px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 13,
                width: mobile ? '100%' : 'auto',
                minHeight: 44,
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

function SkillsBlock({
  skills,
  mobile,
}: {
  skills: PortfolioPublicData['skills'];
  mobile: boolean;
}) {
  return (
    <section id="skills">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: mobile ? 8 : 10 }}>
        {skills.map((s) => (
          <div
            key={s.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: mobile ? '6px 12px' : '8px 14px',
              borderRadius: 6,
              background: C.surface,
              border: '1px solid rgba(100,255,218,0.12)',
              maxWidth: '100%',
            }}
          >
            <div
              className="w-5 h-5 flex items-center justify-center"
              style={{ flexShrink: 0 }}
            >
              <TechIcon name={s.name} />
            </div>
            <span
              style={{
                color: C.lightest,
                fontSize: mobile ? 13 : 14,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {s.name}
            </span>
            <span style={{ color: C.green, fontSize: 12, flexShrink: 0 }}>
              {s.level}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SoftSkillsBlock({
  items,
  mobile,
}: {
  items: PortfolioPublicData['softSkills'];
  mobile: boolean;
}) {
  return (
    <section id="softskills">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: mobile ? 8 : 10 }}>
        {items.map((s) => (
          <TagPill key={s.id} label={s.nombreHabilidad} mobile={mobile} />
        ))}
      </div>
    </section>
  );
}

function EducationBlock({
  items,
  mobile,
}: {
  items: PortfolioPublicFormacion[];
  mobile: boolean;
}) {
  return (
    <section id="education">
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 32 }}>
        {items.map((f, i) => (
          <div key={f.idFormacionAcademica ?? i} style={timelineGrid(mobile)}>
            <div
              style={{
                fontSize: mobile ? 12 : 13,
                fontWeight: 500,
                color: C.slate,
                paddingTop: mobile ? 0 : 4,
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              {formatPeriod(
                f.fechaInicio,
                f.fechaFinalizacion,
                f.actualmenteEstudiando
              )}
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: mobile ? 15 : 16,
                  fontWeight: 600,
                  color: C.lightest,
                  lineHeight: 1.4,
                }}
              >
                {f.carrera}
                <span style={{ color: C.slate, fontWeight: 400 }}>
                  {' '}
                  · {f.institucion}
                </span>
              </h3>
              {f.nivel && (
                <p style={{ margin: '4px 0 0', fontSize: 13, color: C.green }}>
                  {f.nivel}
                </p>
              )}
              {f.descripcion && (
                <p
                  style={{
                    margin: '12px 0 0',
                    fontSize: mobile ? 14 : 15,
                    lineHeight: 1.6,
                    color: C.slate,
                  }}
                >
                  {f.descripcion}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactBlock({
  usuario,
  mobile,
  onSocialClick,
}: {
  usuario: PortfolioPublicUser;
  mobile: boolean;
  onSocialClick?: (name: string) => void;
}) {
  return (
    <section id="contact">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {usuario.email && (
          <a
            href={`mailto:${usuario.email}`}
            style={{
              color: C.green,
              fontSize: mobile ? 14 : 15,
              textDecoration: 'none',
              wordBreak: 'break-all',
            }}
          >
            {usuario.email}
          </a>
        )}
        {usuario.telefono && (
          <a
            href={`tel:${usuario.telefono.replace(/\s/g, '')}`}
            style={{ color: C.slate, fontSize: 15, textDecoration: 'none' }}
          >
            {usuario.telefono}
          </a>
        )}
        {usuario.pais && (
          <span style={{ color: C.slate, fontSize: 15 }}>{usuario.pais}</span>
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: mobile ? 12 : 16,
            marginTop: 8,
          }}
        >
          {SOCIAL_KEYS.filter((s) => usuario[s.key]).map((s) => (
            <ExternalLink
              key={s.key}
              href={usuario[s.key]!}
              onClick={() => onSocialClick?.(s.label)}
            >
              {s.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderContentSection(
  section: TemplateSection,
  data: PortfolioPublicData,
  mobile: boolean,
  handlers: {
    onProjectClick?: (id: number) => void;
    onExperienceClick?: (id: string, name: string) => void;
    onSocialClick?: (name: string) => void;
  }
) {
  switch (section.type) {
    case 'about':
      return <AboutBlock text={data.usuario.descripcion!} mobile={mobile} />;
    case 'experience':
      return (
        <ExperienceBlock
          items={data.experiencias}
          mobile={mobile}
          onExperienceClick={handlers.onExperienceClick}
        />
      );
    case 'projects':
      return (
        <ProjectsBlock
          items={data.proyectos}
          mobile={mobile}
          onProjectClick={handlers.onProjectClick}
        />
      );
    case 'skills':
      return <SkillsBlock skills={data.skills} mobile={mobile} />;
    case 'softskills':
      return <SoftSkillsBlock items={data.softSkills} mobile={mobile} />;
    case 'education':
      return <EducationBlock items={data.formaciones} mobile={mobile} />;
    case 'contact':
      return (
        <ContactBlock
          usuario={data.usuario}
          mobile={mobile}
          onSocialClick={handlers.onSocialClick}
        />
      );
    default:
      return null;
  }
}

// ─── Main layout ─────────────────────────────────────────────────────────────

export interface FirmaMinimaLayoutProps {
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

export default function FirmaMinimaLayout({
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
}: FirmaMinimaLayoutProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState('');
  const scrollContainerRef = useRef<HTMLElement>(null);

  const contentSections = useMemo(
    () => resolveSections(visibleSections, data),
    [visibleSections, data]
  );

  const { usuario } = data;
  const fullName = [usuario.nombre, usuario.apellido].filter(Boolean).join(' ');
  const tagline = usuario.profesion
    ? `Construyo experiencias accesibles y de calidad como ${usuario.profesion.toLowerCase()}.`
    : 'Construyo experiencias accesibles y de calidad para la web.';

  const socialLinks = SOCIAL_KEYS.filter((s) => usuario[s.key]);
  const mobileNavTop = isPrivate ? PREVIEW_BANNER_H : 0;
  const desktopViewportH = isPrivate
    ? `calc(100vh - ${PREVIEW_BANNER_H}px)`
    : '100vh';

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (isMobile) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      const container = scrollContainerRef.current;
      if (!container) return;
      const top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        32;
      container.scrollTo({ top, behavior: 'smooth' });
    },
    [isMobile]
  );

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) =>
      setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [isMobile]);

  useEffect(() => {
    if (!contentSections.length) return;
    const ids = contentSections.map((s) => s.type);
    const root = isMobile ? null : scrollContainerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      {
        root,
        rootMargin: isMobile ? '-30% 0px -50% 0px' : '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5],
      }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    if (ids[0]) setActiveId(ids[0]);
    return () => observer.disconnect();
  }, [contentSections, isMobile]);

  const handlers = { onProjectClick, onExperienceClick, onSocialClick };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.light,
        fontFamily: `'${font}', system-ui, sans-serif`,
        position: 'relative',
        overflowX: 'hidden',
        overflowY: isMobile ? undefined : 'hidden',
        height: isMobile ? undefined : '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isPrivate && <PreviewBanner />}

      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`}
      />

      <style>{`
        .firma-minima-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .firma-minima-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {!isMobile && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(100,255,218,0.07), transparent 40%)`,
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          flex: isMobile ? undefined : 1,
          minHeight: isMobile ? undefined : 0,
          height: isMobile ? undefined : desktopViewportH,
          overflow: isMobile ? undefined : 'hidden',
          display: isMobile ? 'block' : 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(260px, 30%) minmax(0, 1fr)',
          gap: isMobile ? 0 : '0 clamp(48px, 6vw, 96px)',
          padding: isMobile ? '0 20px 48px' : '0 clamp(32px, 6vw, 96px)',
          boxSizing: 'border-box',
        }}
      >
        <aside
          style={{
            overflow: 'hidden',
            height: isMobile ? 'auto' : '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            paddingTop: isMobile ? 32 : 48,
            paddingBottom: isMobile ? 16 : 48,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? 32 : 44,
                fontWeight: 700,
                color: C.lightest,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {fullName || 'Tu nombre'}
            </h1>
            {usuario.profesion && (
              <h2
                style={{
                  margin: '10px 0 0',
                  fontSize: isMobile ? 17 : 20,
                  fontWeight: 600,
                  color: C.lightest,
                }}
              >
                {usuario.profesion}
              </h2>
            )}
            <p
              style={{
                margin: '16px 0 0',
                fontSize: isMobile ? 14 : 15,
                lineHeight: 1.6,
                color: C.slate,
                maxWidth: isMobile ? '100%' : 280,
              }}
            >
              {tagline}
            </p>

            {contentSections.length > 0 && !isMobile && (
              <nav
                style={{
                  marginTop: 40,
                  display: 'flex',
                  flexDirection: 'column',
                }}
                aria-label="Secciones del portafolio"
              >
                {contentSections.map((s) => (
                  <NavLink
                    key={s.type}
                    section={s}
                    active={activeId === s.type}
                    onClick={() => scrollTo(s.type)}
                  />
                ))}
              </nav>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: isMobile ? 12 : 20,
                marginTop: isMobile ? 20 : 0,
              }}
            >
              {socialLinks.map((s) => (
                <a
                  key={s.key}
                  href={usuario[s.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  onClick={() => onSocialClick?.(s.label)}
                  style={{
                    color: C.slate,
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: isMobile ? '6px 0' : 0,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.green;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.slate;
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </aside>

        <main
          ref={scrollContainerRef}
          className={isMobile ? undefined : 'firma-minima-scroll'}
          style={{
            paddingTop: isMobile ? 8 : 48,
            paddingBottom: isMobile ? 48 : 64,
            minWidth: 0,
            height: isMobile ? undefined : '100%',
            overflowY: isMobile ? undefined : 'auto',
          }}
        >
          {isMobile && contentSections.length > 0 && (
            <MobileSectionNav
              sections={contentSections}
              activeId={activeId}
              onNavigate={scrollTo}
              topOffset={mobileNavTop}
            />
          )}

          {contentSections.length === 0 ? (
            <p style={{ color: C.slate, fontSize: isMobile ? 15 : 16 }}>
              Este portafolio aún no tiene contenido visible. Completa tu perfil
              profesional para mostrar tus secciones aquí.
            </p>
          ) : (
            contentSections.map((section, index) => (
              <SectionShell
                key={section.type}
                isLast={index === contentSections.length - 1}
                mobile={isMobile}
              >
                {renderContentSection(section, data, isMobile, handlers)}
              </SectionShell>
            ))
          )}

          <footer
            style={{
              marginTop: isMobile ? 32 : 16,
              paddingTop: 24,
              borderTop: SECTION_RULE,
            }}
          >
            <p style={{ margin: 0, fontSize: 13, color: C.slate }}>
              Portafolio creado con{' '}
              <span style={{ color: C.green, fontWeight: 600 }}>Portly</span>
            </p>
          </footer>
        </main>
      </div>

      {reportButton}
      {reportModal}
    </div>
  );
}
