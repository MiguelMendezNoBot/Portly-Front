import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioPublic } from '../../application/usePortfolioPublic';
import PreviewBanner from '../components/PreviewBanner';
import { useAuth } from '../../../home/presentation/hooks/useAuth';
import { BASE_URL } from '../../../../infrastructure/http/httpClient';
import { usePortfolioTracking } from '../../../analytics/application/usePortfolioTracking';
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
import { SOFT_SKILLS_CATALOG } from '../../../professional/presentation/components/Skills/SoftSkillsModal';
import { TechIcon } from '../../../professional/presentation/components/Skills/icons/TechIcon';
import detectiveImage from '../../../../assets/image.png';
import { ReportPortfolioModal } from '../components/ReportPortfolioModal';
import FirmaMinimaLayout from '../components/FirmaMinimaLayout';
import LaRedProfesionalLayout from '../components/LaRedProfesionalLayout';
// ─── Mobile context ───────────────────────────────────────────────────────────
const MobileCtx = createContext(false);
const useIsMobile = () => useContext(MobileCtx);

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
    accent: '#ffde00',
    accentText: '#000000',
    accentBg: '#ff4d4d',
    badge: '#ffffff',
    badgeText: '#000000',
    navBg: 'rgba(255,255,255,0.95)',
  },
  corporate: {
    bg: '#f0f5ff',
    surface: '#ffffff',
    border: 'rgba(37,99,235,0.14)',
    text: '#0f172a',
    textSub: '#1e293b',
    textMuted: '#64748b',
    accent: '#2563eb',
    accentText: '#1d4ed8',
    accentBg: 'rgba(37,99,235,0.08)',
    badge: '#eff6ff',
    badgeText: '#1e40af',
    navBg: 'rgba(240,245,255,0.95)',
  },
  'firma-minima': {
    bg: '#0a192f',
    surface: '#112240',
    border: 'rgba(100,255,218,0.15)',
    text: '#ccd6f6',
    textSub: '#a8b2d1',
    textMuted: '#8892b0',
    accent: '#64ffda',
    accentText: '#64ffda',
    accentBg: 'rgba(100,255,218,0.1)',
    badge: 'rgba(100,255,218,0.1)',
    badgeText: '#64ffda',
    navBg: 'rgba(10,25,47,0.95)',
  },
  'la-red-profesional': {
    bg: '#050816',
    surface: '#0f0f1a',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textSub: '#e2e8f0',
    textMuted: '#94a3b8',
    accent: '#7c3aed',
    accentText: '#a78bfa',
    accentBg: 'rgba(124,58,237,0.15)',
    badge: 'rgba(124,58,237,0.2)',
    badgeText: '#a78bfa',
    navBg: 'rgba(5,8,22,0.95)',
  },
};

const SKILL_LEVEL: Record<string, number> = {
  Básico: 20,
  Intermedio: 45,
  Avanzado: 70,
  Maestro: 85,
  Experto: 100,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({
  url,
  name,
  size = 80,
  accent,
}: {
  url?: string;
  name: string;
  size?: number;
  accent: string;
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return url ? (
    <img
      src={url}
      alt={name}
      referrerPolicy="no-referrer"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        border: `3px solid ${accent}`,
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${accent}30`,
        border: `3px solid ${accent}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 700,
        color: accent,
      }}
    >
      {initials}
    </div>
  );
}

