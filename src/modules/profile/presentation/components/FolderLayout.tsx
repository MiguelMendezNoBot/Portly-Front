import type { ReactNode } from 'react';

interface FolderLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function FolderLayout({
  children,
  className = '',
}: FolderLayoutProps) {
  return (
    <div className={`relative flex-1 min-h-0 ${className}`}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-0 h-0 overflow-hidden"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <defs>
          <clipPath id="folder-clip" clipPathUnits="objectBoundingBox">
            <path
              d="
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
            "
            />
          </clipPath>
        </defs>
      </svg>

      <div className="w-full h-full" style={{ clipPath: 'url(#folder-clip)' }}>
        <div className="w-full h-full bg-[#0d1117] relative">
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
