import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { PortfolioChartSeries } from '../../domain/entities/PortfolioAnalytics';

interface AnalyticsMultiLineChartProps {
  title: string;
  subtitle?: string;
  series: PortfolioChartSeries[];
  period?: string;
  yLabel?: string;
}

export default function AnalyticsMultiLineChart({
  title,
  subtitle,
  series,
  period = '24h',
  yLabel = 'Visitas',
}: AnalyticsMultiLineChartProps) {
  if (series.length === 0 || series.every((s) => s.data.length === 0)) {
    return (
      <div className="bg-src-171b28 border border-white/5 rounded-2xl p-6 shadow-lg min-h-[400px] flex flex-col justify-center items-center text-center">
        <div className="w-full text-left self-start">
            <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
            {subtitle && <p className="text-src-6b7280 text-sm mb-4">{subtitle}</p>}
        </div>
        <p className="text-src-5a6278 text-sm flex-1 flex items-center justify-center">Sin datos para mostrar</p>
      </div>
    );
  }

  // ── Clave: Filtrar nulls para que cada serie solo tenga sus puntos REALES ──
  // ApexCharts puede dibujar series con diferente cantidad de puntos y rangos X distintos.
  // Esto evita que el algoritmo interno de proximidad se confunda con nulls.
  const chartSeries = series.map(s => ({
    name: s.portfolioName,
    data: s.data
      .filter(d => d.value != null)  // ← Solo puntos donde el portafolio YA existía
      .map(d => ({
        x: new Date(d.label).getTime(),
        y: Number(d.value)
      }))
  }));

  const colors = series.map(s => s.color);

  let minX = Infinity;
  let maxX = -Infinity;
  series.forEach(s => {
    s.data.forEach(d => {
      const time = new Date(d.label).getTime();
      if (time < minX) minX = time;
      if (time > maxX) maxX = time;
    });
  });

  // Anotaciones: punto de inicio para cada serie
  const annotationPoints: any[] = [];
  chartSeries.forEach((s, idx) => {
    if (s.data.length > 0) {
      annotationPoints.push({
        x: s.data[0].x,
        y: s.data[0].y,
        marker: {
          size: 8,
          fillColor: '#ffffff',
          strokeColor: colors[idx] || '#ffffff',
          strokeWidth: 3,
          shape: 'circle'
        }
      });
    }
  });

  const options: ApexOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    theme: { mode: 'dark' },
    colors: colors,
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    xaxis: {
      type: 'datetime',
      min: minX !== Infinity ? minX : undefined,
      max: maxX !== -Infinity ? maxX : undefined,
      tickAmount: period === '24h' ? 8 : period === '7d' ? 7 : period === '30d' ? 10 : undefined,
      labels: {
        style: { colors: '#6b7280', fontSize: '11px', fontFamily: 'Inter' },
        datetimeUTC: false,
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: period === '24h' ? 'HH:mm' : 'dd MMM'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#6b7280', fontSize: '11px', fontFamily: 'Inter' },
        formatter: (val) => Math.round(val).toString()
      },
      title: {
        text: yLabel,
        style: { color: '#6b7280', fontSize: '10px', fontWeight: 500 }
      },
      min: 0,
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.06)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 25, bottom: 15, left: 10 }
    },
    annotations: {
      points: annotationPoints
    },
    markers: {
      size: 0,
      hover: {
        size: 7
      }
    },
    legend: {
      position: 'bottom',
      labels: { colors: '#9ca3af' },
      markers: { size: 6 }
    },
    tooltip: {
      shared: false,
      intersect: false,
      theme: 'dark',
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const serie = w.config.series[seriesIndex];
        const point = serie.data[dataPointIndex];
        if (!point) return '';

        const color = w.globals.colors[seriesIndex];
        const dateStr = period === '24h'
          ? new Date(point.x).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : new Date(point.x).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

        return `
          <div style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); font-family: Inter, sans-serif; min-width: 150px;">
            <div style="margin-bottom: 10px; font-size: 11px; color: #9ca3af; font-weight: 600;">${dateStr}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; display: inline-block;"></span>
                <span style="color: #cbd5e1; font-weight: 500;">${serie.name}</span>
              </div>
              <span style="font-weight: 600; color: #ffffff; margin-left: 20px;">${point.y} visitas</span>
            </div>
          </div>
        `;
      }
    }
  };

  return (
    <div className="bg-src-171b28 border border-white/5 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-white/10 relative overflow-hidden">
      {/* Decorative gradient blur in background based on the first series color */}
      {colors[0] && (
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2 opacity-10" 
          style={{ backgroundColor: colors[0] }}
        />
      )}
      
      <div className="relative z-10">
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        {subtitle && <p className="text-src-6b7280 text-sm mb-6">{subtitle}</p>}
        
        <div className="w-full h-[320px]">
          <Chart options={options} series={chartSeries} type="area" height="100%" />
        </div>
      </div>
    </div>
  );
}
