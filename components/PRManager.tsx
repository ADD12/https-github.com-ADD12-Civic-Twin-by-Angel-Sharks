
import React, { useState } from 'react';
import { TwinMetadata, SmartCityInsight } from '../types';

interface PRManagerProps {
  metadata: TwinMetadata;
  insights: SmartCityInsight[];
  prContent: { title: string; body: string } | null;
  onClose: () => void;
  isGenerating: boolean;
}

export const PRManager: React.FC<PRManagerProps> = ({ metadata, insights, prContent, onClose, isGenerating }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!prContent) return;
    const fullText = `# ${prContent.title}\n\n${prContent.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
        
        <header className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-900/20">
              🚀
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Pull Request Architect</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Staging to ADD12/Civic-Twin-by-Angel-Sharks</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 custom-scrollbar">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-emerald-500 animate-pulse">AI</div>
              </div>
              <div className="text-center">
                <p className="text-emerald-500 font-black text-sm uppercase tracking-[0.3em]">Generating System PR</p>
                <p className="text-slate-500 text-xs mt-2 font-medium">Analyzing NIST layers and architectural delta...</p>
              </div>
            </div>
          ) : prContent ? (
            <>
              {/* Context Preview */}
              <section className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Manifest</h3>
                <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800/50 font-mono text-[10px] leading-relaxed">
                  <div className="text-emerald-500/80 mb-1 flex items-center gap-2">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                    SOURCE: {metadata.name}
                  </div>
                  <div className="text-slate-500 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    LOC: {metadata.location?.lat.toFixed(4)}, {metadata.location?.lng.toFixed(4)}
                  </div>
                </div>
              </section>

              {/* Editable Content Style Display */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Staged PR Description</h3>
                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all shadow-lg ${
                      copied 
                      ? 'bg-emerald-500 text-white shadow-emerald-900/20' 
                      : 'bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white shadow-slate-950'
                    }`}
                  >
                    {copied ? '✅ Copied to Clipboard' : '📋 Copy Markdown'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="group relative">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-slate-100 font-bold text-sm shadow-inner">
                      {prContent.title}
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 text-slate-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed min-h-[200px] shadow-inner">
                      {prContent.body}
                    </div>
                    <div className="absolute bottom-4 right-4 text-[9px] font-black text-slate-700 uppercase tracking-widest">Markdown Encoded</div>
                  </div>
                </div>
              </section>

              {/* Instructions */}
              <section className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex gap-5 items-start">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-400 font-black text-xs uppercase mb-1">Deployment Steps</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    This content is prepared for the <strong>ADD12/Civic-Twin-by-Angel-Sharks</strong> repository. Copy the markdown, navigate to GitHub, and initiate a new PR targeting the <code>main</code> branch.
                  </p>
                </div>
              </section>
            </>
          ) : (
            <div className="text-center py-20 flex flex-col items-center space-y-4">
              <div className="text-4xl">📂</div>
              <p className="text-slate-500 font-bold italic">No PR changes currently staged for dispatch.</p>
            </div>
          )}
        </div>

        <footer className="p-8 bg-slate-950 border-t border-slate-800 flex gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 font-black text-xs rounded-2xl transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
          <a 
            href="https://github.com/ADD12/Civic-Twin-by-Angel-Sharks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-900/30 uppercase text-xs tracking-[0.2em]"
          >
            Open GitHub Repository <span>↗</span>
          </a>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};
