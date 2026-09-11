import React, { useState } from 'react';
import { Globe, ExternalLink } from 'lucide-react';

interface LinkPillProps {
  href: string;
  label?: string;
  className?: string;
}

export const LinkPill: React.FC<LinkPillProps> = ({ href, label, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  // Normalize URL
  const normalizedHref = href.startsWith('http://') || href.startsWith('https://') 
    ? href 
    : `https://${href}`;

  let domain = '';
  try {
    const parsed = new URL(normalizedHref);
    domain = parsed.hostname.replace(/^www\./, '');
  } catch {
    domain = normalizedHref.replace(/^https?:\/\//, '').split('/')[0] || 'web';
  }

  // Determine display label
  const rawLabel = (label || '').trim().replace(/^\*\*(.*?)\*\*$/, '$1');
  const isLabelUrlOrDomain = 
    !rawLabel || 
    rawLabel.toLowerCase() === domain.toLowerCase() || 
    rawLabel.toLowerCase() === `www.${domain.toLowerCase()}` || 
    rawLabel.startsWith('http://') || 
    rawLabel.startsWith('https://');

  const displayTitle = isLabelUrlOrDomain ? domain : rawLabel;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;

  return (
    <a
      href={normalizedHref}
      target="_blank"
      rel="noopener noreferrer"
      title={`${displayTitle}\nDestination: ${normalizedHref}\nClick to open in new tab ↗`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 mx-0.5 my-0.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-zinc-200 hover:text-white transition-all duration-200 text-xs font-sans group cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 no-underline align-middle select-none max-w-[320px] ${className}`}
    >
      {/* Favicon or fallback Globe icon */}
      <span className="w-4 h-4 rounded-sm overflow-hidden flex items-center justify-center flex-shrink-0 bg-zinc-800/80 border border-zinc-700/60 group-hover:border-zinc-500 transition-colors">
        {!imgError ? (
          <img
            src={faviconUrl}
            alt=""
            loading="lazy"
            className="w-3.5 h-3.5 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <Globe className="w-2.5 h-2.5 text-zinc-400 group-hover:text-zinc-200" />
        )}
      </span>

      {/* Main Title / Domain */}
      <span className="font-semibold text-zinc-100 group-hover:text-white tracking-tight truncate">
        {displayTitle}
      </span>

      {/* Domain badge if custom label */}
      {!isLabelUrlOrDomain && (
        <span className="hidden sm:inline text-[10px] font-mono text-zinc-400 group-hover:text-zinc-300 truncate max-w-[110px]">
          ({domain})
        </span>
      )}

      {/* External Link Icon */}
      <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0 ml-0.5" />
    </a>
  );
};
