import { useParams } from 'react-router-dom';
import { usePortfolioPublic } from '../../application/usePortfolioPublic';
import PreviewBanner from '../components/PreviewBanner';
import type {
  PortfolioPublicData,
  PortfolioPublicSkill,
  PortfolioPublicSoftSkill,
  PortfolioPublicExperience,
  PortfolioPublicProject,
  PortfolioPublicFormacion,
  PortfolioPublicUser,
} from '../../domain/entities/PortfolioPublicData';
import type { TemplateSection } from '../../domain/entities/Template';

// ─── Themes ──────────────────────────────────────────────────────────────────

interface Theme {
  bg: string;
  surface: string;
  border: string;
  text: string;
  textSub: string;
  textMuted: string;
  accent: string;
  accentText: string;
  accentBg: string;
  badge: string;
  badgeText: string;
  navBg: string;
}

const THEMES: Record<string, Theme> = {
  dark: {
    bg: '#0a0c14',
    surface: '#171B28',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textSub: '#e5e7eb',
    textMuted: '#9ca3af',
    accent: '#7c6bec',
    accentText: '#b0a8f5',
    accentBg: 'rgba(124,107,236,0.12)',
    badge: 'rgba(255,255,255,0.06)',
    badgeText: '#9ca3af',
    navBg: 'rgba(10,12,20,0.92)',
  },
  light: {
    bg: '#f1f5f9',
    surface: '#ffffff',
    border: 'rgba(0,0,0,0.08)',
    text: '#111827',
    textSub: '#374151',
    textMuted: '#6b7280',
    accent: '#7c6bec',
    accentText: '#7c6bec',
    accentBg: 'rgba(124,107,236,0.08)',
    badge: '#f3f4f6',
    badgeText: '#374151',
    navBg: 'rgba(241,245,249,0.92)',
  },
  colorful: {
    bg: '#0f0524',
    surface: '#1a0a3d',
    border: 'rgba(249,115,22,0.2)',
    text: '#ffffff',
    textSub: '#e2d9ff',
    textMuted: '#a78bfa',
    accent: '#f97316',
    accentText: '#fb923c',
    accentBg: 'rgba(249,115,22,0.12)',
    badge: 'rgba(167,139,250,0.15)',
    badgeText: '#e2d9ff',
    navBg: 'rgba(15,5,36,0.92)',
  },
  brutalist: {
    bg: '#ffffff',
    surface: '#ffffff',
    border: '#000000',
    text: '#000000',
    textSub: '#000000',
    textMuted: '#000000',
    accent: '#ffde00', // Amarillo brutalista
    accentText: '#000000',
    accentBg: '#ff4d4d', // Rojo brutalista
    badge: '#ffffff',
    badgeText: '#000000',
    navBg: 'rgba(255,255,255,0.95)',
  },
};

