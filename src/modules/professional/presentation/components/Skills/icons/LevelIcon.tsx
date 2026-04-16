import GlowIcon from './GlowIcon';
import { ComponentProps } from 'react';

// Definimos que LevelIcon recibe el nivel Y opcionalmente cualquier prop de GlowIcon
interface LevelIconProps extends Partial<
  Omit<ComponentProps<typeof GlowIcon>, 'children'>
> {
  level: string;
}

export const LevelIcon = ({ level, ...glowProps }: LevelIconProps) => {
  // glowProps contiene size, iconColor, bgColor, strokeWidth, etc.

  switch (level) {
    case 'Maestro':
      return (
        <GlowIcon {...glowProps}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4l4 -6" />
          </svg>
        </GlowIcon>
      );
    case 'Experto':
      return (
        <GlowIcon {...glowProps}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17.8 19.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138" />
            <path d="M6.2 19.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138" />
            <path d="M12 9.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138" />
          </svg>
        </GlowIcon>
      );
    case 'Avanzado':
      return (
        <GlowIcon {...glowProps}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
          </svg>
        </GlowIcon>
      );
    case 'Intermedio':
      return (
        <GlowIcon {...glowProps}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
            <path d="M10 12l-2 -2.2l.6 -1" />
          </svg>
        </GlowIcon>
      );
    default: // Básico
      return (
        <GlowIcon {...glowProps}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M2 9a10 10 0 1 0 20 0" />
            <path d="M12 19a10 10 0 0 1 10 -10" />
            <path d="M2 9a10 10 0 0 1 10 10" />
            <path d="M12 4a9.7 9.7 0 0 1 2.99 7.5" />
            <path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5" />
          </svg>
        </GlowIcon>
      );
  }
};
