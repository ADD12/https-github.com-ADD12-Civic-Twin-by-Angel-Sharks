
import React from 'react';

export const Documentation: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-6 lg:p-12 scrollbar-thin scrollbar-thumb-slate-300" role="main">
      <div className="max-w-4xl mx-auto space-y-16 py-8">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-xs font-black uppercase tracking-widest">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-pulse" aria-hidden="true"></span>
            Platform Documentation
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">Operational Guidelines</h1>
          <p className="text-xl text-slate-700 font-bold leading-relaxed max-w-2xl">
            Essential procedures for Civic Twin administrators, city planners, and spatial engineers.
          </p>
        </header>

        <section className="space-y-8">
          <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-xl">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-5 tracking-tight">
              <span className="w-12 h-12 bg-rose-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-rose-200" aria-hidden="true">🔒</span>
              Admin Authentication & Security
            </h2>
            <div className="prose prose-slate max-w-none space-y-6">
              <p className="text-slate-800 leading-relaxed font-bold text-lg">
                The Civic Twin platform utilizes a tiered security model to distinguish between general city demonstrations and core repository maintenance. 
                <span className="text-rose-700 font-black"> Admin access</span> is required to synchronize Pull Requests with the Main Core repository on GitHub.
              </p>
              
              <div className="bg-slate-900 text-slate-200 p-8 rounded-[2rem] space-y-4 font-mono text-sm border-l-8 border-rose-600 shadow-2xl">
                <p className="text-rose-400 font-black uppercase text-xs tracking-widest mb-2">Administrative Credentials</p>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-800 pb-3 gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-tight">Username:</span>
                  <span className="text-emerald-400 font-black text-base">admin</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between pt-1 gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-tight">Access Token (Password):</span>
                  <span className="text-emerald-400 font-black text-base">!Asw1Nnw2@</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm font-black italic bg-slate-100 p-4 rounded-xl border border-slate-200">
                ⚠️ Security Note: The "Access Token" field in the Admin Gateway serves as the master authentication key for Root Sync operations.
              </p>
            </div>
          </div>
        </section>

        {/* Strategic Roadmap Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Strategic Core Roadmap 2026</h2>
            <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-[0.2em]">Priority Alpha</span>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                title: "Sustainability & ESG Analytics",
                branch: "feat/sustainability-impact",
                desc: "New dedicated layer for tracking urban carbon sequestration and air quality correlation.",
                icon: "🌿"
              },
              {
                title: "NIST Cross-Layer Correlation",
                branch: "core/nist-impact-engine",
                desc: "AI service to predict how infrastructure failures in one layer (Water) cascade into others (Traffic).",
                icon: "🔄"
              },
              {
                title: "Unified State Orchestration",
                branch: "infra/state-telemetry",
                desc: "Centralized Zustand store for managing high-frequency GIS and Mesh Node telemetry.",
                icon: "⚙️"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-blue-500 transition-all group shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner border border-slate-100 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
                    <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">{item.branch}</span>
                  </div>
                  <p className="text-slate-600 font-bold text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-10 bg-blue-700 text-white rounded-[3rem] shadow-2xl shadow-blue-200 space-y-8 border border-blue-600">
            <h3 className="text-2xl font-black uppercase tracking-tight">City Fork Strategy</h3>
            <p className="text-base font-bold opacity-95 leading-relaxed">
              When a city or district logs in, they operate within a "Fork Sandbox". This ensures that city-specific GIS layers and local metadata are sustained within unique feature branches.
            </p>
            <ul className="text-sm font-black space-y-3 list-none">
              <li className="flex gap-3"><span className="text-blue-300" aria-hidden="true">●</span> Isolates local GIS from Main Core</li>
              <li className="flex gap-3"><span className="text-blue-300" aria-hidden="true">●</span> Prevents main branch pollution</li>
              <li className="flex gap-3"><span className="text-blue-300" aria-hidden="true">●</span> Supports custom persistence via branches</li>
            </ul>
          </div>

          <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl shadow-slate-300 space-y-8 border border-slate-800">
            <h3 className="text-2xl font-black uppercase tracking-tight">Main Core Sync</h3>
            <p className="text-base font-bold opacity-95 leading-relaxed">
              Main core architectural PRs (new pages, global NIST layers, core services) are pushed directly from the Admin Control Panel. 
            </p>
            <ul className="text-sm font-black space-y-3 list-none">
              <li className="flex gap-3"><span className="text-emerald-500" aria-hidden="true">●</span> Proposed from Admin Gateway only</li>
              <li className="flex gap-3"><span className="text-emerald-500" aria-hidden="true">●</span> Undergoes Root Integrity checks</li>
              <li className="flex gap-3"><span className="text-emerald-500" aria-hidden="true">●</span> Synchronizes with ADD12 upstream</li>
            </ul>
          </div>
        </section>

        <section className="space-y-10 py-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Workflow Checklist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Initialize Twin", desc: "Enter city metadata and official NIST layer URLs." },
              { step: "02", title: "Fork & Persist", desc: "Use the generated branch strategy for city overrides." },
              { step: "03", title: "Admin Sync", desc: "Log in as admin to push architectural Main Core PRs." }
            ].map(item => (
              <div key={item.step} className="p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-blue-600 hover:shadow-2xl transition-all group">
                <span className="text-blue-700 font-black text-sm mb-3 block group-hover:scale-110 transition-transform origin-left">{item.step}</span>
                <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-700 font-bold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-20 pb-12 border-t border-slate-200 flex flex-col items-center gap-10 text-center">
          <p className="text-slate-500 font-black text-xs uppercase tracking-[0.5em]">Maintained by Angel Sharks Technical Core</p>
          <div className="flex flex-col gap-8 items-center">
            <div className="flex flex-col items-center gap-2">
              <a 
                href="https://angelsharks.net/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-black text-blue-700 hover:text-blue-900 uppercase tracking-widest transition-all hover:underline underline-offset-4"
              >
                Civic Twin by Angel Sharks
              </a>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Copyright 2026
              </span>
            </div>
            <a 
              href="https://github.com/ADD12/Civic-Twin-by-Angel-Sharks" 
              target="_blank" 
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-300 focus-visible:ring-4 focus-visible:ring-blue-600/30"
            >
              Access Repository Source ↗
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};
