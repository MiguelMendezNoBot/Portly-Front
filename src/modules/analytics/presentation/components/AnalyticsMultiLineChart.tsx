import { useRef, useEffect } from 'react';
import type { PortfolioChartSeries } from '../../domain/entities/PortfolioAnalytics';

interface AnalyticsMultiLineChartProps {
  title: string;
  subtitle?: string;
  series: PortfolioChartSeries[];
  yLabel?: string;
}

/**
 * Gráfico de líneas múltiples nativo con Canvas.
 */
export default function AnalyticsMultiLineChart({
  title,
  subtitle,
  series,
  yLabel = 'Visitas',
}: AnalyticsMultiLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || series.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 300;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const gridColor = 'rgba(255, 255, 255, 0.06)';
    const labelColor = '#6b7280';

    const padLeft = 48;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 40;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);

    // Encuentra el máximo global
    let maxVal = 1;
    let maxLen = 0;
    let labels: string[] = [];

    series.forEach((s) => {
      s.data.forEach((d) => {
        if (d.value > maxVal) maxVal = d.value;
      });
      if (s.data.length > maxLen) {
        maxLen = s.data.length;
        labels = s.data.map((d) => d.label);
      }
    });

    const { niceMax, ySteps } = calculateYAxis(maxVal);

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

    // Dibujar cada serie
    series.forEach((s) => {
      if (s.data.length === 0) return;
      const points: { x: number; y: number }[] = s.data.map((d, i) => ({
        x: padLeft + (chartW / (s.data.length - 1 || 1)) * i,
        y: padTop + chartH - (chartH * d.value) / niceMax,
      }));

      ctx.beginPath();
      drawSmoothLine(ctx, points);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Etiquetas X
    if (labels.length > 0) {
      ctx.fillStyle = labelColor;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const maxLabels = Math.floor(chartW / 60);
      const step = Math.max(1, Math.ceil(labels.length / maxLabels));
      labels.forEach((label, i) => {
        if (i % step === 0 || i === labels.length - 1) {
          const x = padLeft + (chartW / (labels.length - 1 || 1)) * i;
          ctx.fillText(label, x, padTop + chartH + 10);
        }
      });
    }
  }, [series]);

  if (series.length === 0 || series.every((s) => s.data.length === 0)) {
    return (
      <div className="bg-src-171b28 border border-white/5 rounded-2xl p-5">
        <h3 className="text-white font-bold text-base mb-1">{title}</h3>
        {subtitle && <p className="text-src-6b7280 text-sm mb-4">{subtitle}</p>}
        <p className="text-src-5a6278 text-sm">Sin datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-src-171b28 border border-white/5 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
      {subtitle && <p className="text-src-6b7280 text-sm mb-6">{subtitle}</p>}
      
      <div className="relative" ref={containerRef}>
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-src-6b7280 font-medium tracking-wider select-none">
          {yLabel}
        </span>
        <canvas ref={canvasRef} className="w-full" />
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {series.map((s) => (
          <div key={s.portfolioId} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-src-9ca3af text-xs font-medium">
              {s.portfolioName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function drawSmoothLine(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[]
) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < pts.length - 1; i++) {
    const xMid = (pts[i].x + pts[i + 1].x) / 2;
    const yMid = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xMid, yMid);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x, last.y);
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
