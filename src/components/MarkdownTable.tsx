import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MathRenderer } from './MathRenderer';

export interface TableBlockData {
  headers: string[];
  alignments: ('left' | 'center' | 'right')[];
  rows: string[][];
  rawMarkdown: string;
}

interface MarkdownTableProps {
  data: TableBlockData;
}

export const MarkdownTable: React.FC<MarkdownTableProps> = ({ data }) => {
  const { t } = useLanguage();
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterQuery, setFilterQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Toggle sorting on column click
  const handleSort = (colIdx: number) => {
    if (sortCol === colIdx) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortCol(null);
        setSortDir('asc');
      }
    } else {
      setSortCol(colIdx);
      setSortDir('asc');
    }
  };

  // Determine intelligent column alignment
  const getAlignment = (colIdx: number): 'left' | 'center' | 'right' => {
    const explicit = data.alignments[colIdx];
    if (explicit && explicit !== 'left') return explicit;

    const headerName = (data.headers[colIdx] || '').toLowerCase().trim();
    if (['rank', '#', 'no', 'no.', 'id', 'pos', 'index', 'status'].includes(headerName)) {
      return 'center';
    }

    // Check if values in this column are predominantly numeric
    const sampleValues = data.rows.slice(0, 8).map(r => (r[colIdx] || '').trim());
    const isMostlyNumeric = sampleValues.length > 0 && sampleValues.every(val => {
      if (!val) return true;
      const stripped = val.replace(/[^\d.-]/g, '');
      return stripped.length > 0 && !isNaN(Number(stripped));
    });

    return isMostlyNumeric ? 'right' : 'left';
  };

  // Filtered & Sorted Rows
  const processedRows = useMemo(() => {
    let result = [...data.rows];

    // Filter
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      result = result.filter(row =>
        row.some(cell => cell.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortCol !== null && sortCol < data.headers.length) {
      result.sort((a, b) => {
        const valA = (a[sortCol] || '').trim();
        const valB = (b[sortCol] || '').trim();

        const numA = parseFloat(valA.replace(/[^\d.-]/g, ''));
        const numB = parseFloat(valB.replace(/[^\d.-]/g, ''));

        const isNumA = !isNaN(numA) && valA.replace(/[^\d.-]/g, '').length > 0;
        const isNumB = !isNaN(numB) && valB.replace(/[^\d.-]/g, '').length > 0;

        if (isNumA && isNumB) {
          return sortDir === 'asc' ? numA - numB : numB - numA;
        }

        return sortDir === 'asc'
          ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
          : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return result;
  }, [data.rows, filterQuery, sortCol, sortDir, data.headers.length]);

  // Copy as Markdown
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(data.rawMarkdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // Generate & Copy CSV
  const generateCSVString = () => {
    const escapeCsv = (cell: string) => {
      const cleaned = cell.replace(/"/g, '""');
      return cleaned.includes(',') || cleaned.includes('\n') || cleaned.includes('"')
        ? `"${cleaned}"`
        : cleaned;
    };
    const headerLine = data.headers.map(escapeCsv).join(',');
    const rowLines = data.rows.map(r => r.map(escapeCsv).join(','));
    return [headerLine, ...rowLines].join('\n');
  };

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(generateCSVString());
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  // Download as .csv file
  const handleDownloadCSV = () => {
    const csvContent = generateCSVString();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nixima_table_${Date.now().toString().slice(-4)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Helper to distinguish valid inline LaTeX math from currency or plain text
  const isValidInlineMath = (inner: string): boolean => {
    const trimmed = inner.trim();
    if (!trimmed) return false;
    if (/^\d+(?:,\d{3})*(?:\.\d+)?$/.test(trimmed)) return false;
    if (/^\d+.*?\b(and|or|to|for|with)\b.*?\d+$/i.test(trimmed)) return false;
    return true;
  };

  // Format inline bold, code, math, and italics
  const renderCellContent = (cellStr: string) => {
    if (!cellStr) return <span className="text-zinc-600">—</span>;

    const inlineRegex = /(\\\([^\n]+?\\\)|\$(?!\s)[^$\n]+?(?<!\s)\$|\*\*[^*]+?\*\*|`[^`]+?`|\*[^*]+?\*)/g;
    const parts: Array<
      | string
      | { type: 'math' | 'bold' | 'code' | 'italic'; content: string }
    > = [];
    let lastIndex = 0;
    let match;

    while ((match = inlineRegex.exec(cellStr)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cellStr.substring(lastIndex, match.index));
      }

      const token = match[0];

      if (token.startsWith('\\(') && token.endsWith('\\)')) {
        parts.push({ type: 'math', content: token.slice(2, -2) });
      } else if (token.startsWith('$') && token.endsWith('$') && token.length > 2) {
        const inner = token.slice(1, -1);
        if (isValidInlineMath(inner)) {
          parts.push({ type: 'math', content: inner });
        } else {
          parts.push(token);
        }
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push({ type: 'bold', content: token.slice(2, -2) });
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push({ type: 'code', content: token.slice(1, -1) });
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push({ type: 'italic', content: token.slice(1, -1) });
      } else {
        parts.push(token);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < cellStr.length) {
      parts.push(cellStr.substring(lastIndex));
    }

    if (parts.length === 0) {
      return cellStr;
    }

    return parts.map((part, i) => {
      if (typeof part === 'string') return part;
      if (part.type === 'math') {
        return <MathRenderer key={i} math={part.content} displayMode={false} />;
      }
      if (part.type === 'bold') {
        return <strong key={i} className="font-semibold text-white">{part.content}</strong>;
      }
      if (part.type === 'code') {
        return (
          <code key={i} className="font-mono text-[11px] bg-zinc-800/90 text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-700/60">
            {part.content}
          </code>
        );
      }
      if (part.type === 'italic') {
        return <em key={i} className="text-zinc-300 italic">{part.content}</em>;
      }
      return null;
    });
  };

  const totalRowCount = data.rows.length;
  const filteredRowCount = processedRows.length;

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-zinc-800/90 bg-[#0c0c0f] shadow-[0_12px_30px_-5px_rgba(0,0,0,0.8)] transition-all">
      {/* Table Control Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950/80 border-b border-zinc-800/80 text-xs font-mono select-none">
        {/* Left Side: Emblem, Title & Counts */}
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
            <TableIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-white uppercase tracking-wider">Data Matrix</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">
              {t.table.showingRows(filteredRowCount, totalRowCount)}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">{data.headers.length} cols</span>
          </div>
        </div>

        {/* Right Side: Search & Export Actions */}
        <div className="flex items-center gap-2">
          {/* Search Toggle / Input */}
          {showSearch ? (
            <div className="relative flex items-center animate-fade-in">
              <Search className="w-3 h-3 text-zinc-400 absolute left-2 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={t.table.filterPlaceholder}
                autoFocus
                className="pl-6 pr-2 py-1 w-32 sm:w-44 text-[11px] bg-zinc-950 border border-zinc-700/90 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/20 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setFilterQuery('');
                }}
                className="ml-1 text-[10px] text-zinc-500 hover:text-zinc-300 px-1 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
              title="Search and filter table rows"
            >
              <Search className="w-3 h-3" />
              <span className="hidden sm:inline">{t.common.filter}</span>
            </button>
          )}

          <div className="h-3 w-[1px] bg-zinc-800" />

          {/* Copy CSV */}
          <button
            type="button"
            onClick={handleCopyCSV}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
            title="Copy as CSV data"
          >
            {copiedCsv ? <Check className="w-3 h-3 text-emerald-400" /> : <FileSpreadsheet className="w-3 h-3" />}
            <span className="hidden md:inline">{copiedCsv ? t.table.copiedCsv : t.table.copyCsv}</span>
          </button>

          {/* Copy Markdown */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
            title="Copy as Markdown table"
          >
            {copiedMd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden md:inline">{copiedMd ? t.table.copiedMarkdown : t.table.copyMarkdown}</span>
          </button>

          {/* Download CSV File */}
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
            title="Download CSV spreadsheet file"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">{t.table.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Main Table Scroll Container */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700">
        <table className="w-full text-left border-collapse font-sans text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-zinc-900/90 border-b border-zinc-800 select-none">
              {data.headers.map((header, colIdx) => {
                const align = getAlignment(colIdx);
                const isSorted = sortCol === colIdx;
                const alignClass = 
                  align === 'right' ? 'text-right justify-end' :
                  align === 'center' ? 'text-center justify-center' :
                  'text-left justify-start';

                return (
                  <th
                    key={colIdx}
                    onClick={() => handleSort(colIdx)}
                    className="py-3 px-4 font-mono font-bold text-[11px] uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/[0.03] transition-colors cursor-pointer border-r border-zinc-800/40 last:border-r-0 group"
                    title={`Click to sort by ${header}`}
                  >
                    <div className={`flex items-center gap-1.5 ${alignClass}`}>
                      <span>{header}</span>
                      <span className="text-zinc-500 group-hover:text-white transition-colors">
                        {isSorted ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-white" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-white" />
                          )
                        ) : (
                          <ArrowUpDown className="w-2.5 h-2.5 opacity-30 group-hover:opacity-100" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-800/50">
            {processedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={data.headers.length}
                  className="py-8 text-center text-zinc-500 font-mono text-xs"
                >
                  No rows matching &quot;{filterQuery}&quot;
                </td>
              </tr>
            ) : (
              processedRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`transition-colors hover:bg-white/[0.04] group ${
                    rowIdx % 2 === 1 ? 'bg-zinc-950/40' : 'bg-transparent'
                  }`}
                >
                  {row.map((cell, colIdx) => {
                    const align = getAlignment(colIdx);
                    const alignClass =
                      align === 'right' ? 'text-right font-mono' :
                      align === 'center' ? 'text-center font-mono' :
                      'text-left';

                    const isRankOrIndex = align === 'center' && (data.headers[colIdx] || '').toLowerCase().includes('rank');

                    return (
                      <td
                        key={colIdx}
                        className={`py-2.5 px-4 text-zinc-300 group-hover:text-white transition-colors border-r border-zinc-800/30 last:border-r-0 ${alignClass}`}
                      >
                        {isRankOrIndex ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-300">
                            {cell}
                          </span>
                        ) : (
                          renderCellContent(cell)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Bar (Keyboard & Sort Hint) */}
      <div className="px-3.5 py-1.5 bg-zinc-950/90 border-t border-zinc-800/70 text-[10px] font-mono text-zinc-500 flex items-center justify-between select-none">
        <span>Click column header to sort</span>
        {sortCol !== null && (
          <span className="text-zinc-400">
            Sorted by <strong className="text-white">{data.headers[sortCol]}</strong> ({sortDir.toUpperCase()})
          </span>
        )}
      </div>
    </div>
  );
};