function SectionTitle({ text, t }: { text: string; t: Theme }) {
  const isBrutalist = t.border === '#000000';
  const isMobile = useIsMobile();
  return (
    <div style={{ marginBottom: isMobile ? 20 : 32 }}>
      <h2
        style={{
          fontSize: isBrutalist ? (isMobile ? 28 : 42) : isMobile ? 20 : 28,
          fontWeight: 900,
          color: t.text,
          margin: 0,
          letterSpacing: isBrutalist ? '-0.04em' : '-0.02em',
          textTransform: isBrutalist ? 'uppercase' : 'none',
          WebkitTextStroke: isBrutalist ? '1px black' : 'none',
        }}
      >
        {text}
      </h2>
      {!isBrutalist && (
        <div
          style={{
            width: 40,
            height: 3,
            background: t.accent,
            borderRadius: 4,
            marginTop: 8,
          }}
        />
      )}
      {isBrutalist && (
        <div
          style={{ width: '100%', height: 4, background: '#000', marginTop: 4 }}
        />
      )}
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
  {
    key: 'email' as const,
    label: 'Email',
    color: '#4f46e5',
    path: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  },
];

function SocialIcons({
  usuario,
  t,
  justify = 'center',
  onSocialClick,
}: {
  usuario: PortfolioPublicUser;
  t: Theme;
  justify?: string;
  onSocialClick?: (name: string) => void;
}) {
  const isBrutalist = t.border === '#000000';
  const links = SOCIAL_DEFS.filter((s) => usuario[s.key]);
  if (!links.length) return null;
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: justify,
      }}
    >
      {links.map((s) => (
        <a
          key={s.key}
          onClick={() => onSocialClick?.(s.label)}
          href={
            s.key === 'email'
              ? `mailto:${usuario[s.key]}`
              : (usuario[s.key] as string)
          }
          target={s.key === 'email' ? undefined : '_blank'}
          rel={s.key === 'email' ? undefined : 'noopener noreferrer'}
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

function HeroSection({
  usuario,
  t,
  onSocialClick,
}: {
  usuario: PortfolioPublicUser;
  t: Theme;
  onSocialClick?: (name: string) => void;
}) {
  const isMobile = useIsMobile();
  const fullName = `${usuario.nombre} ${usuario.apellido}`.trim();
  const isBrutalist = t.border === '#000000';
  const isCorporate = t.accent === '#2563eb';
  const isRowLayout = !isMobile && (isBrutalist || isCorporate);
  const align = isRowLayout ? 'flex-start' : 'center';
  const avatarSize = isMobile
    ? 80
    : isBrutalist
      ? 180
      : isCorporate
        ? 120
        : 100;

  return (
    <section
      id="hero"
      style={{
        padding: isMobile ? '70px 0 40px' : '100px 0 80px',
        textAlign: isRowLayout ? 'left' : 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile
            ? 'column'
            : isBrutalist
              ? 'row-reverse'
              : isCorporate
                ? 'row'
                : 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? 24 : 40,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            border: isBrutalist ? '4px solid #000' : 'none',
            padding: isBrutalist ? 8 : 0,
            background: isBrutalist ? t.accent : 'transparent',
            boxShadow: isBrutalist
              ? isMobile
                ? '6px 6px 0px #000'
                : '12px 12px 0px #000'
              : isCorporate
                ? '0 8px 32px rgba(37,99,235,0.15)'
                : 'none',
            borderRadius: isBrutalist ? 0 : '50%',
          }}
        >
          <Avatar
            url={usuario.avatarUrl}
            name={fullName}
            size={avatarSize}
            accent={t.accent}
          />
        </div>
        <div style={{ flex: 1, minWidth: isMobile ? 0 : 280 }}>
          {isCorporate && (
            <div
              style={{
                width: 48,
                height: 4,
                background: t.accent,
                borderRadius: 4,
                marginBottom: 16,
              }}
            />
          )}
          <h1
            style={{
              fontSize: isBrutalist ? (isMobile ? 40 : 72) : isMobile ? 28 : 48,
              fontWeight: 900,
              color: t.text,
              margin: 0,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              textTransform: isBrutalist ? 'uppercase' : 'none',
            }}
          >
            {fullName}
          </h1>
          {usuario.profesion && (
            <div
              style={{
                display: isBrutalist
                  ? 'inline-block'
                  : isCorporate
                    ? 'inline-flex'
                    : 'block',
                alignItems: 'center',
                background: isBrutalist
                  ? '#000'
                  : isCorporate
                    ? t.accentBg
                    : 'transparent',
                padding: isBrutalist
                  ? '4px 12px'
                  : isCorporate
                    ? '6px 14px'
                    : 0,
                borderRadius: isCorporate ? 6 : 0,
                marginTop: isCorporate ? 16 : 12,
                border: isCorporate ? `1px solid ${t.border}` : 'none',
              }}
            >
              <p
                style={{
                  fontSize: isCorporate ? 15 : isMobile ? 18 : 24,
                  color: isBrutalist ? t.accent : t.accentText,
                  fontWeight: isCorporate ? 700 : 800,
                  margin: 0,
                }}
              >
                {usuario.profesion}
              </p>
            </div>
          )}
          {usuario.email && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: isBrutalist ? '#000' : t.textMuted,
                fontSize: 14,
                fontWeight: isBrutalist ? 700 : 400,
                marginTop: 16,
                justifyContent: align,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.99l-8 5-8-5V6l8 5 8-5v2.99z" />
              </svg>
              {usuario.email}
            </div>
          )}
          {(usuario.pais || usuario.telefono) && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                marginTop: 16,
                justifyContent: align,
              }}
            >
              {usuario.pais && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: isBrutalist ? '#000' : t.textMuted,
                    fontSize: 14,
                    fontWeight: isBrutalist ? 700 : 400,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {usuario.pais}
                </span>
              )}
              {usuario.telefono && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: isBrutalist ? '#000' : t.textMuted,
                    fontSize: 14,
                    fontWeight: isBrutalist ? 700 : 400,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  {usuario.telefono}
                </span>
              )}
            </div>
          )}
          {usuario.descripcion && (
            <p
              style={{
                fontSize: isMobile ? 15 : 18,
                color: t.textSub,
                maxWidth: 600,
                lineHeight: 1.6,
                marginTop: 24,
                fontWeight: isBrutalist ? 600 : 400,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {usuario.descripcion}
            </p>
          )}
          <div style={{ marginTop: 24 }}>
            <SocialIcons
              usuario={usuario}
              t={t}
              justify={align}
              onSocialClick={onSocialClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({
  usuario,
  t,
  title,
}: {
  usuario: PortfolioPublicUser;
  t: Theme;
  title?: string;
}) {
  const isMobile = useIsMobile();
  const isBrutalist = t.border === '#000000';
  return (
    <section id="about" style={{ padding: isMobile ? '32px 0' : '48px 0' }}>
      <SectionTitle text={title || 'Sobre mí'} t={t} />
      <div
        style={{
          background: t.surface,
          borderRadius: isBrutalist ? 0 : 16,
          padding: isMobile ? '20px 16px' : 32,
          border: isBrutalist ? '3px solid #000000' : `1px solid ${t.border}`,
          boxShadow: isBrutalist ? '8px 8px 0px #000000' : 'none',
        }}
      >
        <p
          style={{
            color: t.textSub,
            fontSize: 16,
            lineHeight: 1.8,
            margin: 0,
            fontWeight: isBrutalist ? 600 : 400,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {usuario.descripcion || 'Sin descripción disponible.'}
        </p>
      </div>
    </section>
  );
}

function SkillsSection({
  skills,
  t,
  title,
}: {
  skills: PortfolioPublicSkill[];
  t: Theme;
  title?: string;
}) {
  const isMobile = useIsMobile();
  if (!skills.length) return null;
  return (
    <section id="skills" style={{ padding: isMobile ? '32px 0' : '48px 0' }}>
      <SectionTitle text={title || 'Habilidades técnicas'} t={t} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? 'repeat(auto-fill, minmax(150px, 1fr))'
            : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: isMobile ? 12 : 20,
        }}
      >
        {skills.map((s) => {
          const pct = SKILL_LEVEL[s.level] ?? 50;
          const isBrutalist = t.border === '#000000';
          return (
            <div
              key={s.id}
              style={{
                background: isBrutalist ? t.accent : t.surface,
                borderRadius: isBrutalist ? 0 : 12,
                padding: isMobile ? '14px' : '20px',
                border: isBrutalist
                  ? '3px solid #000'
                  : `1px solid ${t.border}`,
                boxShadow: isBrutalist ? '6px 6px 0px #000' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <div
                    className="w-6 h-6 overflow-hidden flex items-center justify-center flex-shrink-0 rounded"
                    style={{
                      border: isBrutalist
                        ? '2px solid #000'
                        : `1px solid ${t.border}`,
                      background: '#fff',
                    }}
                  >
                    <TechIcon name={s.name} />
                  </div>
                  <span
                    style={{
                      color: isBrutalist ? '#000' : t.text,
                      fontWeight: 800,
                      fontSize: isMobile ? 12 : 14,
                      textTransform: isBrutalist ? 'uppercase' : 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.name}
                  </span>
                </div>
                <span
                  style={{
                    color: isBrutalist ? '#000' : t.accentText,
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginLeft: 8,
                  }}
                >
                  {s.level}
                </span>
              </div>
              <div
                style={{
                  height: isBrutalist ? 12 : 6,
                  background: isBrutalist ? '#fff' : t.accentBg,
                  borderRadius: isBrutalist ? 0 : 99,
                  border: isBrutalist ? '2px solid #000' : 'none',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: isBrutalist ? t.accentBg : t.accent,
                    borderRadius: 0,
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SoftSkillsSection({
  softSkills,
  t,
  title,
}: {
  softSkills: PortfolioPublicSoftSkill[];
  t: Theme;
  title?: string;
}) {
  const isMobile = useIsMobile();
  if (!softSkills.length) return null;
  const isBrutalist = t.border === '#000000';
  return (
    <section
      id="softskills"
      style={{ padding: isMobile ? '32px 0' : '48px 0' }}
    >
      <SectionTitle text={title || 'Habilidades blandas'} t={t} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {softSkills.map((s) => {
          const icon = SOFT_SKILLS_CATALOG.find(
            (c) => c.name === s.nombreHabilidad
          )?.icon;
          return (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: isBrutalist ? 0 : 999,
                background: isBrutalist ? t.badge : '#ffffff',
                color: isBrutalist ? t.badgeText : '#374151',
                fontSize: 14,
                fontWeight: 600,
                border: isBrutalist
                  ? '2px solid #000'
                  : `1px solid ${t.border}`,
                boxShadow: isBrutalist
                  ? '3px 3px 0 #000'
                  : '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <span
                style={{
                  color: isBrutalist ? '#000' : '#6b72ff',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {icon ?? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                )}
              </span>
              {s.nombreHabilidad}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ExperienceSection({
  experiencias,
  t,
  title,
  onClick,
}: {
  experiencias: PortfolioPublicExperience[];
  t: Theme;
  title?: string;
  onClick?: (id: string, name: string) => void;
}) {
  const [selected, setSelected] = useState<PortfolioPublicExperience | null>(
    null
  );
  const isBrutalist = t.border === '#000000';
  const isMobile = useIsMobile();

  if (!experiencias.length) return null;

  const hasDetail = (e: PortfolioPublicExperience) =>
    (e.funcionesPrincipales?.length ?? 0) > 0 ||
    (e.logros?.length ?? 0) > 0 ||
    e.correoJefe ||
    e.numeroJefe ||
    e.cargoJefe;

  return (
    <section
      id="experience"
      style={{ padding: isMobile ? '32px 0' : '48px 0' }}
    >
      <SectionTitle text={title || 'Experiencia'} t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {experiencias.map((e, i) => (
          <div
            key={i}
            onClick={() => {
              if (hasDetail(e)) {
                setSelected(e);
                onClick?.(
                  e.id?.toString() || e.nombreEmpresa,
                  e.cargo + ' en ' + e.nombreEmpresa
                );
              }
            }}
            style={{
              background: isBrutalist
                ? i % 2 === 0
                  ? '#fff'
                  : t.accent
                : t.surface,
              borderRadius: isBrutalist ? 0 : 16,
              padding: isMobile ? '20px 16px' : '28px',
              border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`,
              borderLeft: isBrutalist
                ? '3px solid #000'
                : `4px solid ${t.accent}`,
              boxShadow: isBrutalist ? '8px 8px 0px #000' : 'none',
              cursor: hasDetail(e) ? 'pointer' : 'default',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(ev) => {
              if (hasDetail(e))
                (ev.currentTarget as HTMLDivElement).style.transform =
                  'translateY(-2px)';
            }}
            onMouseLeave={(ev) => {
              (ev.currentTarget as HTMLDivElement).style.transform = 'none';
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div>
                <p
                  style={{
                    color: '#000',
                    fontWeight: 900,
                    fontSize: 20,
                    margin: 0,
                    textTransform: isBrutalist ? 'uppercase' : 'none',
                  }}
                >
                  {e.cargo}
                </p>
                <p
                  style={{
                    color: isBrutalist ? '#000' : t.accentText,
                    fontWeight: 700,
                    fontSize: 15,
                    margin: '4px 0 0',
                  }}
                >
                  {e.nombreEmpresa}
                  {e.modalidadTrabajo && (
                    <span
                      style={{
                        fontWeight: 400,
                        color: isBrutalist ? '#000' : t.textMuted,
                        fontSize: 13,
                        marginLeft: 8,
                      }}
                    >
                      · {e.modalidadTrabajo}
                    </span>
                  )}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    color: isBrutalist ? '#000' : t.textMuted,
                    fontSize: 13,
                    fontWeight: isBrutalist ? 700 : 400,
                  }}
                >
                  {e.fechaInicio} —{' '}
                  {e.actualmenteTrabajando ? 'Presente' : (e.fechaFin ?? '')}
                </span>
                {hasDetail(e) && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isBrutalist ? '#000' : t.accentText,
                      background: isBrutalist ? t.accent : t.accentBg,
                      border: isBrutalist ? '1px solid #000' : 'none',
                      padding: '2px 8px',
                      borderRadius: isBrutalist ? 0 : 4,
                    }}
                  >
                    Ver detalle →
                  </span>
                )}
              </div>
            </div>
            {e.descripcion && (
              <p
                style={{
                  color: '#000',
                  fontSize: 15,
                  marginTop: 16,
                  lineHeight: 1.7,
                  fontWeight: isBrutalist ? 500 : 400,
                }}
              >
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
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? 12 : 24,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            style={{
              background: isBrutalist ? '#fff' : t.surface,
              border: isBrutalist ? '4px solid #000' : `1px solid ${t.border}`,
              boxShadow: isBrutalist
                ? '12px 12px 0 #000'
                : '0 24px 60px rgba(0,0,0,0.4)',
              borderRadius: isBrutalist ? 0 : 20,
              maxWidth: 640,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: isMobile ? '24px 20px' : '36px 40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: 900,
                    color: isBrutalist ? '#000' : t.text,
                    textTransform: isBrutalist ? 'uppercase' : 'none',
                  }}
                >
                  {selected.cargo}
                </h2>
                <p
                  style={{
                    margin: '6px 0 0',
                    fontSize: 16,
                    fontWeight: 700,
                    color: isBrutalist ? '#000' : t.accentText,
                  }}
                >
                  {selected.nombreEmpresa}
                  {selected.modalidadTrabajo && (
                    <span
                      style={{
                        fontWeight: 400,
                        color: isBrutalist ? '#000' : t.textMuted,
                        fontSize: 14,
                        marginLeft: 8,
                      }}
                    >
                      · {selected.modalidadTrabajo}
                    </span>
                  )}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    color: isBrutalist ? '#000' : t.textMuted,
                  }}
                >
                  {selected.fechaInicio} —{' '}
                  {selected.actualmenteTrabajando
                    ? 'Presente'
                    : (selected.fechaFin ?? '')}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: isBrutalist ? '#000' : t.accentBg,
                  border: isBrutalist ? '2px solid #000' : 'none',
                  color: isBrutalist ? t.accent : t.accentText,
                  fontWeight: 900,
                  fontSize: 18,
                  width: 36,
                  height: 36,
                  borderRadius: isBrutalist ? 0 : '50%',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {selected.descripcion && (
              <p
                style={{
                  fontSize: 15,
                  color: isBrutalist ? '#000' : t.textSub,
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                {selected.descripcion}
              </p>
            )}

            {(selected.funcionesPrincipales?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    margin: '0 0 12px',
                    fontSize: 14,
                    fontWeight: 900,
                    color: isBrutalist ? '#000' : t.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Funciones principales
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {selected.funcionesPrincipales!.map((f, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 14,
                        color: isBrutalist ? '#000' : t.textSub,
                        lineHeight: 1.6,
                      }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(selected.logros?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    margin: '0 0 12px',
                    fontSize: 14,
                    fontWeight: 900,
                    color: isBrutalist ? '#000' : t.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Logros
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {selected.logros!.map((l, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 14,
                        color: isBrutalist ? '#000' : t.textSub,
                        lineHeight: 1.6,
                      }}
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(selected.cargoJefe ||
              selected.correoJefe ||
              selected.numeroJefe) && (
              <div
                style={{
                  borderTop: isBrutalist
                    ? '3px solid #000'
                    : `1px solid ${t.border}`,
                  paddingTop: 20,
                  marginTop: 8,
                }}
              >
                <h3
                  style={{
                    margin: '0 0 12px',
                    fontSize: 14,
                    fontWeight: 900,
                    color: isBrutalist ? '#000' : t.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Referencia profesional
                </h3>
                {selected.cargoJefe && (
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: 14,
                      fontWeight: 700,
                      color: isBrutalist ? '#000' : t.textSub,
                    }}
                  >
                    {selected.cargoJefe}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {selected.correoJefe && (
                    <a
                      href={`mailto:${selected.correoJefe}`}
                      style={{
                        fontSize: 13,
                        color: isBrutalist ? '#000' : t.accentText,
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {selected.correoJefe}
                    </a>
                  )}
                  {selected.numeroJefe && (
                    <span
                      style={{
                        fontSize: 13,
                        color: isBrutalist ? '#000' : t.textMuted,
                      }}
                    >
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

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ProjectsSection({
  proyectos,
  t,
  title,
  onClick,
}: {
  proyectos: PortfolioPublicProject[];
  t: Theme;
  title?: string;
  onClick?: (id: number) => void;
}) {
  const [selected, setSelected] = useState<PortfolioPublicProject | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const isMobile = useIsMobile();

  if (!proyectos.length) return null;
  const isBrutalist = t.border === '#000000';

  const hasDetail = (p: PortfolioPublicProject) =>
    (p.descripcionDetallada && p.descripcionDetallada.trim().length > 0) ||
    (p.evidencias && p.evidencias.length > 1) ||
    (p.enlaces && p.enlaces.length > 0) ||
    (p.documentos && p.documentos.length > 0);

  const openProject = (p: PortfolioPublicProject) => {
    setSelected(p);
    setGalleryIndex(0);
    if (p.id) onClick?.(p.id);
  };

  return (
    <section id="projects" style={{ padding: isMobile ? '32px 0' : '48px 0' }}>
      <SectionTitle text={title || 'Proyectos'} t={t} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: isMobile ? 20 : 32,
        }}
      >
        {proyectos.map((p, i) => {
          const coverUrl = p.iconoUrl || p.evidencias?.[0] || null;
          const extraImages = (p.evidencias?.length ?? 0) > 1;
          return (
            <div
              key={i}
              onClick={() => hasDetail(p) && openProject(p)}
              style={{
                background: t.surface,
                borderRadius: isBrutalist ? 0 : 16,
                padding: 0,
                border: isBrutalist
                  ? '3px solid #000'
                  : `1px solid ${t.border}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: isBrutalist ? '10px 10px 0px #000' : 'none',
                cursor: hasDetail(p) ? 'pointer' : 'default',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(ev) => {
                if (hasDetail(p))
                  (ev.currentTarget as HTMLDivElement).style.transform =
                    'translateY(-3px)';
              }}
              onMouseLeave={(ev) => {
                (ev.currentTarget as HTMLDivElement).style.transform = 'none';
              }}
            >
              <div
                style={{
                  height: isMobile ? 160 : 200,
                  background: isBrutalist ? t.accentBg : t.accent,
                  borderBottom: isBrutalist ? '3px solid #000' : 'none',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={p.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                )}
                {isBrutalist && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: '#000',
                      color: '#fff',
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    PROJECT_{i + 1}
                  </div>
                )}
                {extraImages && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    +{p.evidencias!.length - 1} fotos
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: isMobile ? 16 : 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <p
                    style={{
                      color: t.text,
                      fontWeight: 900,
                      fontSize: 18,
                      margin: 0,
                      textTransform: isBrutalist ? 'uppercase' : 'none',
                      wordBreak: 'break-word',
                    }}
                  >
                    {p.nombre}
                  </p>
                  {hasDetail(p) && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isBrutalist ? '#000' : t.accentText,
                        background: isBrutalist ? t.accent : t.accentBg,
                        border: isBrutalist ? '1px solid #000' : 'none',
                        padding: '2px 8px',
                        borderRadius: isBrutalist ? 0 : 4,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      Ver más →
                    </span>
                  )}
                </div>
                <p
                  style={{
                    color: t.textSub,
                    fontSize: 14,
                    margin: '0 0 16px',
                    lineHeight: 1.6,
                    fontWeight: isBrutalist ? 600 : 400,
                    wordBreak: 'break-word',
                  }}
                >
                  {p.descripcionCorta}
                </p>

                {p.tecnologias?.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginBottom: 16,
                    }}
                  >
                    {p.tecnologias.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '4px 10px',
                          borderRadius: isBrutalist ? 0 : 99,
                          background: isBrutalist ? '#000' : t.accentBg,
                          color: isBrutalist ? t.accent : t.accentText,
                          fontSize: 11,
                          fontWeight: 800,
                          border: isBrutalist ? '1px solid #000' : 'none',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 'auto',
                  }}
                >
                  {p.urlDemo && (
                    <a
                      href={p.urlDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: isBrutalist ? '#000' : t.accent,
                        fontSize: 12,
                        fontWeight: 800,
                        textDecoration: 'none',
                        background: isBrutalist ? t.accent : t.accentBg,
                        padding: '4px 10px',
                        borderRadius: isBrutalist ? 0 : 6,
                        border: isBrutalist ? '2px solid #000' : 'none',
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Demo
                    </a>
                  )}
                  {p.enlaces &&
                    p.enlaces.map((en, li) => (
                      <a
                        key={li}
                        href={en.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: isBrutalist ? '#000' : t.accent,
                          fontSize: 12,
                          fontWeight: 800,
                          textDecoration: 'none',
                          background: isBrutalist ? t.accent : t.accentBg,
                          padding: '4px 10px',
                          borderRadius: isBrutalist ? 0 : 6,
                          border: isBrutalist ? '2px solid #000' : 'none',
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                        {en.titulo || en.url}
                      </a>
                    ))}
                  {p.documentos &&
                    p.documentos.map((doc) => (
                      <a
                        key={doc.id}
                        href={
                          doc.urlDescarga.startsWith('http')
                            ? doc.urlDescarga
                            : BASE_URL + doc.urlDescarga
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: isBrutalist ? '#000' : t.textMuted,
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                          background: isBrutalist ? '#fff' : t.badge,
                          padding: '4px 10px',
                          borderRadius: isBrutalist ? 0 : 6,
                          border: isBrutalist
                            ? '2px solid #000'
                            : `1px solid ${t.border}`,
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {doc.nombre}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? 12 : 24,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isBrutalist ? '#fff' : t.surface,
              borderRadius: isBrutalist ? 0 : 20,
              border: isBrutalist ? '4px solid #000' : `1px solid ${t.border}`,
              boxShadow: isBrutalist
                ? '12px 12px 0 #000'
                : '0 24px 64px rgba(0,0,0,0.4)',
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {selected.evidencias && selected.evidencias.length > 0 && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={selected.evidencias[galleryIndex]}
                  alt={`imagen ${galleryIndex + 1}`}
                  style={{
                    width: '100%',
                    height: isMobile ? 200 : 280,
                    objectFit: 'cover',
                    display: 'block',
                    borderBottom: isBrutalist ? '4px solid #000' : 'none',
                  }}
                />
                {selected.evidencias.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setGalleryIndex(
                          (g) =>
                            (g - 1 + selected.evidencias!.length) %
                            selected.evidencias!.length
                        )
                      }
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        color: '#fff',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                      }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setGalleryIndex(
                          (g) => (g + 1) % selected.evidencias!.length
                        )
                      }
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        color: '#fff',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                      }}
                    >
                      ›
                    </button>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      {selected.evidencias.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryIndex(idx)}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            background:
                              idx === galleryIndex
                                ? '#fff'
                                : 'rgba(255,255,255,0.4)',
                            padding: 0,
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div
              style={{
                padding: isMobile ? '20px 16px' : 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: t.text,
                      fontWeight: 900,
                      fontSize: isMobile ? 18 : 22,
                      margin: '0 0 6px',
                      textTransform: isBrutalist ? 'uppercase' : 'none',
                      wordBreak: 'break-word',
                    }}
                  >
                    {selected.nombre}
                  </p>
                  {selected.tecnologias?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selected.tecnologias.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            padding: '3px 9px',
                            borderRadius: isBrutalist ? 0 : 99,
                            background: isBrutalist ? '#000' : t.accentBg,
                            color: isBrutalist ? t.accent : t.accentText,
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: 'none',
                    border: isBrutalist ? '2px solid #000' : 'none',
                    cursor: 'pointer',
                    color: t.textMuted,
                    padding: 4,
                    flexShrink: 0,
                    borderRadius: 6,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {selected.descripcionCorta && (
                <p
                  style={{
                    color: t.textSub,
                    fontSize: 15,
                    lineHeight: 1.7,
                    margin: 0,
                    fontWeight: isBrutalist ? 600 : 400,
                    wordBreak: 'break-word',
                  }}
                >
                  {selected.descripcionCorta}
                </p>
              )}
              {selected.descripcionDetallada &&
                selected.descripcionDetallada.trim() && (
                  <div
                    style={{
                      borderTop: `1px solid ${t.border}`,
                      paddingTop: 20,
                    }}
                  >
                    <p
                      style={{
                        color: t.textMuted,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        marginBottom: 10,
                      }}
                    >
                      Descripción detallada
                    </p>
                    <p
                      style={{
                        color: t.textSub,
                        fontSize: 14,
                        lineHeight: 1.8,
                        margin: 0,
                        wordBreak: 'break-word',
                      }}
                    >
                      {selected.descripcionDetallada}
                    </p>
                  </div>
                )}

              {selected.enlaces && selected.enlaces.length > 0 && (
                <div
                  style={{ borderTop: `1px solid ${t.border}`, paddingTop: 20 }}
                >
                  <p
                    style={{
                      color: t.textMuted,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      marginBottom: 12,
                    }}
                  >
                    Links
                  </p>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    {selected.enlaces.map((en, i) => (
                      <a
                        key={i}
                        href={en.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          color: isBrutalist ? '#000' : t.accent,
                          fontSize: 14,
                          fontWeight: 700,
                          textDecoration: 'none',
                          wordBreak: 'break-all',
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                        {en.titulo || en.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selected.documentos && selected.documentos.length > 0 && (
                <div
                  style={{ borderTop: `1px solid ${t.border}`, paddingTop: 20 }}
                >
                  <p
                    style={{
                      color: t.textMuted,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      marginBottom: 12,
                    }}
                  >
                    Documentos
                  </p>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    {selected.documentos.map((doc) => (
                      <a
                        key={doc.id}
                        href={
                          doc.urlDescarga.startsWith('http')
                            ? doc.urlDescarga
                            : BASE_URL + doc.urlDescarga
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 14px',
                          background: t.bg,
                          border: isBrutalist
                            ? '2px solid #000'
                            : `1px solid ${t.border}`,
                          borderRadius: isBrutalist ? 0 : 8,
                          textDecoration: 'none',
                          color: t.text,
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={isBrutalist ? '#000' : t.accent}
                          strokeWidth="2"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: 700,
                              color: t.text,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {doc.nombre}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: t.textMuted,
                            }}
                          >
                            {doc.formato.toUpperCase()} ·{' '}
                            {formatBytes(doc.pesoBytes)}
                          </p>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={t.textMuted}
                          strokeWidth="2"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selected.urlDemo && (
                <a
                  href={selected.urlDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: isBrutalist ? '#000' : t.accent,
                    color: isBrutalist ? t.accent : '#fff',
                    padding: '12px 24px',
                    borderRadius: isBrutalist ? 0 : 10,
                    fontWeight: 800,
                    fontSize: 14,
                    textDecoration: 'none',
                    border: isBrutalist ? '2px solid #000' : 'none',
                    textTransform: isBrutalist ? 'uppercase' : 'none',
                  }}
                >
                  Ver demo / repositorio →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function EducationSection({
  formaciones,
  t,
  title,
}: {
  formaciones: PortfolioPublicFormacion[];
  t: Theme;
  title?: string;
}) {
  const isMobile = useIsMobile();
  if (!formaciones.length) return null;
  const isBrutalist = t.border === '#000000';
  return (
    <section id="education" style={{ padding: isMobile ? '32px 0' : '48px 0' }}>
      <SectionTitle text={title || 'Formación académica'} t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {formaciones.map((f, i) => (
          <div
            key={i}
            style={{
              background: isBrutalist ? t.accentBg : t.surface,
              borderRadius: isBrutalist ? 0 : 14,
              padding: isMobile ? '20px 16px' : '24px 32px',
              border: isBrutalist ? '3px solid #000' : `1px solid ${t.border}`,
              boxShadow: isBrutalist ? '6px 6px 0px #000' : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    color: '#000',
                    fontWeight: 900,
                    fontSize: 18,
                    margin: 0,
                    textTransform: isBrutalist ? 'uppercase' : 'none',
                  }}
                >
                  {f.carrera}
                </p>
                <p
                  style={{
                    color: isBrutalist ? '#000' : t.accentText,
                    fontSize: 15,
                    margin: '6px 0 0',
                    fontWeight: 700,
                  }}
                >
                  {f.institucion}
                </p>
                {f.nivel && (
                  <span
                    style={{
                      fontSize: 12,
                      color: isBrutalist ? '#fff' : t.textMuted,
                      background: isBrutalist ? '#000' : t.badge,
                      padding: '4px 12px',
                      borderRadius: isBrutalist ? 0 : 6,
                      marginTop: 10,
                      display: 'inline-block',
                      fontWeight: 800,
                    }}
                  >
                    {f.nivel}
                  </span>
                )}
              </div>
              <span
                style={{
                  color: '#000',
                  fontSize: 13,
                  alignSelf: 'flex-start',
                  fontWeight: 700,
                }}
              >
                {f.fechaInicio} —{' '}
                {f.actualmenteEstudiando
                  ? 'Presente'
                  : (f.fechaFinalizacion ?? '')}
              </span>
            </div>
            {f.descripcion && (
              <p
                style={{
                  color: isBrutalist ? '#000' : t.textSub,
                  fontSize: 14,
                  marginTop: 14,
                  lineHeight: 1.7,
                  fontWeight: isBrutalist ? 500 : 400,
                }}
              >
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
  t,
  title,
  onSocialClick,
}: {
  usuario: PortfolioPublicUser;
  t: Theme;
  title?: string;
  onSocialClick?: (name: string) => void;
}) {
  const isMobile = useIsMobile();
  const isBrutalist = t.border === '#000000';
  return (
    <section
      id="contact"
      style={{ padding: isMobile ? '48px 0' : '80px 0', textAlign: 'center' }}
    >
      <SectionTitle text={title || 'Contacto'} t={t} />
      <div
        style={{
          background: isBrutalist ? t.accent : t.surface,
          borderRadius: isBrutalist ? 0 : 24,
          padding: isMobile ? '36px 20px' : '60px 40px',
          border: isBrutalist ? '4px solid #000' : `1px solid ${t.border}`,
          maxWidth: 540,
          margin: '0 auto',
          boxShadow: isBrutalist ? '15px 15px 0px #000' : 'none',
        }}
      >
        <p
          style={{
            color: '#000',
            fontSize: isMobile ? 16 : 18,
            marginBottom: 32,
            lineHeight: 1.7,
            fontWeight: 700,
          }}
        >
          ¿Interesado en trabajar juntos? No dudes en contactarme.
        </p>
        {usuario.email && (
          <a
            href={`mailto:${usuario.email}`}
            style={{
              display: 'inline-block',
              padding: isMobile ? '14px 28px' : '16px 48px',
              borderRadius: isBrutalist ? 0 : 999,
              background: isBrutalist ? '#000' : t.accent,
              color: '#fff',
              fontWeight: 900,
              textDecoration: 'none',
              fontSize: isMobile ? 14 : 16,
              textTransform: isBrutalist ? 'uppercase' : 'none',
              border: isBrutalist ? '2px solid #000' : 'none',
              wordBreak: 'break-all',
            }}
          >
            {usuario.email}
          </a>
        )}
        {usuario.telefono && (
          <p
            style={{
              color: '#000',
              fontSize: 15,
              marginTop: 20,
              fontWeight: 600,
            }}
          >
            {usuario.telefono}
          </p>
        )}
        <div style={{ marginTop: 28 }}>
          <SocialIcons
            usuario={usuario}
            t={t}
            justify="center"
            onSocialClick={onSocialClick}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Section router ───────────────────────────────────────────────────────────

function renderSection(
  section: TemplateSection,
  data: PortfolioPublicData,
  t: Theme,
  trackProjectClick?: (id: number) => void,
  trackExperienceClick?: (id: string, name: string) => void,
  trackSocialClick?: (name: string) => void
) {
  const title = section.title;
  switch (section.type) {
    case 'hero':
      return (
        <HeroSection
          key="hero"
          usuario={data.usuario}
          t={t}
          onSocialClick={trackSocialClick}
        />
      );
    case 'about':
      return (
        <AboutSection key="about" usuario={data.usuario} t={t} title={title} />
      );
    case 'skills':
      return (
        <SkillsSection key="skills" skills={data.skills} t={t} title={title} />
      );
    case 'softskills':
      return (
        <SoftSkillsSection
          key="softskills"
          softSkills={data.softSkills}
          t={t}
          title={title}
        />
      );
    case 'experience':
      return (
        <ExperienceSection
          key="experience"
          experiencias={data.experiencias}
          t={t}
          title={title}
          onClick={trackExperienceClick}
        />
      );
    case 'projects':
      return (
        <ProjectsSection
          key="projects"
          proyectos={data.proyectos}
          t={t}
          title={title}
          onClick={trackProjectClick}
        />
      );
    case 'education':
      return (
        <EducationSection
          key="education"
          formaciones={data.formaciones}
          t={t}
          title={title}
        />
      );
    case 'contact':
      return (
        <ContactSection
          key="contact"
          usuario={data.usuario}
          t={t}
          title={title}
          onSocialClick={trackSocialClick}
        />
      );
    default:
      return null;
  }
}

// ─── Skeleton / Error states ──────────────────────────────────────────────────

function LoadingState() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0c14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 48,
            height: 48,
            border: '3px solid #7c6bec',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Cargando portafolio…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0c14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', marginBottom: 40, marginTop: 40 }}>
          {/* Nube de pensamiento */}
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%) translateY(-16px)',
              background: '#1f2937',
              padding: '12px 24px',
              borderRadius: 24,
              border: '1px solid #374151',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            <p
              style={{
                color: '#f3f4f6',
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Mmm... este portafolio ya no es público
            </p>
            {/* Burbujitas hacia abajo */}
            <div
              style={{
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#1f2937',
                border: '1px solid #374151',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -24,
                left: 'calc(50% + 12px)',
                transform: 'translateX(-50%)',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#1f2937',
                border: '1px solid #374151',
              }}
            />
          </div>

          {/* Icono de Detective Incógnito (Personalizado igual a la imagen) */}
          <div
            style={{
              width: 120,
              height: 120,
              background: 'rgba(124,107,236,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(124,107,236,0.3)',
              boxShadow: '0 0 40px rgba(124,107,236,0.1)',
              overflow: 'hidden',
            }}
          >
            <img
              src={detectiveImage}
              alt="Detective Incógnito"
              style={{
                width: '80%',
                height: '80%',
                objectFit: 'contain',
                opacity: 0.8,
              }}
            />
          </div>
        </div>

        <p
          style={{
            color: '#e5e7eb',
            fontSize: 26,
            fontWeight: 800,
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}
        >
          Acceso Restringido
        </p>
        <p
          style={{
            color: '#9ca3af',
            fontSize: 16,
            margin: 0,
            maxWidth: 380,
            lineHeight: 1.6,
          }}
        >
          El autor ha cambiado la visibilidad de este portafolio a privado o el
          enlace ya no existe.
        </p>

        <a
          href="/explore"
          style={{
            marginTop: 32,
            display: 'inline-block',
            background: '#7c6bec',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'background 0.2s',
            border: '1px solid #6b5ce0',
          }}
        >
          Explorar otros portafolios
        </a>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PortfolioPublicPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const { data, loading, error } = usePortfolioPublic(portfolioId);
  const isIframe = window.self !== window.top;
  const { trackProjectClick, trackSectionClick } = usePortfolioTracking(
    isIframe ? undefined : data?.id
  );
  const { user } = useAuth();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Wrap project clicks with tracking
  const handleProjectClick = useCallback(
    (projectId: number | undefined) => {
      if (projectId) trackProjectClick(projectId);
    },
    [trackProjectClick]
  );

  // Wrap experience clicks with tracking
  const handleExperienceClick = useCallback(
    (id: string, name: string) => {
      trackSectionClick('EXPERIENCIA', id, name);
    },
    [trackSectionClick]
  );

  // Wrap social clicks with tracking
  const handleSocialClick = useCallback(
    (name: string) => {
      trackSectionClick('RED_SOCIAL', name, name);
    },
    [trackSectionClick]
  );

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (loading) return <LoadingState />;
  if (error || !data)
    return <ErrorState error={error ?? 'Portafolio no encontrado'} />;

  const rawScheme = data.templateSchema?.colorScheme;
  const schemeKey = (
    typeof rawScheme === 'string' ? rawScheme : 'dark'
  ) as keyof typeof THEMES;
  const t = THEMES[schemeKey] ?? THEMES.dark;
  const font = data.templateSchema?.fontFamily ?? 'Inter';
  const isBrutalist = t.border === '#000000';
  const isCorporate = t.accent === '#2563eb';

  const visibleSections = (data.templateSchema?.sections ?? [])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const isPrivate = data.visibilidad === 'PRIVADO';

  const reportButton =
    user?.rol !== 'ADMIN' && !data?.hasPendingReport ? (
      <button
        onClick={() => setReportModalOpen(true)}
        title="Reportar portafolio"
        style={{
          position: 'fixed',
          bottom: isMobile ? 24 : 32,
          right: isMobile ? 24 : 32,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#ef4444',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow =
            '0 6px 16px rgba(239, 68, 68, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow =
            '0 4px 12px rgba(239, 68, 68, 0.4)';
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      </button>
    ) : null;

  const reportModal = (
    <ReportPortfolioModal
      isOpen={reportModalOpen}
      onClose={() => setReportModalOpen(false)}
      portfolioId={data?.id ?? 0}
      portfolioTitle={
        data?.usuario?.nombre
          ? `${data.usuario.nombre} ${data.usuario.apellido}`
          : ''
      }
    />
  );

  if (schemeKey === 'firma-minima') {
    return (
      <FirmaMinimaLayout
        data={data}
        isPrivate={isPrivate}
        font={font}
        visibleSections={visibleSections}
        isMobile={isMobile}
        onProjectClick={handleProjectClick}
        onExperienceClick={handleExperienceClick}
        onSocialClick={handleSocialClick}
        reportButton={reportButton}
        reportModal={reportModal}
      />
    );
  }

  if (schemeKey === 'la-red-profesional') {
    return (
      <LaRedProfesionalLayout
        data={data}
        isPrivate={isPrivate}
        font={font}
        visibleSections={visibleSections}
        isMobile={isMobile}
        onProjectClick={handleProjectClick}
        onExperienceClick={handleExperienceClick}
        onSocialClick={handleSocialClick}
        reportButton={reportButton}
        reportModal={reportModal}
      />
    );
  }

  return (
    <MobileCtx.Provider value={isMobile}>
      <div
        style={{
          background: t.bg,
          minHeight: '100vh',
          fontFamily: `'${font}', system-ui, sans-serif`,
          color: t.text,
        }}
      >
        {isPrivate && <PreviewBanner />}

        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800;900&display=swap`}
        />

        <header
          style={{
            position: 'sticky',
            top: isPrivate ? 46 : 0,
            zIndex: 100,
            backdropFilter: isBrutalist ? 'none' : 'blur(16px)',
            background: isBrutalist ? t.accent : t.navBg,
            borderBottom: isBrutalist
              ? '4px solid #000'
              : `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              padding: '0 16px',
              height: isMobile ? 52 : 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                isBrutalist || isCorporate ? 'center' : 'space-between',
            }}
          >
            <nav
              style={{
                display: 'flex',
                gap: isMobile ? 14 : isBrutalist ? 32 : 28,
                overflowX: 'auto',
              }}
            >
              {visibleSections
                .filter((s) => s.type !== 'hero')
                .slice(0, isMobile ? 4 : 5)
                .map((s) => (
                  <a
                    key={s.type}
                    href={`#${s.type}`}
                    style={{
                      color: '#000',
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 800,
                      textDecoration: 'none',
                      textTransform: isBrutalist ? 'uppercase' : 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.title || s.type}
                  </a>
                ))}
            </nav>
          </div>
        </header>

        <main
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: isMobile ? '0 16px 60px' : '0 24px 80px',
          }}
        >
          {visibleSections.map((section) =>
            renderSection(
              section,
              data,
              t,
              handleProjectClick,
              handleExperienceClick,
              handleSocialClick
            )
          )}
        </main>

        <footer
          style={{
            borderTop: `1px solid ${t.border}`,
            padding: '20px 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: t.textMuted, fontSize: 12, margin: 0 }}>
            Portafolio creado con{' '}
            <span style={{ color: t.accent, fontWeight: 600 }}>Portly</span>
          </p>
        </footer>

        {reportButton}
      </div>
      {reportModal}
    </MobileCtx.Provider>
  );
}