const SKILL_LEVEL: Record<string, number> = {
  Básico: 20, Intermedio: 45, Avanzado: 70, Maestro: 85, Experto: 100,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ url, name, size = 80, accent }: { url?: string; name: string; size?: number; accent: string }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return url ? (
    <img src={url} alt={name} referrerPolicy="no-referrer"
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}` }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${accent}30`,
      border: `3px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: accent }}>
      {initials}
    </div>
  );
}

function SectionTitle({ text, t }: { text: string; t: Theme }) {
  const isBrutalist = t.border === '#000000';
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ 
        fontSize: isBrutalist ? 42 : 28, 
        fontWeight: 900, 
        color: t.text, 
        margin: 0, 
        letterSpacing: isBrutalist ? '-0.04em' : '-0.02em',
        textTransform: isBrutalist ? 'uppercase' : 'none',
        WebkitTextStroke: isBrutalist ? '1px black' : 'none'
      }}>
        {text}
      </h2>
      {!isBrutalist && <div style={{ width: 40, height: 3, background: t.accent, borderRadius: 4, marginTop: 8 }} />}
      {isBrutalist && <div style={{ width: '100%', height: 4, background: '#000', marginTop: 4 }} />}
    </div>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function HeroSection({ usuario, t }: { usuario: PortfolioPublicUser; t: Theme }) {
  const fullName = `${usuario.nombre} ${usuario.apellido}`.trim();
  const isBrutalist = t.border === '#000000';
  return (
    <section id="hero" style={{ padding: '100px 0 80px', textAlign: isBrutalist ? 'left' : 'center' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isBrutalist ? 'row-reverse' : 'column', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 40,
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          border: isBrutalist ? '4px solid #000' : 'none',
          padding: isBrutalist ? 8 : 0,
          background: isBrutalist ? t.accent : 'transparent',
          boxShadow: isBrutalist ? '12px 12px 0px #000' : 'none'
        }}>
          <Avatar url={usuario.avatarUrl} name={fullName} size={isBrutalist ? 180 : 100} accent={t.accent} />
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h1 style={{ 
            fontSize: isBrutalist ? 72 : 48, 
            fontWeight: 900, 
            color: t.text, 
            margin: 0, 
            letterSpacing: '-0.04em', 
            lineHeight: 0.9,
            textTransform: isBrutalist ? 'uppercase' : 'none'
          }}>
            {fullName}
          </h1>
          {usuario.profesion && (
            <div style={{ 
              display: isBrutalist ? 'inline-block' : 'block',
              background: isBrutalist ? '#000' : 'transparent',
              padding: isBrutalist ? '4px 12px' : 0,
              marginTop: 12
            }}>
              <p style={{ fontSize: 24, color: isBrutalist ? t.accent : t.accentText, fontWeight: 800, margin: 0 }}>
                {usuario.profesion}
              </p>
            </div>
          )}
          {usuario.descripcion && (
            <p style={{ 
              fontSize: 18, 
              color: t.textSub, 
              maxWidth: 600, 
              lineHeight: 1.6, 
              marginTop: 24,
              fontWeight: isBrutalist ? 600 : 400
            }}>
              {usuario.descripcion}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ usuario, t }: { usuario: PortfolioPublicUser; t: Theme }) {
  return (
    <section id="about" style={{ padding: '48px 0' }}>
      <SectionTitle text="Sobre mí" t={t} />
      <div style={{ 
        background: t.surface, 
        borderRadius: t.border === '#000000' ? 0 : 16, 
        padding: 32, 
        border: t.border === '#000000' ? '3px solid #000000' : `1px solid ${t.border}`,
        boxShadow: t.border === '#000000' ? '8px 8px 0px #000000' : 'none'
      }}>
        <p style={{ color: t.textSub, fontSize: 16, lineHeight: 1.8, margin: 0, fontWeight: t.border === '#000000' ? 600 : 400 }}>
          {usuario.descripcion || 'Sin descripción disponible.'}
        </p>
      </div>
    </section>
  );
}

function SkillsSection({ skills, t }: { skills: PortfolioPublicSkill[]; t: Theme }) {
  if (!skills.length) return null;
  return (
    <section id="skills" style={{ padding: '48px 0' }}>
      <SectionTitle text="Habilidades técnicas" t={t} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {skills.map((s) => {
          const pct = SKILL_LEVEL[s.level] ?? 50;
          const isBrutalist = t.border === '#000000';
          return (
            <div key={s.id} style={{ 
              background: isBrutalist ? t.accent : t.surface, 
              borderRadius: isBrutalist ? 0 : 12, 
              padding: '20px', 
              border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`,
              boxShadow: isBrutalist ? '6px 6px 0px #000' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#000', fontWeight: 800, fontSize: 14, textTransform: isBrutalist ? 'uppercase' : 'none' }}>{s.name}</span>
                <span style={{ color: isBrutalist ? '#000' : t.accentText, fontSize: 12, fontWeight: 700 }}>{s.level}</span>
              </div>
              <div style={{ height: isBrutalist ? 12 : 6, background: isBrutalist ? '#fff' : t.accentBg, borderRadius: isBrutalist ? 0 : 99, border: isBrutalist ? '2px solid #000' : 'none', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: isBrutalist ? t.accentBg : t.accent, borderRadius: 0,
                  transition: 'width 0.8s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SoftSkillsSection({ softSkills, t }: { softSkills: PortfolioPublicSoftSkill[]; t: Theme }) {
  if (!softSkills.length) return null;
  return (
    <section id="softskills" style={{ padding: '48px 0' }}>
      <SectionTitle text="Habilidades blandas" t={t} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {softSkills.map((s) => (
          <span key={s.id} style={{ padding: '8px 18px', borderRadius: 999, background: t.badge,
            color: t.badgeText, fontSize: 14, fontWeight: 600, border: `1px solid ${t.border}` }}>
            {s.nombreHabilidad}
          </span>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ experiencias, t }: { experiencias: PortfolioPublicExperience[]; t: Theme }) {
  if (!experiencias.length) return null;
  return (
    <section id="experience" style={{ padding: '48px 0' }}>
      <SectionTitle text="Experiencia" t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {experiencias.map((e, i) => {
          const isBrutalist = t.border === '#000000';
          return (
            <div key={i} style={{ 
              background: isBrutalist ? (i % 2 === 0 ? '#fff' : t.accent) : t.surface, 
              borderRadius: isBrutalist ? 0 : 16, 
              padding: '28px',
              border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`, 
              borderLeft: isBrutalist ? '3px solid #000' : `4px solid ${t.accent}`,
              boxShadow: isBrutalist ? '8px 8px 0px #000' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ color: '#000', fontWeight: 900, fontSize: 20, margin: 0, textTransform: isBrutalist ? 'uppercase' : 'none' }}>{e.cargo}</p>
                  <p style={{ color: isBrutalist ? '#000' : t.accentText, fontWeight: 700, fontSize: 15, margin: '4px 0 0' }}>{e.nombreEmpresa}</p>
                </div>
                <span style={{ color: isBrutalist ? '#000' : t.textMuted, fontSize: 13, fontWeight: isBrutalist ? 700 : 400 }}>
                  {e.fechaInicio} — {e.actualmenteTrabajando ? 'Presente' : (e.fechaFin ?? '')}
                </span>
              </div>
              {e.descripcion && (
                <p style={{ color: '#000', fontSize: 15, marginTop: 16, lineHeight: 1.7, fontWeight: isBrutalist ? 500 : 400 }}>{e.descripcion}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProjectsSection({ proyectos, t }: { proyectos: PortfolioPublicProject[]; t: Theme }) {
  if (!proyectos.length) return null;
  return (
    <section id="projects" style={{ padding: '48px 0' }}>
      <SectionTitle text="Proyectos" t={t} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
        {proyectos.map((p, i) => {
          const isBrutalist = t.border === '#000000';
          return (
            <div key={i} style={{ 
              background: t.surface, 
              borderRadius: isBrutalist ? 0 : 16, 
              padding: 0,
              border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`, 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden',
              boxShadow: isBrutalist ? '10px 10px 0px #000' : 'none'
            }}>
              <div style={{ height: 200, background: isBrutalist ? t.accentBg : t.accent, borderBottom: isBrutalist ? '3px solid #000' : 'none', position: 'relative' }}>
                {p.iconoUrl ? (
                  <img src={p.iconoUrl} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                )}
                {isBrutalist && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: '#000', color: '#fff', padding: '2px 8px', fontSize: 10, fontWeight: 800 }}>
                    PROJECT_{i+1}
                  </div>
                )}
              </div>
              <div style={{ padding: 24 }}>
                <p style={{ color: '#000', fontWeight: 900, fontSize: 18, margin: '0 0 12px', textTransform: isBrutalist ? 'uppercase' : 'none' }}>{p.nombre}</p>
                <p style={{ color: '#000', fontSize: 14, margin: '0 0 16px', lineHeight: 1.6, fontWeight: isBrutalist ? 600 : 400 }}>{p.descripcionCorta}</p>
                {p.tecnologias?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    {p.tecnologias.map((tech) => (
                      <span key={tech} style={{ 
                        padding: '4px 10px', 
                        borderRadius: isBrutalist ? 0 : 99, 
                        background: isBrutalist ? '#000' : t.accentBg,
                        color: isBrutalist ? t.accent : t.accentText, 
                        fontSize: 11, 
                        fontWeight: 800,
                        border: isBrutalist ? '1px solid #000' : 'none'
                      }}>{tech}</span>
                    ))}
                  </div>
                )}
                {p.urlDemo && (
                  <a href={p.urlDemo} target="_blank" rel="noopener noreferrer"
                    style={{ 
                      display: isBrutalist ? 'block' : 'inline',
                      textAlign: isBrutalist ? 'center' : 'left',
                      background: isBrutalist ? '#000' : 'transparent',
                      padding: isBrutalist ? '10px' : 0,
                      color: isBrutalist ? '#fff' : t.accent, 
                      fontSize: 13, 
                      fontWeight: 800, 
                      textDecoration: 'none',
                      textTransform: isBrutalist ? 'uppercase' : 'none'
                    }}>
                    {isBrutalist ? 'View Project' : 'Ver demo →'}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EducationSection({ formaciones, t }: { formaciones: PortfolioPublicFormacion[]; t: Theme }) {
  if (!formaciones.length) return null;
  const isBrutalist = t.border === '#000000';
  return (
    <section id="education" style={{ padding: '48px 0' }}>
      <SectionTitle text="Formación académica" t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {formaciones.map((f, i) => (
          <div key={i} style={{ 
            background: isBrutalist ? t.accentBg : t.surface, 
            borderRadius: isBrutalist ? 0 : 14, 
            padding: '24px 32px',
            border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`, 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 12,
            boxShadow: isBrutalist ? '6px 6px 0px #000' : 'none'
          }}>
            <div>
              <p style={{ color: '#000', fontWeight: 900, fontSize: 18, margin: 0, textTransform: isBrutalist ? 'uppercase' : 'none' }}>{f.carrera}</p>
              <p style={{ color: isBrutalist ? '#000' : t.accentText, fontSize: 15, margin: '6px 0 0', fontWeight: 700 }}>{f.institucion}</p>
              <span style={{ 
                fontSize: 12, 
                color: isBrutalist ? '#fff' : t.textMuted, 
                background: isBrutalist ? '#000' : t.badge,
                padding: '4px 12px', 
                borderRadius: isBrutalist ? 0 : 6, 
                marginTop: 10, 
                display: 'inline-block',
                fontWeight: 800
              }}>{f.nivel}</span>
            </div>
            <span style={{ color: '#000', fontSize: 13, alignSelf: 'flex-start', fontWeight: 700 }}>
              {f.fechaInicio} — {f.actualmenteEstudiando ? 'Presente' : (f.fechaFinalizacion ?? '')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ usuario, t }: { usuario: PortfolioPublicUser; t: Theme }) {
  const isBrutalist = t.border === '#000000';
  return (
    <section id="contact" style={{ padding: '80px 0', textAlign: 'center' }}>
      <SectionTitle text="Contacto" t={t} />
      <div style={{ 
        background: isBrutalist ? t.accent : t.surface, 
        borderRadius: isBrutalist ? 0 : 24, 
        padding: '60px 40px',
        border: isBrutalist ? '4px solid #000' : `1px solid ${t.border}`, 
        maxWidth: 540, 
        margin: '0 auto',
        boxShadow: isBrutalist ? '15px 15px 0px #000' : 'none'
      }}>
        <p style={{ color: '#000', fontSize: 18, marginBottom: 32, lineHeight: 1.7, fontWeight: 700 }}>
          ¿Interesado en trabajar juntos? No dudes en contactarme.
        </p>
        {usuario.email && (
          <a href={`mailto:${usuario.email}`}
            style={{ 
              display: 'inline-block', 
              padding: '16px 48px', 
              borderRadius: isBrutalist ? 0 : 999, 
              background: '#000',
              color: isBrutalist ? t.accent : '#fff', 
              fontWeight: 900, 
              textDecoration: 'none', 
              fontSize: 16,
              textTransform: isBrutalist ? 'uppercase' : 'none',
              border: isBrutalist ? '2px solid #000' : 'none'
            }}>
            {usuario.email}
          </a>
        )}
      </div>
    </section>
  );
}

// ─── Section router ───────────────────────────────────────────────────────────

function renderSection(section: TemplateSection, data: PortfolioPublicData, t: Theme) {
  switch (section.type) {
    case 'hero':     return <HeroSection key="hero" usuario={data.usuario} t={t} />;
    case 'about':    return <AboutSection key="about" usuario={data.usuario} t={t} />;
    case 'skills':   return <SkillsSection key="skills" skills={data.skills} t={t} />;
    case 'softskills': return <SoftSkillsSection key="softskills" softSkills={data.softSkills} t={t} />;
    case 'experience': return <ExperienceSection key="experience" experiencias={data.experiencias} t={t} />;
    case 'projects': return <ProjectsSection key="projects" proyectos={data.proyectos} t={t} />;
    case 'education': return <EducationSection key="education" formaciones={data.formaciones} t={t} />;
    case 'contact':  return <ContactSection key="contact" usuario={data.usuario} t={t} />;
    default:         return null;
  }
}

// ─── Skeleton / Error states ──────────────────────────────────────────────────

function LoadingState() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #7c6bec', borderTopColor: 'transparent',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Cargando portafolio…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <p style={{ color: '#f87171', fontSize: 16, fontWeight: 600 }}>No se pudo cargar el portafolio</p>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>{error}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PortfolioPublicPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>();

  const { data, loading, error } = usePortfolioPublic(portfolioId);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState error={error ?? 'Portafolio no encontrado'} />;

  const rawScheme = data.templateSchema?.colorScheme;
  const schemeKey = (typeof rawScheme === 'string' ? rawScheme : 'dark') as keyof typeof THEMES;
  const t = THEMES[schemeKey] ?? THEMES.dark;
  const font = data.templateSchema?.fontFamily ?? 'Inter';
  const isBrutalist = t.border === '#000000';

  const visibleSections = (data.templateSchema?.sections ?? [])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const isPrivate = data.visibilidad === 'PRIVADO';

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: `'${font}', system-ui, sans-serif`, color: t.text }}>
      {/* Banner de previsualización (visible cuando el portafolio es privado) */}
      {isPrivate && <PreviewBanner />}

      {/* Google Fonts */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800;900&display=swap`} />

      {/* Barra de navegación fija */}
      <header style={{ 
        position: 'sticky', 
        top: isPrivate ? 46 : 0, 
        zIndex: 100, 
        backdropFilter: isBrutalist ? 'none' : 'blur(16px)',
        background: isBrutalist ? t.accent : t.navBg, 
        borderBottom: isBrutalist ? '4px solid #000' : `1px solid ${t.border}` 
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 70,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: '#000', textTransform: isBrutalist ? 'uppercase' : 'none' }}>
            {data.nombre}
          </span>
          <nav style={{ display: 'flex', gap: 24 }}>
            {visibleSections.filter(s => s.type !== 'hero').slice(0, 5).map((s) => (
              <a key={s.type} href={`#${s.type}`}
                style={{ color: '#000', fontSize: 13, fontWeight: 800, textDecoration: 'none', textTransform: isBrutalist ? 'uppercase' : 'none' }}>
                {s.title || s.type}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        {visibleSections.map((section) => renderSection(section, data, t))}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ color: t.textMuted, fontSize: 12, margin: 0 }}>
          Portafolio creado con <span style={{ color: t.accent, fontWeight: 600 }}>Portly</span>
        </p>
      </footer>
    </div>
  );
}
