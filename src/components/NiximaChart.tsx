import React, { useState, useMemo, useRef } from 'react';
import { 
  BarChart3, 
  LineChart, 
  TrendingUp, 
  Table as TableIcon, 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Activity, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { NiximaChartSpec, ChartType, PyramidCohort } from '../types/chartSpec';
import { useLanguage } from '../context/LanguageContext';
import { playCompletionChime } from '../utils/sound';

interface NiximaChartProps {
  spec: NiximaChartSpec;
  rawCode?: string;
  className?: string;
}

export const NiximaChart: React.FC<NiximaChartProps> = ({ spec, rawCode, className = '' }) => {
  const { language } = useLanguage();
  const [activeType, setActiveType] = useState<ChartType>(spec.type);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mathHoverX, setMathHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleCopySpec = () => {
    const textToCopy = rawCode || JSON.stringify(spec, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopiedSpec(true);
    playCompletionChime();
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${spec.title.toLowerCase().replace(/\s+/g, '-') || 'nixima-chart'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playCompletionChime();
  };

  // Color palette for multiple series
  const defaultColors = [
    { stroke: '#38bdf8', fill: 'url(#gradient-cyan)', solid: '#38bdf8' }, // Sky/Cyan
    { stroke: '#a855f7', fill: 'url(#gradient-purple)', solid: '#a855f7' }, // Purple
    { stroke: '#10b981', fill: 'url(#gradient-emerald)', solid: '#10b981' }, // Emerald
    { stroke: '#f59e0b', fill: 'url(#gradient-amber)', solid: '#f59e0b' }, // Amber
    { stroke: '#ec4899', fill: 'url(#gradient-pink)', solid: '#ec4899' }, // Pink
  ];

  // Primary dataset extraction
  const labels = spec.labels || [];
  const datasets = spec.datasets || [];
  const primaryData = datasets[0]?.data || [];

  // Calculation of bounds
  const { minValue, maxValue } = useMemo(() => {
    if (datasets.length === 0) return { minValue: 0, maxValue: 100 };
    let min = Infinity;
    let max = -Infinity;
    datasets.forEach(d => {
      d.data.forEach(v => {
        if (v < min) min = v;
        if (v > max) max = v;
      });
    });
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 100;
    // Anchor to zero if positive
    const adjustedMin = min > 0 ? 0 : min;
    const adjustedMax = max === 0 ? 10 : max * 1.1; // 10% headroom
    return { minValue: adjustedMin, maxValue: adjustedMax };
  }, [datasets]);

  // Format value with units
  const formatVal = (val: number) => {
    const formatted = val >= 1000 ? val.toLocaleString() : val.toFixed(val % 1 === 0 ? 0 : 2);
    if (spec.unit) {
      if (spec.unit === '$' || spec.unit === '$T' || spec.unit === '$B') {
        return `${spec.unit}${formatted}`;
      }
      return `${formatted} ${spec.unit}`;
    }
    return formatted;
  };

  // -------------------------------------------------------------
  // RENDERER 1: MATHEMATICAL FUNCTION PLOTTER
  // -------------------------------------------------------------
  const renderFunctionPlot = () => {
    const width = 600;
    const height = 340;
    const padding = 45;

    // Parse slope and intercept if linear: f(x) = mx + b
    const fnParams = spec.functionParams || { equation: 'f(x) = 2x + 1' };
    let slope = fnParams.slope;
    let intercept = fnParams.intercept;

    if (slope === undefined || intercept === undefined) {
      // Try to parse from equation string: e.g. "f(x) = 2x + 1" or "y = -0.5x - 4"
      const eq = (fnParams.equation || '').replace(/\s+/g, '');
      const match = eq.match(/(?:f\(x\)|y)=?([+-]?\d*\.?\d*)x([+-]\d*\.?\d*)?/i);
      if (match) {
        const mStr = match[1];
        slope = mStr === '' || mStr === '+' ? 1 : mStr === '-' ? -1 : parseFloat(mStr);
        intercept = match[2] ? parseFloat(match[2]) : 0;
      } else {
        slope = 2;
        intercept = 1;
      }
    }

    const xMin = fnParams.xRange?.[0] ?? -10;
    const xMax = fnParams.xRange?.[1] ?? 10;
    const yMin = fnParams.yRange?.[0] ?? -10;
    const yMax = fnParams.yRange?.[1] ?? 10;

    // Coordinate transforms
    const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const toSvgY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    const fromSvgX = (svgX: number) => xMin + ((svgX - padding) / (width - 2 * padding)) * (xMax - xMin);

    const originX = toSvgX(0);
    const originY = toSvgY(0);

    // Compute line endpoints clipped to xMin, xMax
    const p1x = xMin;
    const p1y = slope * p1x + intercept;
    const p2x = xMax;
    const p2y = slope * p2x + intercept;

    // Root (x-intercept): y = 0 => x = -b / m
    const rootX = slope !== 0 ? -intercept / slope : null;

    // Interactive hover evaluation
    const currentX = mathHoverX !== null ? mathHoverX : 2;
    const currentY = slope * currentX + intercept;

    return (
      <div className="space-y-4">
        <div className="relative w-full overflow-hidden rounded-xl bg-zinc-950/80 border border-zinc-800 p-2 select-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const svgX = ((e.clientX - rect.left) / rect.width) * width;
              const boundedSvgX = Math.max(padding, Math.min(width - padding, svgX));
              setMathHoverX(parseFloat(fromSvgX(boundedSvgX).toFixed(2)));
            }}
            onMouseLeave={() => setMathHoverX(null)}
          >
            <defs>
              <pattern id="grid-pattern" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              </pattern>
              <linearGradient id="math-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Grid background */}
            <rect x={padding} y={padding} width={width - 2 * padding} height={height - 2 * padding} fill="url(#grid-pattern)" />

            {/* Axes: X and Y */}
            <line x1={padding} y1={originY} x2={width - padding} y2={originY} stroke="#71717a" strokeWidth="1.5" />
            <line x1={originX} y1={padding} x2={originX} y2={height - padding} stroke="#71717a" strokeWidth="1.5" />

            {/* Axis arrowheads */}
            <polygon points={`${width - padding + 6},${originY} ${width - padding},${originY - 3} ${width - padding},${originY + 3}`} fill="#a1a1aa" />
            <polygon points={`${originX},${padding - 6} ${originX - 3},${padding} ${originX + 3},${padding}`} fill="#a1a1aa" />

            <text x={width - padding + 12} y={originY + 4} fill="#a1a1aa" fontSize="10" fontFamily="monospace">X</text>
            <text x={originX - 4} y={padding - 10} fill="#a1a1aa" fontSize="10" fontFamily="monospace">Y</text>

            {/* Axis Ticks */}
            {[-8, -4, 4, 8].map(tick => (
              <g key={`x-tick-${tick}`}>
                <line x1={toSvgX(tick)} y1={originY - 3} x2={toSvgX(tick)} y2={originY + 3} stroke="#71717a" strokeWidth="1" />
                <text x={toSvgX(tick)} y={originY + 14} fill="#71717a" fontSize="9" textAnchor="middle" fontFamily="monospace">{tick}</text>
              </g>
            ))}

            {[-8, -4, 4, 8].map(tick => (
              <g key={`y-tick-${tick}`}>
                <line x1={originX - 3} y1={toSvgY(tick)} x2={originX + 3} y2={toSvgY(tick)} stroke="#71717a" strokeWidth="1" />
                <text x={originX - 7} y={toSvgY(tick) + 3} fill="#71717a" fontSize="9" textAnchor="end" fontFamily="monospace">{tick}</text>
              </g>
            ))}

            {/* Linear Function Line */}
            <line
              x1={toSvgX(p1x)}
              y1={toSvgY(p1y)}
              x2={toSvgX(p2x)}
              y2={toSvgY(p2y)}
              stroke="url(#math-line-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            />

            {/* Key Points: Y-Intercept (0, b) */}
            <circle cx={toSvgX(0)} cy={toSvgY(intercept)} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

            {/* Key Points: X-Intercept (Root) */}
            {rootX !== null && rootX >= xMin && rootX <= xMax && (
              <circle cx={toSvgX(rootX)} cy={toSvgY(0)} r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
            )}

            {/* Active Hover Crosshair & Indicator Point */}
            {mathHoverX !== null && (
              <g>
                <line x1={toSvgX(currentX)} y1={padding} x2={toSvgX(currentX)} y2={height - padding} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1={padding} y1={toSvgY(currentY)} x2={width - padding} y2={toSvgY(currentY)} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <circle cx={toSvgX(currentX)} cy={toSvgY(currentY)} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
              </g>
            )}
          </svg>

          {/* Interactive Floating Hover Pill */}
          <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 px-3 py-2 rounded-xl text-xs font-mono shadow-xl space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Point Coordinates</span>
            </div>
            <div className="text-zinc-200">
              x = <span className="text-white font-bold">{currentX.toFixed(2)}</span>
            </div>
            <div className="text-zinc-200">
              y = <span className="text-white font-bold">{currentY.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Function Telemetry & Formula Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Equation</span>
            <div className="text-sm font-bold text-white tracking-tight">{fnParams.equation}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Slope (m)</span>
            <div className="text-sm font-bold text-cyan-400">
              {slope >= 0 ? `+${slope.toFixed(2)}` : slope.toFixed(2)}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Y-Intercept (0, b)</span>
            <div className="text-sm font-bold text-purple-400">(0, {intercept.toFixed(2)})</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Root (x-intercept)</span>
            <div className="text-sm font-bold text-emerald-400">
              {rootX !== null ? `(${rootX.toFixed(2)}, 0)` : 'None'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDERER 2: DEMOGRAPHIC POPULATION PYRAMID
  // -------------------------------------------------------------
  const renderPopulationPyramid = () => {
    const cohorts: PyramidCohort[] = spec.pyramidData || [
      { ageCohort: '80+', male: 1.8, female: 2.5 },
      { ageCohort: '70-79', male: 3.2, female: 4.1 },
      { ageCohort: '60-69', male: 5.6, female: 6.2 },
      { ageCohort: '50-59', male: 7.8, female: 8.1 },
      { ageCohort: '40-49', male: 8.9, female: 8.8 },
      { ageCohort: '30-39', male: 9.7, female: 9.4 },
      { ageCohort: '20-29', male: 10.2, female: 9.8 },
      { ageCohort: '10-19', male: 9.8, female: 9.3 },
      { ageCohort: '0-9', male: 9.4, female: 8.9 },
    ];

    const maxCohortVal = Math.max(...cohorts.flatMap(c => [c.male, c.female])) * 1.15;
    const totalMale = cohorts.reduce((acc, c) => acc + c.male, 0);
    const totalFemale = cohorts.reduce((acc, c) => acc + c.female, 0);
    const grandTotal = totalMale + totalFemale;

    return (
      <div className="space-y-4">
        {/* Pyramid Legend */}
        <div className="flex items-center justify-between text-xs font-mono px-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-3 h-3 rounded-sm bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span>MALE ({((totalMale / grandTotal) * 100).toFixed(1)}%)</span>
          </div>
          <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold">AGE COHORT</span>
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <span>FEMALE ({((totalFemale / grandTotal) * 100).toFixed(1)}%)</span>
            <span className="w-3 h-3 rounded-sm bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          </div>
        </div>

        {/* Pyramid Horizontal Rows */}
        <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
          {cohorts.map((c, idx) => {
            const maleWidth = (c.male / maxCohortVal) * 100;
            const femaleWidth = (c.female / maxCohortVal) * 100;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={c.ageCohort}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-all duration-150 cursor-pointer ${
                  isHovered ? 'bg-zinc-800/80' : 'hover:bg-zinc-900/50'
                }`}
              >
                {/* Male Bar (Grows from Right to Left) */}
                <div className="flex-1 flex justify-end items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 font-medium">{c.male}</span>
                  <div className="w-full max-w-[160px] sm:max-w-[200px] h-5 bg-zinc-900 rounded overflow-hidden flex justify-end">
                    <div
                      style={{ width: `${maleWidth}%` }}
                      className="h-full bg-gradient-to-l from-cyan-400 to-blue-600 rounded-l transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Center Age Label */}
                <div className="w-14 sm:w-16 text-center text-xs font-mono font-bold text-white bg-zinc-900/90 py-0.5 rounded border border-zinc-800">
                  {c.ageCohort}
                </div>

                {/* Female Bar (Grows from Left to Right) */}
                <div className="flex-1 flex justify-start items-center gap-2">
                  <div className="w-full max-w-[160px] sm:max-w-[200px] h-5 bg-zinc-900 rounded overflow-hidden flex justify-start">
                    <div
                      style={{ width: `${femaleWidth}%` }}
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-600 rounded-r transition-all duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-medium">{c.female}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pyramid Demographics Telemetry */}
        <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Demographic Structure: <strong className="text-white">Constrictive / Modern Transition</strong></span>
          </div>
          <div>
            Sex Ratio: <strong className="text-white">{(totalMale / totalFemale).toFixed(3)} M/F</strong>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDERER 3: BAR / HORIZONTAL BAR CHART (e.g. GDP Rankings)
  // -------------------------------------------------------------
  const renderBarChart = (isHorizontal: boolean = false) => {
    if (isHorizontal) {
      // Horizontal Bar layout (Perfect for ranked lists like World GDP)
      return (
        <div className="space-y-2 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
          {labels.map((label, idx) => {
            const val = primaryData[idx] ?? 0;
            const percentage = maxValue > 0 ? (val / maxValue) * 100 : 0;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={`${label}-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  isHovered ? 'bg-zinc-800/80 shadow-md' : 'hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold w-5">{idx + 1}.</span>
                    <span className="text-white font-semibold">{label}</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{formatVal(val)}</span>
                </div>
                <div className="w-full h-3.5 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800/80">
                  <div
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Vertical Bar Chart
    const svgWidth = 600;
    const svgHeight = 280;
    const paddingLeft = 50;
    const paddingBottom = 40;
    const paddingTop = 20;
    const paddingRight = 20;

    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;
    const barWidth = Math.min(36, (chartWidth / labels.length) * 0.65);

    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-zinc-950/80 border border-zinc-800 p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
        >
          <defs>
            <linearGradient id="bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = minValue + (maxValue - minValue) * ratio;
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={paddingLeft - 8} y={y + 3} fill="#71717a" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(val % 1 === 0 ? 0 : 1)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {labels.map((label, idx) => {
            const val = primaryData[idx] ?? 0;
            const barHeight = maxValue > 0 ? (val / maxValue) * chartHeight : 0;
            const x = paddingLeft + (idx + 0.5) * (chartWidth / labels.length) - barWidth / 2;
            const y = paddingTop + chartHeight - barHeight;
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill={isHovered ? '#67e8f9' : 'url(#bar-grad)'}
                  className="transition-all duration-200"
                />
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - 14}
                  fill={isHovered ? '#ffffff' : '#a1a1aa'}
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {label.length > 8 ? `${label.slice(0, 7)}…` : label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && labels[hoveredIndex] && (
          <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs font-mono shadow-xl flex items-center gap-2">
            <span className="text-zinc-400">{labels[hoveredIndex]}:</span>
            <strong className="text-cyan-400">{formatVal(primaryData[hoveredIndex] ?? 0)}</strong>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDERER 4: LINE & AREA CHART (e.g. Population 1960-2020)
  // -------------------------------------------------------------
  const renderLineAreaChart = (isArea: boolean = true) => {
    const svgWidth = 600;
    const svgHeight = 280;
    const paddingLeft = 50;
    const paddingBottom = 40;
    const paddingTop = 25;
    const paddingRight = 25;

    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;

    // Generate path points
    const points = labels.map((_label, idx) => {
      const val = primaryData[idx] ?? 0;
      const x = paddingLeft + (idx / Math.max(labels.length - 1, 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((val - minValue) / Math.max(maxValue - minValue, 1)) * chartHeight;
      return { x, y, val };
    });

    // Smooth Bézier curve string
    const linePath = points.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');

    // Closed Area path
    const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0},${paddingTop + chartHeight} L ${points[0]?.x || 0},${paddingTop + chartHeight} Z`;

    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-zinc-950/80 border border-zinc-800 p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
        >
          <defs>
            <linearGradient id="line-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="line-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = minValue + (maxValue - minValue) * ratio;
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={paddingLeft - 8} y={y + 3} fill="#71717a" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(val % 1 === 0 ? 0 : 1)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {isArea && (
            <path d={areaPath} fill="url(#line-area-grad)" />
          )}

          {/* Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#line-stroke-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6.5 : 4}
                  fill={isHovered ? '#ffffff' : '#38bdf8'}
                  stroke="#09090b"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                <text
                  x={pt.x}
                  y={svgHeight - 14}
                  fill={isHovered ? '#ffffff' : '#a1a1aa'}
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {labels[idx]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && labels[hoveredIndex] && (
          <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs font-mono shadow-xl flex items-center gap-2">
            <span className="text-zinc-400">{labels[hoveredIndex]}:</span>
            <strong className="text-cyan-400">{formatVal(primaryData[hoveredIndex] ?? 0)}</strong>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDERER 5: EMBEDDED DATA TABLE VIEW
  // -------------------------------------------------------------
  const renderDataTable = () => {
    return (
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">{spec.xAxisLabel || 'Label / Category'}</th>
              <th className="py-2.5 px-3 text-right">{spec.yAxisLabel || 'Value'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {labels.map((label, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                <td className="py-2 px-3 text-zinc-500">{idx + 1}</td>
                <td className="py-2 px-3 font-semibold text-white">{label}</td>
                <td className="py-2 px-3 text-right font-mono text-cyan-400">
                  {formatVal(primaryData[idx] ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`my-4 rounded-2xl border border-zinc-700/80 bg-[#0c0c11] shadow-[0_8px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden transition-all ${className} ${isExpanded ? 'fixed inset-4 z-50 flex flex-col justify-between max-w-6xl mx-auto' : ''}`}>
      {/* Chart Header Bar */}
      <div className="p-3.5 sm:p-4 border-b border-zinc-800/90 bg-gradient-to-r from-zinc-950 via-[#101016] to-zinc-950 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white text-black uppercase tracking-wider">
              NIXIMA GRAPH
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              {activeType}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {spec.title}
          </h3>
          {spec.subtitle && (
            <p className="text-xs text-zinc-400">{spec.subtitle}</p>
          )}
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          {/* Chart vs Table Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'chart' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Toggle between Graph and Table"
          >
            {viewMode === 'chart' ? <BarChart3 className="w-3.5 h-3.5" /> : <TableIcon className="w-3.5 h-3.5" />}
            <span>{viewMode === 'chart' ? 'Chart' : 'Table'}</span>
          </button>

          {/* Type Selector (when in Chart view & not specialized function/pyramid) */}
          {viewMode === 'chart' && spec.type !== 'function' && spec.type !== 'pyramid' && (
            <div className="flex items-center gap-0.5 border-l border-zinc-800 pl-1.5">
              <button
                type="button"
                onClick={() => setActiveType('bar')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  activeType === 'bar' || activeType === 'horizontal-bar' ? 'text-cyan-400 bg-zinc-800' : 'text-zinc-400 hover:text-white'
                }`}
                title="Bar Chart"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveType('line')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  activeType === 'line' ? 'text-cyan-400 bg-zinc-800' : 'text-zinc-400 hover:text-white'
                }`}
                title="Line Chart"
              >
                <LineChart className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveType('area')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  activeType === 'area' ? 'text-cyan-400 bg-zinc-800' : 'text-zinc-400 hover:text-white'
                }`}
                title="Area Chart"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Utility Tools */}
          <div className="flex items-center gap-0.5 border-l border-zinc-800 pl-1.5">
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Download SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCopySpec}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Copy Chart JSON"
            >
              {copiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Fullscreen'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="p-3.5 sm:p-5">
        {viewMode === 'table' ? (
          renderDataTable()
        ) : activeType === 'function' ? (
          renderFunctionPlot()
        ) : activeType === 'pyramid' ? (
          renderPopulationPyramid()
        ) : activeType === 'horizontal-bar' ? (
          renderBarChart(true)
        ) : activeType === 'bar' ? (
          renderBarChart(false)
        ) : activeType === 'line' ? (
          renderLineAreaChart(false)
        ) : (
          renderLineAreaChart(true)
        )}
      </div>
    </div>
  );
};
