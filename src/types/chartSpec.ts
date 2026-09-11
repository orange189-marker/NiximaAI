/**
 * Nixima AI - Chart & Graph Visualization Schema & Parsers
 */

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
  fillColor?: string;
}

export interface PyramidCohort {
  ageCohort: string; // e.g. "0-9", "10-19", ... "80+"
  male: number;
  female: number;
}

export interface FunctionPlotParams {
  equation: string; // e.g. "f(x) = 2x + 1"
  slope?: number;
  intercept?: number;
  expression?: string; // JavaScript or algebraic expression for f(x)
  xRange?: [number, number]; // default [-10, 10]
  yRange?: [number, number]; // default [-10, 10]
}

export type ChartType = 
  | 'bar' 
  | 'horizontal-bar' 
  | 'line' 
  | 'area' 
  | 'function' 
  | 'pyramid'
  | 'donut';

export interface NiximaChartSpec {
  type: ChartType;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string; // e.g. "$T", "M", "%", "B", "CR"
  labels?: string[]; // e.g. ["1960", "1970", "1980", "1990", "2000", "2010", "2020"]
  datasets?: ChartDataset[];
  // For mathematical coordinate plotting
  functionParams?: FunctionPlotParams;
  // For demographic age pyramids
  pyramidData?: PyramidCohort[];
  // Raw source
  sourceDescription?: string;
}

/**
 * Safely parses raw chart code into a valid NiximaChartSpec.
 * Supports JSON with forgiving cleanup (handling trailing commas, markdown fences, etc.)
 */
export function parseChartSpec(rawInput: string): NiximaChartSpec | null {
  if (!rawInput || !rawInput.trim()) return null;

  let cleaned = rawInput.trim();

  // Strip code block markers if accidentally included
  cleaned = cleaned.replace(/^```[a-z_-]*\n?/i, '').replace(/\n?```$/i, '').trim();

  try {
    // Attempt standard JSON parse
    const parsed = JSON.parse(cleaned);
    return normalizeChartSpec(parsed);
  } catch (_err) {
    try {
      // Attempt relaxed JSON (handle trailing commas, unquoted keys, single quotes)
      const relaxed = cleaned
        .replace(/,\s*([\]}])/g, '$1') // remove trailing commas
        .replace(/'/g, '"'); // replace single quotes with double quotes
      const parsed = JSON.parse(relaxed);
      return normalizeChartSpec(parsed);
    } catch (_err2) {
      return null;
    }
  }
}

/**
 * Validates and normalizes spec fields with sensible defaults
 */
