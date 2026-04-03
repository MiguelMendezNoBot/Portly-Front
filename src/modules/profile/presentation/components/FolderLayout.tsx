import type { ReactNode } from 'react';

/**
 * FolderLayout
 * Renderiza el polígono tipo-carpeta (muesca en esquina superior-derecha)
 * que envuelve el contenido principal. El scroll ocurre DENTRO del polígono.
 *
 * Implementación: clip-path SVG + overflow-y scroll interno.
 */
interface FolderLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function FolderLayout({ children, className = '' }: FolderLayoutProps) {
  /**
   * Usamos un SVG clipPath para recortar el contenedor con la forma de carpeta.
   * La muesca está en la esquina superior-derecha.
   * Valores en porcentaje para que escale con cualquier tamaño.
   *
   * Shape (sentido horario):
   *  top-left (redondeada) → top hasta ~78% → bajada muesca → derecha → bottom-right → bottom-left
   */
  return (
    <div className={`relative flex-1 min-h-0 ${className}`}>
      {/* SVG oculto que define el clipPath */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-0 h-0 overflow-hidden"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <defs>
          <clipPath id="folder-clip" clipPathUnits="objectBoundingBox">
            {/*
              Polígono en coordenadas 0–1 (objectBoundingBox).
              R = radio de esquinas ≈ 0.03 (relativo al ancho).
              Muesca: comienza en x=0.79, profundidad y=0.10.
            */}
            <path d="
              M 0.03,0
              L 0.77,0
              Q 0.80,0  0.80,0.03
              L 0.80,0.07
              Q 0.80,0.10  0.83,0.10
              L 0.97,0.10
              Q 1.00,0.10  1.00,0.13
              L 1.00,0.97
              Q 1.00,1.00  0.97,1.00
              L 0.03,1.00
              Q 0.00,1.00  0.00,0.97
              L 0.00,0.03
              Q 0.00,0.00  0.03,0.00
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Contenedor recortado con la forma de carpeta */}
      <div
        className="w-full h-full"
        style={{ clipPath: 'url(#folder-clip)' }}
      >
        {/* Fondo oscuro */}
        <div className="w-full h-full bg-[#0d1117] relative">
          {/* Área scrolleable: empieza con padding-top para dejar espacio a la muesca */}
          <div
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
            style={{ paddingTop: '0px' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
