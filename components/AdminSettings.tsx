
import React, { useState, useEffect } from 'react';
import { PRInfo, TwinMetadata, BranchSuggestion } from '../types';
import { generateRepositoryStrategy, generateCoreArchitecturalSuggestions, generatePRSummary } from '../services/geminiService';
import { PRManager } from './PRManager';

interface AdminSettingsProps {
  metadata: TwinMetadata | null;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ metadata }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pullRequests, setPullRequests] = useState<PRInfo[]>([]);
  const [lastPrUpdate, setLastPrUpdate] = useState<string | null>(null);
  const [forkSuggestions, setForkSuggestions] = useState<BranchSuggestion[]>([]);
  const [coreSuggestions, setCoreSuggestions] = useState<BranchSuggestion[]>([]);
  const [isLoadingPRs, setIsLoadingPRs] = useState(false);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // PR Manager States
  const [isPRManagerOpen, setIsPRManagerOpen] = useState(false);
  const [prContent, setPrContent] = useState<{ title: string; body: string } | null>(null);
  const [isGeneratingPR, setIsGeneratingPR] = useState(false);

  const fetchPullRequests = async () => {
    setIsLoadingPRs(true);
    try {
      const response = await fetch('https://api.github.com/repos/ADD12/Civic-Twin-by-Angel-Sharks/pulls');
      if (response.ok) {
        const data = await response.json();
        setPullRequests(data);
        setLastPrUpdate(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Error fetching PRs:", err);
    } finally {
      setIsLoadingPRs(false);
    }
  };

  const loadStrategies = async () => {
    setIsLoadingStrategies(true);
    try {
      const [forks, cores] = await Promise.all([
        metadata ? generateRepositoryStrategy(metadata) : Promise.resolve([]),
        generateCoreArchitecturalSuggestions()
      ]);
      setForkSuggestions(forks);
      setCoreSuggestions(cores);
    } catch (err) {
      console.error("Error generating strategy:", err);
    } finally {
      setIsLoadingStrategies(false);
    }
  };

  const handleProposePR = async () => {
    setIsPRManagerOpen(true);
    setIsGeneratingPR(true);
    try {
      const summary = await generatePRSummary(metadata);
      setPrContent(summary);
    } catch (err) {
      console.error("PR Generation failed", err);
    } finally {
      setIsGeneratingPR(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchPullRequests();
      loadStrategies();
    }
  }, [isAuthorized, metadata]);

  const addLog = (msg: string) => {
    setConnectionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnectionLogs([]);
    setLoginError(false);

    // Simulated A-LAN Handshake sequence
    const steps = [
      "Broadcasting to A-LAN Tactical Gateway...",
      "Server found at alan.angel-sharks.civic-twin.net",
      "Initializing 4096-bit RSA Encrypted Tunnel...",
      "Negotiating secure handshake with External Node...",
      "Authenticating Admin Credentials..."
    ];

    for (const step of steps) {
      addLog(step);
      await new Promise(r => setTimeout(r, 600));
    }

    if (username === 'admin' && password === '!Asw1Nnw2@') {
      addLog("Authentication Successful. Redirecting to Main Core.");
      await new Promise(r => setTimeout(r, 400));
      setIsAuthorized(true);
      setIsConnecting(false);
    } else {
      addLog("ERROR: INVALID CREDENTIALS. Connection Terminated.");
      setIsConnecting(false);
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500 relative z-10" role="main">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-rose-700 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6 shadow-2xl shadow-rose-950/50 border border-rose-500/30" aria-hidden="true">
              🔒
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">A-LAN Admin Gateway</h2>
            <p className="text-xs font-black text-slate-400 tracking-[0.3em] uppercase mt-3">Remote Tactical Server Access</p>
          </div>

          {!isConnecting ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="bg-slate-950 border border-slate-700 rounded-2xl p-5 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" aria-hidden="true"></span>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">A-LAN Link Ready</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold tracking-tighter">v4.2-tactical</span>
              </div>

              <div className="space-y-2">
                <label htmlFor="adminUsername" className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">Admin Username</label>
                <input 
                  id="adminUsername"
                  type="text" 
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-6 py-5 bg-slate-950 border rounded-2xl text-white outline-none transition-all font-bold ${loginError ? 'border-rose-600 animate-shake' : 'border-slate-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'}`}
                  placeholder="e.g., admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="accessToken" className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">Access Token</label>
                <input 
                  id="accessToken"
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-6 py-5 bg-slate-950 border rounded-2xl text-white outline-none transition-all font-bold ${loginError ? 'border-rose-600 animate-shake' : 'border-slate-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'}`}
                  placeholder="••••••••••••"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full py-5 bg-rose-700 hover:bg-rose-600 text-white font-black rounded-2xl shadow-2xl shadow-rose-950/40 transition-all active:scale-95 mt-4 flex items-center justify-center gap-3 uppercase text-sm tracking-widest focus-visible:ring-4 focus-visible:ring-rose-500/30"
              >
                INITIATE A-LAN HANDSHAKE
              </button>
              
              {loginError && (
                <p className="text-rose-500 text-xs font-black uppercase text-center mt-3 animate-pulse" role="alert">Connection Failed: Invalid Node Credentials</p>
              )}
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-slate-950 border border-slate-700 rounded-2xl p-6 font-mono text-xs space-y-3 h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 shadow-inner">
                {connectionLogs.map((log, i) => (
                  <div key={i} className={`font-bold ${log.includes('ERROR') ? 'text-rose-500' : log.includes('Successful') ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {log}
                  </div>
                ))}
                <div className="w-1.5 h-4 bg-white/30 animate-pulse inline-block ml-1" aria-hidden="true"></div>
              </div>
              
              <div className="flex flex-col items-center gap-5">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-rose-600 animate-progress" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Securing Remote Tactical Link...</p>
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-slate-800/60 flex items-center justify-center gap-6">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">NIST 800-171 COMPLIANT</span>
            <div className="h-4 w-px bg-slate-800" aria-hidden="true"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ENCRYPTED A-LAN TUNNEL</span>
          </div>
        </div>

        <style>{`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-progress {
            animation: progress 2s infinite linear;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 flex flex-col min-h-0 text-slate-100">
      <header className="p-8 lg:px-12 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/40">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter">Main Core Control</h2>
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" aria-hidden="true"></span>
              A-LAN Server Connected
            </p>
            <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
              Repo: ADD12/Civic-Twin-by-Angel-Sharks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
            onClick={handleProposePR}
            className="px-8 py-4 bg-emerald-700 hover:bg-emerald-600 rounded-2xl text-xs font-black text-white transition-all shadow-2xl shadow-emerald-950/40 flex items-center gap-3 active:scale-95 focus-visible:ring-4 focus-visible:ring-emerald-500/30 uppercase tracking-widest"
          >
            🚀 PROPOSE CORE ARCHITECTURE PR
          </button>
          <button 
            onClick={() => {
              setIsAuthorized(false);
              setUsername('');
              setPassword('');
            }}
            className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-tight"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          
          <div className="lg:col-span-8 space-y-20">
            
            {/* Core Architectural Suggestions */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Main Core Persistence Map</h3>
                  <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Staged Files and Architectural Core Enhancements</p>
                </div>
                <div className="text-xs font-black text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg bg-blue-500/10 uppercase">
                  ROOT SYNC
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {isLoadingStrategies ? (
                  <div className="p-20 text-center animate-pulse text-slate-500 font-black uppercase tracking-[0.3em] text-sm">Architecting Root Updates...</div>
                ) : (
                  coreSuggestions.map((s, i) => (
                    <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500/50 transition-all group shadow-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-900 px-3 py-1 rounded-md mb-3 inline-block font-bold">branch: main/core/{s.name}</span>
                          <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight">{s.prTitle}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 font-bold mb-6 italic leading-relaxed">{s.purpose}</p>
                      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {s.prBody}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* GitHub PR Feed */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active Upstream Sync Feed</h3>
                  {lastPrUpdate && <p className="text-xs font-black text-slate-600 uppercase tracking-widest mt-2">Handshake Calibrated: {lastPrUpdate}</p>}
                </div>
                <button 
                  onClick={fetchPullRequests} 
                  disabled={isLoadingPRs}
                  className="flex items-center gap-3 text-xs font-black text-slate-400 hover:text-white border border-slate-800 px-5 py-2.5 rounded-xl transition-all hover:bg-slate-900 disabled:opacity-50 uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-slate-700"
                >
                  {isLoadingPRs ? 'POLLING...' : 'SYNCHRONIZE FEED'}
                </button>
              </div>
              <div className="space-y-4">
                {isLoadingPRs && pullRequests.length === 0 ? (
                  <div className="p-20 text-center text-slate-500 animate-pulse font-black italic text-sm">Polling GitHub Tactical API...</div>
                ) : pullRequests.length === 0 ? (
                  <div className="p-20 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 font-black italic">No active PRs found on upstream core</div>
                ) : (
                  pullRequests.map(pr => (
                    <a key={pr.number} href={pr.html_url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:bg-slate-900 hover:border-blue-500/50 transition-all flex gap-5 items-center group shadow-lg focus-visible:ring-4 focus-visible:ring-blue-600/20">
                      <div className="relative shrink-0">
                        <img src={pr.user.avatar_url} alt={`${pr.user.login}'s profile picture`} className="w-10 h-10 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity border border-slate-700" />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-700 rounded-full border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-black" aria-hidden="true">✓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm lg:text-base font-black text-slate-100 group-hover:text-blue-400 transition-colors truncate tracking-tight">{pr.title}</p>
                         <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                           <span className="text-xs text-slate-500 font-mono font-black">#{pr.number}</span>
                           <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" aria-hidden="true"></span>
                           <span className="text-xs text-slate-400 font-black uppercase tracking-tight">by {pr.user.login}</span>
                           <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" aria-hidden="true"></span>
                           <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded uppercase">MAIN CORE</span>
                         </div>
                      </div>
                      <span className="text-slate-700 text-2xl group-hover:text-blue-500 transition-colors shrink-0" aria-hidden="true">↗</span>
                    </a>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Main Core Ops</h3>
            <div className="space-y-6">
               <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2rem] space-y-5 shadow-2xl">
                 <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">Root Persistence Protocol</h4>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-200 uppercase tracking-tight">City Fork Isolation</span>
                    <div className="w-10 h-5 bg-emerald-700 rounded-full relative" aria-hidden="true">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 font-bold leading-relaxed italic">System is configured to isolate city specific GIS layers into their own feature branches, preserving the Main Root integrity.</p>
               </div>
               
               <div className="p-8 bg-blue-900/10 border border-blue-500/20 rounded-[2rem] space-y-3">
                  <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest">Architectural Policy</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-bold italic">
                    "Only Admin verified architectural enhancements may be proposed to the Main Core. Demo data from city logins is restricted from upstream Root sync."
                  </p>
               </div>
               
               {metadata && (
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6 shadow-xl">
                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Active City Context</h4>
                    <p className="text-lg font-black text-white tracking-tight">{metadata.name}</p>
                    <button 
                      onClick={loadStrategies}
                      className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 hover:text-white rounded-2xl transition-all uppercase tracking-widest shadow-lg active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-600"
                    >
                      SYNC CITY FORK PLAN
                    </button>
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Branding Footer for Admin View */}
        <footer className="pt-16 pb-8 border-t border-slate-900 flex flex-col items-center gap-3 text-center opacity-80">
          <a 
            href="https://angelsharks.net/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-black text-slate-500 hover:text-blue-500 transition-all uppercase tracking-[0.5em]"
          >
            Civic Twin by Angel Sharks
          </a>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em]">
            Copyright 2026
          </span>
        </footer>
      </div>

      {isPRManagerOpen && (
        <PRManager 
          metadata={metadata!}
          insights={[]} 
          prContent={prContent}
          isGenerating={isGeneratingPR}
          onClose={() => setIsPRManagerOpen(false)}
        />
      )}
    </div>
  );
};
