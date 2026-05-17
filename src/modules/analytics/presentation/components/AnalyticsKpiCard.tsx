import type { ReactNode } from 'react';

interface AnalyticsKpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconColor?: string;
}

/**
 * Card de KPI para la vista de analíticas.
 * Diseño dark consistente con la paleta del proyecto.
 */
export default function AnalyticsKpiCard({
  icon,
  label,
  value,
  iconColor = '#7c6bec',
}: AnalyticsKpiCardProps) {
  return (
    <div className="bg-src-171b28 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 min-w-0 transition-all hover:border-white/10">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${iconColor}20`, color: iconColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-src-6b7280 text-xs font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-white text-2xl font-bold mt-1 leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}
