import { useState } from 'react';
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

const RESPONSIVE_CSS = `
  .portfolio-wrapper {
    box-sizing: border-box;
    overflow-x: hidden;
    width: 100%;
  }
  .portfolio-nav {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 4px;
  }
  /* Hide scrollbar for nav */
  .portfolio-nav::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    .portfolio-header-content {
      flex-direction: column !important;
      gap: 12px !important;
      height: auto !important;
      padding: 12px 24px !important;
      align-items: flex-start !important;
    }
    .portfolio-hero-container {
      flex-direction: column !important;
      text-align: center !important;
    }
    .portfolio-hero-title {
      font-size: 38px !important;
    }
    .portfolio-hero-title.brutalist {
      font-size: 46px !important;
    }
    .portfolio-hero-prof {
      font-size: 18px !important;
    }
    .portfolio-hero-info {
      justify-content: center !important;
    }
    .portfolio-hero-desc {
      font-size: 16px !important;
    }
    .portfolio-section-padding {
      padding: 32px 0 !important;
    }
    .portfolio-grid-2 {
      grid-template-columns: 1fr !important;
    }
    .portfolio-card {
      padding: 20px !important;
    }
    .portfolio-modal {
      padding: 24px 20px !important;
      max-height: 90vh !important;
      margin: 16px;
    }
    .portfolio-experience-item {
      padding: 20px !important;
    }
    .portfolio-education-item {
      padding: 20px 24px !important;
    }
    .portfolio-contact-box {
      padding: 32px 20px !important;
    }
    .portfolio-contact-btn {
      padding: 12px 32px !important;
      font-size: 14px !important;
    }
    .portfolio-main {
      padding: 0 16px 60px !important;
    }
    .portfolio-avatar {
      width: 120px !important;
      height: 120px !important;
    }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ url, name, size = 80, accent }: { url?: string; name: string; size?: number; accent: string }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return url ? (
    <img src={url} alt={name} referrerPolicy="no-referrer" className="portfolio-avatar"
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}` }} />
  ) : (
    <div className="portfolio-avatar" style={{ width: size, height: size, borderRadius: '50%', background: `${accent}30`,
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
      <h2 className="portfolio-section-title" style={{ 
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

// ─── Social icons ─────────────────────────────────────────────────────────────

const SOCIAL_DEFS = [
  {
    key: 'linkedin' as const,
    label: 'LinkedIn',
    color: '#0a66c2',
    path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
  },
  {
    key: 'github' as const,
    label: 'GitHub',
    color: '#333333',
    path: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z',
  },
  {
    key: 'instagram' as const,
    label: 'Instagram',
    color: '#e1306c',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z',
  },
  {
    key: 'facebook' as const,
    label: 'Facebook',
    color: '#1877f2',
    path: 'M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z',
  },
  {
    key: 'youtube' as const,
    label: 'YouTube',
    color: '#ff0000',
    path: 'M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z',
  },
];

function SocialIcons({ usuario, t, justify = 'center' }: { usuario: PortfolioPublicUser; t: Theme; justify?: string }) {
  const isBrutalist = t.border === '#000000';
  const links = SOCIAL_DEFS.filter((s) => usuario[s.key]);
  if (!links.length) return null;
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: justify }}>
      {links.map((s) => (
        <a
          key={s.key}
          href={usuario[s.key] as string}
          target="_blank"
          rel="noopener noreferrer"
          title={s.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: isBrutalist ? 0 : '50%',
            background: isBrutalist ? t.accent : `${s.color}18`,
            border: isBrutalist ? '2px solid #000' : `1px solid ${s.color}40`,
            color: isBrutalist ? '#000' : s.color,
            textDecoration: 'none',
            flexShrink: 0,
            boxShadow: isBrutalist ? '3px 3px 0 #000' : 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function HeroSection({ usuario, t }: { usuario: PortfolioPublicUser; t: Theme }) {
  const fullName = `${usuario.nombre} ${usuario.apellido}`.trim();
  const isBrutalist = t.border === '#000000';
  const align = isBrutalist ? 'flex-start' : 'center';
  return (
    <section id="hero" className="portfolio-section-padding" style={{ padding: '100px 0 80px', textAlign: isBrutalist ? 'left' : 'center' }}>
      <div className="portfolio-hero-container" style={{
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
          <h1 className={`portfolio-hero-title ${isBrutalist ? 'brutalist' : ''}`} style={{
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
              <p className="portfolio-hero-prof" style={{ fontSize: 24, color: isBrutalist ? t.accent : t.accentText, fontWeight: 800, margin: 0 }}>
                {usuario.profesion}
              </p>
            </div>
          )}
          {(usuario.pais || usuario.telefono) && (
            <div className="portfolio-hero-info" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, justifyContent: align }}>
              {usuario.pais && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: isBrutalist ? '#000' : t.textMuted, fontSize: 14, fontWeight: isBrutalist ? 700 : 400 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {usuario.pais}
                </span>
              )}
              {usuario.telefono && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: isBrutalist ? '#000' : t.textMuted, fontSize: 14, fontWeight: isBrutalist ? 700 : 400 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  {usuario.telefono}
                </span>
              )}
            </div>
          )}
          {usuario.descripcion && (
            <p className="portfolio-hero-desc" style={{
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
          <div style={{ marginTop: 24 }}>
            <SocialIcons usuario={usuario} t={t} justify={align} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ usuario, t }: { usuario: PortfolioPublicUser; t: Theme }) {
  return (
    <section id="about" className="portfolio-section-padding" style={{ padding: '48px 0' }}>
      <SectionTitle text="Sobre mí" t={t} />
      <div className="portfolio-card" style={{ 

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
    <section id="skills" className="portfolio-section-padding" style={{ padding: '48px 0' }}>
      <SectionTitle text="Habilidades técnicas" t={t} />
      <div className="portfolio-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {skills.map((s) => {
          const pct = SKILL_LEVEL[s.level] ?? 50;
          const isBrutalist = t.border === '#000000';
          return (
            <div className="portfolio-card" key={s.id} style={{ 
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
    <section id="softskills" className="portfolio-section-padding" style={{ padding: '48px 0' }}>
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
  const [selected, setSelected] = useState<PortfolioPublicExperience | null>(null);
  const isBrutalist = t.border === '#000000';

  if (!experiencias.length) return null;

  const hasDetail = (e: PortfolioPublicExperience) =>
    (e.funcionesPrincipales?.length ?? 0) > 0 ||
    (e.logros?.length ?? 0) > 0 ||
    e.correoJefe || e.numeroJefe || e.cargoJefe;

  return (
    <section id="experience" className="portfolio-section-padding" style={{ padding: '48px 0' }}>
      <SectionTitle text="Experiencia" t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {experiencias.map((e, i) => (
          <div className="portfolio-experience-item"
            key={i}
            onClick={() => hasDetail(e) && setSelected(e)}
            style={{
              background: isBrutalist ? (i % 2 === 0 ? '#fff' : t.accent) : t.surface,
              borderRadius: isBrutalist ? 0 : 16,
              padding: '28px',
              border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`,
              borderLeft: isBrutalist ? '3px solid #000' : `4px solid ${t.accent}`,
              boxShadow: isBrutalist ? '8px 8px 0px #000' : 'none',
              cursor: hasDetail(e) ? 'pointer' : 'default',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(ev) => { if (hasDetail(e)) (ev.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(ev) => { (ev.currentTarget as HTMLDivElement).style.transform = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <p style={{ color: '#000', fontWeight: 900, fontSize: 20, margin: 0, textTransform: isBrutalist ? 'uppercase' : 'none' }}>
                  {e.cargo}
                </p>
                <p style={{ color: isBrutalist ? '#000' : t.accentText, fontWeight: 700, fontSize: 15, margin: '4px 0 0' }}>
                  {e.nombreEmpresa}
                  {e.modalidadTrabajo && (
                    <span style={{ fontWeight: 400, color: isBrutalist ? '#000' : t.textMuted, fontSize: 13, marginLeft: 8 }}>
                      · {e.modalidadTrabajo}
                    </span>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span style={{ color: isBrutalist ? '#000' : t.textMuted, fontSize: 13, fontWeight: isBrutalist ? 700 : 400 }}>
                  {e.fechaInicio} — {e.actualmenteTrabajando ? 'Presente' : (e.fechaFin ?? '')}
                </span>
                {hasDetail(e) && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: isBrutalist ? '#000' : t.accentText,
                    background: isBrutalist ? t.accent : t.accentBg,
                    border: isBrutalist ? '1px solid #000' : 'none',
                    padding: '2px 8px', borderRadius: isBrutalist ? 0 : 4,
                  }}>
                    Ver detalle →
                  </span>
                )}
              </div>
            </div>
            {e.descripcion && (
              <p style={{ color: '#000', fontSize: 15, marginTop: 16, lineHeight: 1.7, fontWeight: isBrutalist ? 500 : 400 }}>
                {e.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="portfolio-modal"
            onClick={(ev) => ev.stopPropagation()}
            style={{
              background: isBrutalist ? '#fff' : t.surface,
              border: isBrutalist ? '4px solid #000' : `1px solid ${t.border}`,
              boxShadow: isBrutalist ? '12px 12px 0 #000' : '0 24px 60px rgba(0,0,0,0.4)',
              borderRadius: isBrutalist ? 0 : 20,
              maxWidth: 640,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '36px 40px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: isBrutalist ? '#000' : t.text, textTransform: isBrutalist ? 'uppercase' : 'none' }}>
                  {selected.cargo}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: 16, fontWeight: 700, color: isBrutalist ? '#000' : t.accentText }}>
                  {selected.nombreEmpresa}
                  {selected.modalidadTrabajo && (
                    <span style={{ fontWeight: 400, color: isBrutalist ? '#000' : t.textMuted, fontSize: 14, marginLeft: 8 }}>
                      · {selected.modalidadTrabajo}
                    </span>
                  )}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: isBrutalist ? '#000' : t.textMuted }}>
                  {selected.fechaInicio} — {selected.actualmenteTrabajando ? 'Presente' : (selected.fechaFin ?? '')}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: isBrutalist ? '#000' : t.accentBg,
                  border: isBrutalist ? '2px solid #000' : 'none',
                  color: isBrutalist ? t.accent : t.accentText,
                  fontWeight: 900, fontSize: 18,
                  width: 36, height: 36,
                  borderRadius: isBrutalist ? 0 : '50%',
                  cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Descripción */}
            {selected.descripcion && (
              <p style={{ fontSize: 15, color: isBrutalist ? '#000' : t.textSub, lineHeight: 1.7, marginBottom: 24 }}>
                {selected.descripcion}
              </p>
            )}

            {/* Funciones principales */}
            {(selected.funcionesPrincipales?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 900, color: isBrutalist ? '#000' : t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Funciones principales
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selected.funcionesPrincipales!.map((f, i) => (
                    <li key={i} style={{ fontSize: 14, color: isBrutalist ? '#000' : t.textSub, lineHeight: 1.6 }}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Logros */}
            {(selected.logros?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 900, color: isBrutalist ? '#000' : t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Logros
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selected.logros!.map((l, i) => (
                    <li key={i} style={{ fontSize: 14, color: isBrutalist ? '#000' : t.textSub, lineHeight: 1.6 }}>{l}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Referencia profesional */}
            {(selected.cargoJefe || selected.correoJefe || selected.numeroJefe) && (
              <div style={{
                borderTop: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`,
                paddingTop: 20, marginTop: 8,
              }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 900, color: isBrutalist ? '#000' : t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Referencia profesional
                </h3>
                {selected.cargoJefe && (
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: isBrutalist ? '#000' : t.textSub }}>
                    {selected.cargoJefe}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {selected.correoJefe && (
                    <a href={`mailto:${selected.correoJefe}`} style={{ fontSize: 13, color: isBrutalist ? '#000' : t.accentText, fontWeight: 600, textDecoration: 'none' }}>
                      {selected.correoJefe}
                    </a>
                  )}
                  {selected.numeroJefe && (
                    <span style={{ fontSize: 13, color: isBrutalist ? '#000' : t.textMuted }}>
                      {selected.numeroJefe}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectsSection({ proyectos, t }: { proyectos: PortfolioPublicProject[]; t: Theme }) {
  if (!proyectos.length) return null;
  return (
    <section id="projects" className="portfolio-section-padding" style={{ padding: '48px 0' }}>
      <SectionTitle text="Proyectos" t={t} />
      <div className="portfolio-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
        {proyectos.map((p, i) => {
          const isBrutalist = t.border === '#000000';
          return (
            <div className="portfolio-card" key={i} style={{ 
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
    <section id="education" className="portfolio-section-padding" style={{ padding: '48px 0' }}>
      <SectionTitle text="Formación académica" t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {formaciones.map((f, i) => (
          <div className="portfolio-education-item" key={i} style={{
            background: isBrutalist ? t.accentBg : t.surface,
            borderRadius: isBrutalist ? 0 : 14,
            padding: '24px 32px',
            border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`,
            boxShadow: isBrutalist ? '6px 6px 0px #000' : 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ color: '#000', fontWeight: 900, fontSize: 18, margin: 0, textTransform: isBrutalist ? 'uppercase' : 'none' }}>{f.carrera}</p>
                <p style={{ color: isBrutalist ? '#000' : t.accentText, fontSize: 15, margin: '6px 0 0', fontWeight: 700 }}>{f.institucion}</p>
                {f.nivel && (
                  <span style={{
                    fontSize: 12,
                    color: isBrutalist ? '#fff' : t.textMuted,
                    background: isBrutalist ? '#000' : t.badge,
                    padding: '4px 12px',
                    borderRadius: isBrutalist ? 0 : 6,
                    marginTop: 10,
                    display: 'inline-block',
                    fontWeight: 800,
                  }}>{f.nivel}</span>
                )}
              </div>
              <span style={{ color: '#000', fontSize: 13, alignSelf: 'flex-start', fontWeight: 700 }}>
                {f.fechaInicio} — {f.actualmenteEstudiando ? 'Presente' : (f.fechaFinalizacion ?? '')}
              </span>
            </div>
            {f.descripcion && (
              <p style={{ color: isBrutalist ? '#000' : t.textSub, fontSize: 14, marginTop: 14, lineHeight: 1.7, fontWeight: isBrutalist ? 500 : 400 }}>
                {f.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ usuario, t }: { usuario: PortfolioPublicUser; t: Theme }) {
  const isBrutalist = t.border === '#000000';
  return (
    <section id="contact" className="portfolio-section-padding" style={{ padding: '80px 0', textAlign: 'center' }}>
      <SectionTitle text="Contacto" t={t} />
      <div className="portfolio-contact-box" style={{
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
          <a className="portfolio-contact-btn" href={`mailto:${usuario.email}`}
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
        {usuario.telefono && (
          <p style={{ color: '#000', fontSize: 15, marginTop: 20, fontWeight: 600 }}>
            {usuario.telefono}
          </p>
        )}
        <div style={{ marginTop: 28 }}>
          <SocialIcons usuario={usuario} t={t} justify="center" />
        </div>
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
    <div className="portfolio-wrapper" style={{ background: t.bg, minHeight: '100vh', fontFamily: `'${font}', system-ui, sans-serif`, color: t.text }}>
      <style>{RESPONSIVE_CSS}</style>
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
        <div className="portfolio-header-content" style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 70,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: '#000', textTransform: isBrutalist ? 'uppercase' : 'none' }}>
            {data.nombre}
          </span>
          <nav className="portfolio-nav" style={{ display: 'flex', gap: 24 }}>
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
      <main className="portfolio-main" style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
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
