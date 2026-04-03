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
        <rect x="13" y="2" width="9" height="9" rx="2" fill="#b0a8f5" opacity="0.6" />
        <rect x="2" y="13" width="9" height="9" rx="2" fill="#b0a8f5" opacity="0.6" />
        <rect x="13" y="13" width="9" height="9" rx="2" fill="#7c6bec" opacity="0.3" />
      </svg>
      <span className="text-[#1a1a2e] font-bold text-sm tracking-wide">PORTLY</span>
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
     * Fondo exterior claro — los bordes que rodean el polígono
     * vienen de este fondo siendo visible alrededor del clip-path.
     * p-5 da el mismo grosor en los 4 lados.
     */
    <div className="min-h-screen bg-[#e2e2e8] flex items-center justify-center p-5">

      {/* Wrapper que recibe el clip-path */}
      <div className="relative w-full max-w-[1920px] h-[calc(100vh-2.5rem)]">

        {/* ── SVG clipPath: forma de carpeta con muesca en esquina sup-derecha ── */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        >
          <defs>
            <clipPath id="app-shell-clip" clipPathUnits="objectBoundingBox">
              {/*
                Coordenadas normalizadas 0–1.
                La muesca crea el "tab" en la esquina superior derecha.
                r ≈ 0.022 para esquinas suaves.
              */}
              <path d="
                M 0.022,0
                L 0.745,0
                Q 0.772,0  0.772,0.022
                L 0.772,0.052
                Q 0.772,0.075  0.794,0.075
                L 0.978,0.075
                Q 1,0.075  1,0.097
                L 1,0.978
                Q 1,1  0.978,1
                L 0.022,1
                Q 0,1  0,0.978
                L 0,0.022
                Q 0,0  0.022,0
                Z
              " />
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
                <h1 className="text-white text-2xl font-bold leading-tight">{pageTitle}</h1>
                {pageSubtitle && (
                  <p className="text-[#6b7280] text-sm mt-0.5">{pageSubtitle}</p>
                )}
              </div>
            </div>

            {/*
              Derecha: slot para contenido extra (píldora guardar/cerrar, etc.)
              Posicionado para quedar "dentro" de la muesca, que arranca
              aproximadamente en el 77% del ancho.
            */}
            {topRightSlot && (
              <div className="flex items-center">
                {topRightSlot}
              </div>
            )}
          </div>

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
