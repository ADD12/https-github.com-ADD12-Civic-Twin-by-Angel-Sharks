
import React, { useState } from 'react';
import { ViewType, ConnectivityStatus } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isMetadataSet: boolean;
  connectivity: ConnectivityStatus;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, isMetadataSet, connectivity }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusDisplay = () => {
    switch(connectivity) {
      case 'online': 
        return { label: 'Online / Cloud Sync', color: 'bg-emerald-500', icon: '📡', text: 'text-emerald-700' };
      case 'offline-fog': 
        return { label: 'Fog AI Active (B-lan)', color: 'bg-amber-500', icon: '☁️', text: 'text-amber-700' };
      default: 
        return { label: 'Disconnected', color: 'bg-rose-500', icon: '✕', text: 'text-rose-700' };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
      {/* Responsive Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-[2000]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            CT
          </div>
          <div className="hidden xs:block">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">Civic Twin</h1>
            <div className="flex flex-col">
              <a 
                href="https://angelsharks.net/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[9px] sm:text-xs font-black text-blue-700 uppercase tracking-widest hover:text-blue-900 transition-colors"
              >
                by Angel Sharks
              </a>
            </div>
          </div>
        </div>

        {/* Global Connectivity Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white shadow-sm transition-all duration-500 ${status.text} border-slate-200`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${status.color}`}></span>
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">{status.label}</span>
          <span className="text-sm md:hidden" title={status.label}>{status.icon}</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-bold text-slate-600">
          <button 
            onClick={() => onViewChange('dashboard')}
            className={`transition-colors py-2 flex items-center gap-1.5 focus-visible:outline-blue-600 ${currentView === 'dashboard' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onViewChange('gis-analysis')}
            disabled={!isMetadataSet}
            className={`transition-colors py-2 flex items-center gap-1.5 disabled:opacity-30 ${currentView === 'gis-analysis' ? 'text-rose-700 font-black' : 'hover:text-blue-600'}`}
          >
            GIS Analysis
          </button>
          <button 
            onClick={() => onViewChange('documentation')}
            className={`transition-colors py-2 flex items-center gap-1.5 ${currentView === 'documentation' ? 'text-emerald-700 font-black' : 'hover:text-emerald-700'}`}
          >
            Docs
          </button>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          <a 
            href="https://github.com/ADD12/Civic-Twin-by-Angel-Sharks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 transition-all rounded-lg text-xs font-black text-slate-700 group"
          >
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full group-hover:scale-110 transition-transform"></span>
            REPO
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <div className="w-6 h-5 flex flex-col justify-between" aria-hidden="true">
            <span className={`h-0.5 w-full bg-slate-700 rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-full bg-slate-700 rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-full bg-slate-700 rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[1900] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <nav className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl p-8 flex flex-col space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="font-black text-slate-500 text-xs uppercase tracking-widest">Navigation</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-600 p-2 font-black" aria-label="Close menu">✕</button>
            </div>
            <button 
              onClick={() => { onViewChange('dashboard'); setIsMenuOpen(false); }}
              className={`text-xl font-black text-left border-b border-slate-100 pb-4 ${currentView === 'dashboard' ? 'text-blue-700' : 'text-slate-900'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => { onViewChange('gis-analysis'); setIsMenuOpen(false); }}
              disabled={!isMetadataSet}
              className={`text-xl font-black text-left border-b border-slate-100 pb-4 ${currentView === 'gis-analysis' ? 'text-rose-700' : 'text-slate-900'}`}
            >
              GIS Analysis
            </button>
            <button 
              onClick={() => { onViewChange('documentation'); setIsMenuOpen(false); }}
              className={`text-xl font-black text-left border-b border-slate-100 pb-4 ${currentView === 'documentation' ? 'text-emerald-700' : 'text-slate-900'}`}
            >
              Documentation
            </button>
            <div className="mt-auto flex flex-col items-center gap-1">
              <a 
                href="https://angelsharks.net/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-black text-blue-700 uppercase tracking-widest text-center hover:underline"
              >
                Civic Twin by Angel Sharks
              </a>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Copyright 2026
              </span>
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
};
