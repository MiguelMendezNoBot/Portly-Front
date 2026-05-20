import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { ChartPoint } from '../../domain/entities/PortfolioAnalytics';

interface AnalyticsLineChartProps {
  title: string;
  data: ChartPoint[];
  period?: string;
  yLabel?: string;
}

export default function AnalyticsLineChart({
  title,
  data,
  period = '24h',
  yLabel = 'Visitas',
}: AnalyticsLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-src-171b28 border border-white/5 rounded-2xl p-6 shadow-lg min-h-[340px] flex flex-col justify-center items-center text-center">
        <h3 className="text-white font-bold text-base mb-4 w-full text-left self-start">{title}</h3>
        <p className="text-src-5a6278 text-sm flex-1 flex items-center justify-center">Sin datos para mostrar</p>
      </div>
    );
  }

  const series = [
    {
      name: 'Visitas',
      data: data.map(d => ({
        x: new Date(d.label).getTime(),
        y: d.value == null ? null : Number(d.value)
      }))
    }
  ];

  const firstValidIndex = series[0].data.findIndex(d => d.y !== null);
  
  const discreteMarkers: any[] = [];
  series.forEach((s, sIdx) => {
    s.data.forEach((p, pIdx) => {
      if (p.y !== null && (pIdx === firstValidIndex || (p.y as number) > 0)) {
        discreteMarkers.push({
          seriesIndex: sIdx,
          dataPointIndex: pIdx,
          fillColor: '#ffffff',
          strokeColor: '#7c6bec',
          size: 4
        });
      }
    });
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
    theme: {
      mode: 'dark'
    },
    colors: ['#7c6bec'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      type: 'datetime',
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
      padding: { top: 0, right: 25, bottom: 0, left: 10 }
    },
    markers: {
      size: 0, 
      discrete: discreteMarkers,
      hover: {
        size: 7
      }
    },
    tooltip: {
      theme: 'dark',
      x: { format: period === '24h' ? 'dd MMM yyyy HH:mm' : 'dd MMM yyyy' },
      y: { formatter: (val) => `${val} visitas` },
      marker: { show: false }
    }
  };

  return (
    <div className="bg-src-171b28 border border-white/5 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-white/10 relative overflow-hidden">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c6bec] rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2 opacity-10" />
      
      <h3 className="text-white font-bold text-base mb-4 relative z-10">{title}</h3>
      <div className="w-full h-[280px] relative z-10">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
    </div>
  );
}