function normalizeChartSpec(raw: any): NiximaChartSpec | null {
  if (!raw || typeof raw !== 'object') return null;

  let type: ChartType = 'bar';
  const rawType = String(raw.type || '').toLowerCase();
  if (['bar', 'horizontal-bar', 'line', 'area', 'function', 'pyramid', 'donut'].includes(rawType)) {
    type = rawType as ChartType;
  } else if (rawType.includes('line') || rawType.includes('trend')) {
    type = 'line';
  } else if (rawType.includes('area')) {
    type = 'area';
  } else if (rawType.includes('math') || rawType.includes('plot') || raw.equation) {
    type = 'function';
  } else if (rawType.includes('pyramid') || raw.pyramidData) {
    type = 'pyramid';
  }

  // Handle function plotting
  let functionParams: FunctionPlotParams | undefined = undefined;
  if (type === 'function' || raw.equation) {
    type = 'function';
    functionParams = {
      equation: raw.equation || raw.functionParams?.equation || 'f(x) = x',
      slope: typeof raw.slope === 'number' ? raw.slope : raw.functionParams?.slope,
      intercept: typeof raw.intercept === 'number' ? raw.intercept : raw.functionParams?.intercept,
      expression: raw.expression || raw.functionParams?.expression,
      xRange: Array.isArray(raw.xRange) ? raw.xRange : (raw.functionParams?.xRange || [-10, 10]),
      yRange: Array.isArray(raw.yRange) ? raw.yRange : (raw.functionParams?.yRange || [-10, 10]),
    };
  }

  // Handle demographic pyramid
  let pyramidData: PyramidCohort[] | undefined = undefined;
  if (type === 'pyramid' || Array.isArray(raw.pyramidData)) {
    type = 'pyramid';
    const cohorts = raw.pyramidData || raw.data || [];
    pyramidData = cohorts.map((c: any) => ({
      ageCohort: String(c.ageCohort || c.cohort || c.age || ''),
      male: Math.abs(Number(c.male || 0)),
      female: Math.abs(Number(c.female || 0)),
    }));
  }

  // Handle standard datasets
  let datasets: ChartDataset[] = [];
  if (Array.isArray(raw.datasets)) {
    datasets = raw.datasets.map((d: any, idx: number) => ({
      label: String(d.label || `Series ${idx + 1}`),
      data: Array.isArray(d.data) ? d.data.map(Number) : [],
      color: d.color,
      fillColor: d.fillColor,
    }));
  } else if (Array.isArray(raw.data) && type !== 'pyramid') {
    // Single array shorthand: e.g. "data": [10, 20, 30]
    if (typeof raw.data[0] === 'number') {
      datasets = [{
        label: raw.yAxisLabel || 'Value',
        data: raw.data.map(Number),
      }];
    } else if (typeof raw.data[0] === 'object') {
      // Key-value pairs: e.g. [{ label: "USA", value: 28.78 }, ...]
      const labels: string[] = [];
      const dataPoints: number[] = [];
      raw.data.forEach((item: any) => {
        labels.push(String(item.label || item.name || item.x || ''));
        dataPoints.push(Number(item.value || item.y || 0));
      });
      if (!raw.labels || raw.labels.length === 0) {
        raw.labels = labels;
      }
      datasets = [{
        label: raw.yAxisLabel || 'Value',
        data: dataPoints,
      }];
    }
  }

  return {
    type,
    title: String(raw.title || 'Data Visualization'),
    subtitle: raw.subtitle ? String(raw.subtitle) : undefined,
    xAxisLabel: raw.xAxisLabel ? String(raw.xAxisLabel) : undefined,
    yAxisLabel: raw.yAxisLabel ? String(raw.yAxisLabel) : undefined,
    unit: raw.unit ? String(raw.unit) : undefined,
    labels: Array.isArray(raw.labels) ? raw.labels.map(String) : [],
    datasets,
    functionParams,
    pyramidData,
    sourceDescription: raw.sourceDescription ? String(raw.sourceDescription) : undefined,
  };
}

/**
 * Automatically converts any Markdown Table with numeric data into a NiximaChartSpec.
 */
export function convertTableToChartSpec(
  headers: string[],
  rows: string[][],
  tableTitle?: string
): NiximaChartSpec | null {
  if (!headers || headers.length < 2 || !rows || rows.length === 0) return null;

  // 1. Identify category column (usually first column)
  const categoryColIdx = 0;
  const labels = rows.map(r => (r[categoryColIdx] || '').trim()).filter(Boolean);
  if (labels.length === 0) return null;

  // 2. Identify numeric columns
  const numericCols: { idx: number; header: string; data: number[] }[] = [];

  for (let c = 1; c < headers.length; c++) {
    const values: number[] = [];
    let isNumeric = true;

    for (let r = 0; r < rows.length; r++) {
      const cell = (rows[r][c] || '').trim();
      const stripped = cell.replace(/[$,€£%TMBB]/g, '').replace(/,/g, '');
      const num = parseFloat(stripped);
      if (isNaN(num)) {
        isNumeric = false;
        break;
      }
      values.push(num);
    }

    if (isNumeric && values.length > 0) {
      numericCols.push({
        idx: c,
        header: headers[c],
        data: values,
      });
    }
  }

  if (numericCols.length === 0) return null;

  // Detect unit from header or values
  const firstHeader = numericCols[0].header;
  let unit = '';
  if (firstHeader.includes('$') || firstHeader.toLowerCase().includes('usd')) unit = '$';
  else if (firstHeader.includes('%')) unit = '%';

  // Determine if it looks like a time series (years in labels)
  const isTimeSeries = labels.every(l => /^(19|20)\d{2}$/.test(l));
  const type: ChartType = isTimeSeries ? 'area' : (labels.length > 6 ? 'horizontal-bar' : 'bar');

  return {
    type,
    title: tableTitle || 'Table Data Visualization',
    xAxisLabel: headers[0],
    yAxisLabel: numericCols.map(c => c.header).join(' / '),
    unit,
    labels,
    datasets: numericCols.map((c, i) => ({
      label: c.header,
      data: c.data,
      color: [
        '#38bdf8', // Sky 400
        '#a855f7', // Purple 500
        '#10b981', // Emerald 500
        '#f59e0b', // Amber 500
        '#ec4899', // Pink 500
      ][i % 5],
    })),
  };
}
