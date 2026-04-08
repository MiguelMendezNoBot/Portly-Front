import { type ReactNode } from 'react';

interface CircleButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function CircleButton({
  icon,
  onClick,
  ariaLabel,
}: CircleButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
      className="w-10 h-9 rounded-full bg-[#2a2d3e] hover:bg-[#3a3d4e] flex items-center justify-center text-white font-bold text-lg transition-colors shadow-lg border border-white/10"
    >
      {icon}
    </button>
  );
}
