//import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * AppShell
 * ─────────
 * Layout principal compartido por TODAS las páginas.
 * Dibuja el polígono tipo-carpeta y el sidebar fijo.
 * El contenido de cada ruta se renderiza en <Outlet />.
 *
 * La píldora con los botones guardar/cerrar vive en cada página
 * que la necesite (UserProfilePage), NO aquí, porque no todas
 * las páginas la tienen.
 */

// Logo Portly — centralizado aquí para no repetirlo
export function PortlyLogo() {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9" height="9" rx="2" fill="#7c6bec" />
        <rect
          x="13"
          y="2"
          width="9"
          height="9"
          rx="2"
          fill="#b0a8f5"
          opacity="0.6"
        />
        <rect
          x="2"
          y="13"
          width="9"
          height="9"
          rx="2"
          fill="#b0a8f5"
          opacity="0.6"
        />
        <rect
          x="13"
          y="13"
          width="9"
          height="9"
          rx="2"
          fill="#7c6bec"
          opacity="0.3"
        />
      </svg>
      <span className="text-[#1a1a2e] font-bold text-sm tracking-wide">
        PORTLY
      </span>
    </div>
  );
}

// Logo Portly Grande — para página de perfil
export function PortlyLogoBig() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
      <img src="/portly_logo.png" alt="Portly" className="w-8 h-8" />
      <span className="text-[#1a1a2e] font-bold text-lg tracking-wide">
        Portly
      </span>
    </div>
  );
}

interface AppShellProps {
  /** Nombre del usuario para el sidebar */
  userName: string;
  avatarUrl?: string;
  /** Título de la página actual */
  pageTitle: string;
  /** Subtítulo opcional */
  pageSubtitle?: string;
  /** Nodo extra a renderizar en la esquina superior derecha (p.ej. la píldora de guardar) */
  topRightSlot?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({
  userName,
  avatarUrl,
  pageTitle,
  pageSubtitle,
  topRightSlot,
  children,
}: AppShellProps) {
  return (
    /*
     * Contenedor principal: altura exacta del viewport (h-screen)
     * overflow-hidden para evitar scroll del navegador
     * El scroll DEBE ser interno dentro de AppShell, nunca del body
     */
    <div className="h-screen bg-[#e2e2e8] overflow-hidden flex items-center justify-center p-5">
      {/* Wrapper que recibe el clip-path */}
      <div className="relative w-full max-w-[1920px] h-[calc(100vh-2.5rem)]">
        {/* ── SVG clipPath: forma de carpeta con muesca en esquina sup-derecha ── */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            overflow: 'hidden',
          }}
        >
          <defs>
            <clipPath id="app-shell-clip" clipPathUnits="objectBoundingBox">
              {/*
                🎨 MUESCA CARPETA - SOLO MÁS LARGA HORIZONTALMENTE
                CAMBIAR AQUÍ: El valor en "L 0.XX,0" controla dónde empieza la muesca
                  L 0.9,0 = muesca pequeña (original)
                  L 0.7,0 = muesca más larga
                  L 0.6,0 = muesca muy larga
              */}
              <path d="M 0.022,0 L 0.7,0 Q 0.8,0 0.8,0.08 L 0.8,0.12 Q 0.8,0.15 0.85,0.15 L 0.98,0.15 Q 1,0.15 1,0.18 L 1,0.978 Q 1,1 0.978,1 L 0.022,1 Q 0,1 0,0.978 L 0,0.022 Q 0,0 0.022,0 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* ── Superficie recortada ── */}
        <div
          className="absolute inset-0 bg-[#0d1117] flex flex-col"
          style={{ clipPath: 'url(#app-shell-clip)' }}
        >
          {/* ── Top bar ── */}
          <div className="flex items-center justify-between px-7 pt-5 pb-3 shrink-0">
            {/* Izquierda: logo + título */}
            <div className="flex items-center gap-5">
              <PortlyLogo />
              <div>
                <h1 className="text-white text-2xl font-bold leading-tight">
                  {pageTitle}
                </h1>
                {pageSubtitle && (
                  <p className="text-[#6b7280] text-sm mt-0.5">
                    {pageSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 🎨 topRightSlot: Botones en esquina superior derecha (como BotonInicio) */}
          {topRightSlot && (
            <div className="absolute top-0 right-0 z-20">{topRightSlot}</div>
          )}

          {/* ── Cuerpo: sidebar fijo + contenido scrolleable ── */}
          <div className="flex flex-1 min-h-0 px-5 pb-5 gap-3">
            {/* Sidebar — nunca scrollea */}
            <Sidebar userName={userName} avatarUrl={avatarUrl} />

            {/* Área de contenido — scrollea internamente */}
            <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-thin rounded-xl">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
