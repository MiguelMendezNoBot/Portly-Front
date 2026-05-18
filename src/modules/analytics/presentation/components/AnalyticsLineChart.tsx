import { useRef, useEffect } from 'react';
import type { ChartPoint } from '../../domain/entities/PortfolioAnalytics';

interface AnalyticsLineChartProps {
  title: string;
  data: ChartPoint[];
  yLabel?: string;
}

/**
 * Gráfico de línea nativo con Canvas para visualizar visitas.
 * Sin dependencias externas — consistente con la paleta del proyecto.
 */
export default function AnalyticsLineChart({
  title,
  data,
  yLabel = 'Visitas',
}: AnalyticsLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || data.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 280;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Colors
    const accentColor = '#7c6bec';
    const gridColor = 'rgba(255, 255, 255, 0.06)';
    const labelColor = '#6b7280';
    const fillGradientTop = 'rgba(124, 107, 236, 0.25)';
    const fillGradientBottom = 'rgba(124, 107, 236, 0.02)';

    // Chart area padding
    const padLeft = 48;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 40;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const values = data.map((d) => d.value).filter((v) => v !== null) as number[];
    const maxVal = values.length > 0 ? Math.max(...values, 1) : 1;

    // Calculate nice round numbers for Y axis
    const { niceMax, ySteps } = calculateYAxis(maxVal);

    // Draw horizontal grid lines + Y labels
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= ySteps; i++) {
      const val = Math.round((niceMax / ySteps) * i);
      const y = padTop + chartH - (chartH * i) / ySteps;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();

      ctx.fillStyle = labelColor;
      ctx.fillText(String(val), padLeft - 8, y);
    }

    // X positions
    const points: { x: number; y: number | null }[] = data.map((d, i) => ({
      x: padLeft + (chartW / (data.length - 1 || 1)) * i,
      y: d.value === null ? null : padTop + chartH - (chartH * d.value) / niceMax,
    }));

    const validPts = points.filter(p => p.y !== null) as {x: number, y: number}[];

    if (validPts.length > 0) {
      // Fill area under curve
      const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
      gradient.addColorStop(0, fillGradientTop);
      gradient.addColorStop(1, fillGradientBottom);

      ctx.beginPath();
      ctx.moveTo(validPts[0].x, padTop + chartH);
      drawSmoothLine(ctx, validPts);
      ctx.lineTo(validPts[validPts.length - 1].x, padTop + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      drawSmoothLine(ctx, validPts);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // X labels (show subset to avoid overlap)
    ctx.fillStyle = labelColor;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxLabels = Math.floor(chartW / 60);
    const step = Math.max(1, Math.ceil(data.length / maxLabels));
    data.forEach((d, i) => {
      if (i % step === 0 || i === data.length - 1) {
        ctx.fillText(d.label, points[i].x, padTop + chartH + 10);
      }
    });
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-src-171b28 border border-white/5 rounded-2xl p-5">
        <h3 className="text-white font-bold text-base mb-4">{title}</h3>
        <p className="text-src-5a6278 text-sm">Sin datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-src-171b28 border border-white/5 rounded-2xl p-5">
      <h3 className="text-white font-bold text-base mb-2">{title}</h3>
      <div className="relative" ref={containerRef}>
        {/* Y-axis label */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-src-6b7280 font-medium tracking-wider select-none">
          {yLabel}
        </span>
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Smooth curve through points using quadratic bezier */
function drawSmoothLine(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[]
) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
}

function calculateYAxis(maxVal: number): { niceMax: number, ySteps: number, step: number } {
  if (maxVal <= 0) return { niceMax: 4, ySteps: 4, step: 1 };
  
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const normalized = maxVal / magnitude; 
  
  let step: number;
  if (normalized <= 1.5) step = 0.2 * magnitude; 
  else if (normalized <= 3) step = 0.5 * magnitude;
  else if (normalized <= 6) step = 1 * magnitude;
  else step = 2 * magnitude;

  step = Math.max(1, Math.ceil(step));
  
  const ySteps = Math.ceil(maxVal / step);
  const finalYSteps = Math.max(3, ySteps);
  
  return { 
    niceMax: finalYSteps * step, 
    ySteps: finalYSteps, 
    step 
  };
}
