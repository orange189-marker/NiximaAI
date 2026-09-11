import React, { useState } from 'react';
import { 
  Globe, 
  Zap, 
  ExternalLink, 
  ChevronDown, 
  Check, 
  BrainCircuit, 
  Search, 
  FileText, 
  ShieldCheck, 
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import { SearchGrounding } from '../types/chat';
import { useLanguage } from '../context/LanguageContext';

interface SearchActionFeedProps {
  searchGrounding: SearchGrounding;
  isStreaming?: boolean;
  highlightedSourceIdx?: number | null;
}

export const SearchActionFeed: React.FC<SearchActionFeedProps> = ({
  searchGrounding,
  isStreaming = false,
  highlightedSourceIdx = null,
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedTrace, setCopiedTrace] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'websites' | 'reactions'>('all');

  const {
    query,
    sources = [],
    searchActions = [],
    searchMode = 'standard',
    searchTimeMs = 120,
    consensusScore = 99,
  } = searchGrounding;

  const isFast = searchMode === 'fast';
  const isMega = searchMode === 'mega';

  const websiteActions = searchActions.filter(a => a.targetDomain || a.targetUrl);
  const displayedActions = searchActions.filter(a => {
    if (filterTab === 'websites') return a.targetDomain || a.targetUrl;
    if (filterTab === 'reactions') return !!a.reasoning;
    return true;
  });

  const handleCopyTrace = (e: React.MouseEvent) => {
    e.stopPropagation();
    const traceText = searchActions.map(a => {
      const parts = [`Step ${a.stepNumber} [${a.actionType.toUpperCase()}]: ${a.title}`];
      if (a.targetDomain) parts.push(`Target: ${a.targetDomain} (${a.targetUrl || ''})`);
      if (a.reasoning) parts.push(`AI Observation & Reaction: ${a.reasoning}`);
      if (a.extractedSnippet) parts.push(`Extracted Evidence: "${a.extractedSnippet}"`);
      return parts.join('\n');
    }).join('\n\n---\n\n');

    navigator.clipboard.writeText(`SEARCH TOOL ACTION & REASONING TRACE\nQuery: "${query}"\nMode: ${searchMode}\nConsensus: ${consensusScore}%\n\n` + traceText);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0e0e13]/95 backdrop-blur-md overflow-hidden text-xs shadow-xl animate-fade-in transition-all">
      {/* High-Tech Radar Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 sm:px-4 py-3 flex items-center justify-between text-zinc-300 hover:text-white transition-colors cursor-pointer select-none bg-zinc-900/80 border-b border-zinc-800/80 gap-2"
      >
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap min-w-0">
          {/* Status Indicator Beacon */}
          {isStreaming ? (
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
          ) : isFast ? (
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
          ) : (
            <Globe className="w-4 h-4 text-zinc-300 flex-shrink-0" />
          )}

          {/* Search Engine Badge */}
          {isMega ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-100 font-mono text-[10.5px] font-bold shadow-inner-light flex-shrink-0">
              <span>Search V2</span>
              <span className="px-1 py-0.2 rounded bg-zinc-700 text-[9px] text-zinc-200 border border-zinc-600">
                MEGA
              </span>
            </span>
          ) : isFast ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-800 border border-amber-500/40 text-zinc-100 font-mono text-[10.5px] font-bold shadow-inner-light flex-shrink-0">
              <span>Search V2</span>
              <span className="px-1 py-0.2 rounded bg-amber-950/90 text-[9px] text-amber-300 border border-amber-600/50">
                FAST
              </span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[10.5px] font-semibold flex-shrink-0">
              {t.chatMessage.searchActionRadar}
            </span>
          )}

          {/* Query Snippet */}
          <span className="text-zinc-300 text-[11px] font-mono truncate max-w-[160px] sm:max-w-[260px]">
            "{query}"
          </span>

          {/* Telemetry Pills */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-850 border border-zinc-800 text-zinc-300">
              <Layers className="w-3 h-3 text-zinc-400" />
              <span>{isStreaming && sources.length === 0 ? 'Scanning Web Index...' : t.chatMessage.searchActionsTelemetry(websiteActions.length, searchActions.length)}</span>
            </span>

            {sources.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-850 border border-zinc-800 text-emerald-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{consensusScore}% Consensus</span>
              </span>
            )}

            {isFast ? (
              <span className="text-amber-400/90">
                • {t.chatMessage.fastLatency(searchTimeMs)}
              </span>
            ) : (
              <span className="text-zinc-500">
                • {t.chatMessage.searchLatency(searchTimeMs)}
              </span>
            )}
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyTrace}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-850 hover:bg-zinc-850/80 border border-zinc-800 hover:border-zinc-750 text-zinc-400 hover:text-white transition-colors text-[10.5px] font-mono cursor-pointer"
            title="Copy Search Actions & Reasoning Trace"
          >
            {copiedTrace ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Copy Trace</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors text-[11px] font-mono font-medium cursor-pointer"
          >
            <span>{isExpanded ? t.chatMessage.hideSearchActions : t.chatMessage.inspectSearchActions(searchActions.length)}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Actions & Website Reasoning Feed */}
      {isExpanded && (
        <div className="p-3 sm:p-4 bg-black/50 border-t border-zinc-800/80 space-y-3.5 animate-fade-in">
          {/* Filter Sub-Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-zinc-850">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-colors cursor-pointer select-none whitespace-nowrap ${
                  filterTab === 'all'
                    ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                All Action Steps ({searchActions.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('websites')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-colors cursor-pointer select-none whitespace-nowrap flex items-center gap-1.5 ${
                  filterTab === 'websites'
                    ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Inspected Websites ({websiteActions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('reactions')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-colors cursor-pointer select-none whitespace-nowrap flex items-center gap-1.5 ${
                  filterTab === 'reactions'
                    ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <BrainCircuit className="w-3 h-3" />
                <span>AI Live Reactions ({searchActions.filter(a => a.reasoning).length})</span>
              </button>
            </div>

            {/* Live consensus score pill */}
            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Factual Consensus: <strong className="text-zinc-200">{consensusScore}%</strong></span>
            </div>
          </div>

          {/* Action Step Chain Timeline */}
          <div className="space-y-3 relative before:absolute before:top-2.5 before:bottom-2.5 before:left-3 before:w-px before:bg-zinc-800/80">
            {displayedActions.map((action, idx) => {
              const isQuery = action.actionType === 'query';
              const isSynth = action.actionType === 'synthesize';
              const isVisit = action.actionType === 'visit';
              const isEval = action.actionType === 'evaluate';
              const isExtract = action.actionType === 'extract';

              const typeBadgeLabel = isQuery
                ? t.chatMessage.stepDispatchQuery
                : isVisit
                ? t.chatMessage.stepInspectWebsite
                : isEval
                ? t.chatMessage.stepCrossReference
                : isExtract
                ? t.chatMessage.stepExtractData
                : t.chatMessage.stepSynthesize;

              return (
                <div 
                  key={action.stepNumber || idx}
                  className="relative pl-8 group animate-fade-in"
                >
                  {/* Step Node Marker on vertical rail */}
                  <div className={`absolute left-1.5 top-2.5 -translate-x-1/2 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-mono font-bold transition-all shadow-sm ${
                    action.status === 'in_progress'
                      ? 'bg-amber-950 border-amber-500/80 text-amber-300 ring-2 ring-amber-500/30 animate-pulse'
                      : isSynth 
                      ? 'bg-emerald-950 border-emerald-600/80 text-emerald-300 ring-2 ring-emerald-500/20'
                      : isQuery
                      ? 'bg-zinc-850 border-zinc-600 text-zinc-200'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                  }`}>
                    {action.status === 'in_progress' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    ) : isSynth ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                    ) : (
                      action.stepNumber
                    )}
                  </div>

                  {/* Action Step Card */}
                  <div className="rounded-xl border border-zinc-800/90 bg-[#111116]/90 p-3 sm:p-3.5 space-y-2.5 hover:border-zinc-700/80 transition-colors shadow-sm">
                    {/* Top Row: Type, Title & Latency */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Action Type Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wide uppercase border ${
                          isQuery
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                            : isVisit
                            ? 'bg-blue-950/60 border-blue-800/60 text-blue-300'
                            : isEval
                            ? 'bg-amber-950/60 border-amber-800/60 text-amber-300'
                            : isExtract
                            ? 'bg-purple-950/60 border-purple-800/60 text-purple-300'
                            : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                        }`}>
                          {isQuery && <Search className="w-2.5 h-2.5" />}
                          {isVisit && <Globe className="w-2.5 h-2.5" />}
                          {isEval && <Layers className="w-2.5 h-2.5" />}
                          {isExtract && <FileText className="w-2.5 h-2.5" />}
                          {isSynth && <Sparkles className="w-2.5 h-2.5" />}
                          <span>{typeBadgeLabel}</span>
                        </span>

                        {/* Step Title */}
                        <span className="font-semibold text-xs text-white font-mono">
                          {action.title}
                        </span>
                      </div>

                      {/* Right Telemetry: Latency & Relevance */}
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                        {action.status === 'in_progress' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-600/50 text-amber-300 text-[9.5px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            <span>In Progress...</span>
                          </span>
                        ) : (
                          <>
                            {action.relevanceScore && (
                              <span className="px-1.5 py-0.2 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300">
                                {t.chatMessage.relevanceMatch(action.relevanceScore)}
                              </span>
                            )}
                            {action.latencyMs && (
                              <span className="text-zinc-500">
                                {action.latencyMs}ms
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Inspected Website Anchor & Direct Link (If Action Targets a Website) */}
                    {action.targetDomain && (
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-900/90 border border-zinc-800">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 flex-shrink-0">
                            <Globe className="w-3 h-3" />
                          </div>
                          <span className="font-mono text-xs text-zinc-200 font-semibold truncate">
                            {action.targetDomain}
                          </span>
                        </div>

                        {action.targetUrl && (
                          <a
                            href={action.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 text-[10.5px] font-mono transition-colors flex-shrink-0 cursor-pointer"
                          >
                            <span>{t.chatMessage.visitSource}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* AI LIVE OBSERVATION & REACTION BOX (The core feature requested by user!) */}
                    {action.reasoning && (
                      <div className="rounded-xl p-3 bg-zinc-900/95 border border-zinc-800/90 space-y-1.5 shadow-inner-light">
                        <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-zinc-200 uppercase tracking-wider">
                          <BrainCircuit className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                          <span>{t.chatMessage.aiObservationReaction}</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans select-text pl-5 border-l-2 border-zinc-700">
                          {action.reasoning}
                        </p>
                      </div>
                    )}

                    {/* Extracted Evidence / Snippet (If Present) */}
                    {action.extractedSnippet && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 text-zinc-500" />
                          <span>{t.chatMessage.extractedEvidence}</span>
                        </div>
                        <div className="rounded-lg p-2.5 bg-black/60 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 italic leading-relaxed select-text">
                          "{action.extractedSnippet}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {sources.length === 0 && isStreaming && (
              <div className="relative pl-8 group animate-fade-in">
                <div className="absolute left-1.5 top-3 -translate-x-1/2 w-4 h-4 rounded-full border border-amber-500/80 bg-amber-950/80 flex items-center justify-center ring-2 ring-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="rounded-xl border border-zinc-800/90 bg-[#111116]/90 p-3 flex items-center gap-2.5 text-zinc-300 font-mono text-xs shadow-sm">
                  <span className="text-zinc-400 animate-pulse">Scouring live web index and cross-referencing multi-source records...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Access Verified Sources Strip */}
          {sources.length > 0 && (
            <div className="pt-2 border-t border-zinc-850 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
                <span>{t.chatMessage.verifiedSources}</span>
                <span className="text-zinc-500">{sources.length} sources indexed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {sources.map((src, sIdx) => (
                  <a
                    key={sIdx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-between gap-2 group cursor-pointer ${
                      highlightedSourceIdx === sIdx 
                        ? 'bg-zinc-800 border border-zinc-400 ring-1 ring-zinc-400/50 scale-[1.02] shadow-md' 
                        : 'bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-zinc-200 group-hover:text-white truncate">
                          {src.title}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 truncate">
                          {src.domain || 'web.mesh'}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
