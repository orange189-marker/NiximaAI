import React, { Component, ErrorInfo, ReactNode } from 'react';
import { NiximaIdLogo } from './NiximaIdLogo';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nixima Sovereign Mesh Caught Unhandled Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleSafeReset = () => {
    try {
      localStorage.removeItem('nixima_active_model_v4');
      localStorage.removeItem('nixima_active_model_v3');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709] text-white p-4 font-sans select-none overflow-hidden">
          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#101014]/95 border border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.2)] p-6 sm:p-8 backdrop-blur-2xl animate-fade-in text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-950/90 border border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.3)] mb-4">
              <NiximaIdLogo size={36} glow />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white mb-2">
              Nixima System Recovery
            </h1>

            <p className="text-xs text-zinc-400 font-mono mb-4 leading-relaxed">
              An unexpected runtime exception occurred. The sovereign sandbox caught the error to protect your active sessions.
            </p>

            {this.state.error && (
              <div className="text-left bg-black/60 border border-zinc-800 rounded-xl p-3 mb-5 overflow-x-auto max-h-36 scrollbar-thin">
                <p className="text-[11px] font-mono text-red-400 font-semibold break-words">
                  {this.state.error.name}: {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-zinc-200 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Reload Platform
              </button>
              <button
                type="button"
                onClick={this.handleSafeReset}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 font-medium text-xs font-mono hover:text-white hover:border-zinc-500 transition-all cursor-pointer active:scale-95"
              >
                Safe Mode Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
