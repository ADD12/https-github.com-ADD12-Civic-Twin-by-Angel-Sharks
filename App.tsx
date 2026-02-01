
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { GISAnalysis } from './components/GISAnalysis';
import { AdminSettings } from './components/AdminSettings';
import { Documentation } from './components/Documentation';
import { AIChatPanel } from './components/AIChatPanel';
import { LiveAudioPanel } from './components/LiveAudioPanel';
import { TwinMetadata, SmartCityInsight, ViewType, ConnectivityStatus } from './types';
import { generateDigitalTwinInsights } from './services/geminiService';

const STORAGE_KEY = 'civic_twin_persistence';

const App: React.FC = () => {
  const [metadata, setMetadata] = useState<TwinMetadata | null>(null);
  const [insights, setInsights] = useState<SmartCityInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>('online');

  // AI Panel States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { metadata: savedMetadata, insights: savedInsights, view: savedView } = JSON.parse(saved);
        if (savedMetadata) setMetadata(savedMetadata);
        if (savedInsights) setInsights(savedInsights);
        if (savedView) setCurrentView(savedView);
        console.log("System state sustained from local persistence.");
      } catch (e) {
        console.error("Persistence hydration failed", e);
      }
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    if (metadata) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        metadata,
        insights,
        view: currentView
      }));
    }
  }, [metadata, insights, currentView]);

  // Connectivity Listener
  useEffect(() => {
    const updateStatus = () => {
      setConnectivity(navigator.onLine ? 'online' : 'offline-fog');
    };
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const fetchInsights = useCallback(async (data: TwinMetadata) => {
    if (!navigator.onLine) {
      console.warn("Offline mode: Skipping AI insight generation. Using Fog cached logic.");
      return;
    }
    setIsLoading(true);
    try {
      const results = await generateDigitalTwinInsights(data);
      setInsights(results);
    } catch (err) {
      console.error("Failed to load twin insights", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOnboardingComplete = (data: TwinMetadata) => {
    setMetadata(data);
    fetchInsights(data);
  };

  const handleRefresh = () => {
    if (metadata) fetchInsights(metadata);
  };

  const renderContent = () => {
    if (currentView === 'documentation') {
      return <Documentation />;
    }
    
    if (currentView === 'admin') {
      return <AdminSettings metadata={metadata} />;
    }

    if (!metadata) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            metadata={metadata} 
            insights={insights} 
            isLoading={isLoading} 
            onRefresh={handleRefresh}
            connectivity={connectivity}
          />
        );
      case 'gis-analysis':
        return <GISAnalysis metadata={metadata} connectivity={connectivity} />;
      default:
        return null;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      isMetadataSet={!!metadata}
      connectivity={connectivity}
    >
      {renderContent()}

      {/* AI Access Triggers */}
      {metadata && (
        <div className="fixed bottom-6 right-6 z-[3000] flex flex-col gap-3">
          <button 
            onClick={() => setIsVoiceOpen(true)}
            className="w-14 h-14 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
            title="Open AI Voice"
          >
            <span className="text-2xl group-hover:animate-pulse">🎙️</span>
          </button>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
            title="Open AI Chat"
          >
            <span className="text-2xl group-hover:animate-pulse">💬</span>
          </button>
        </div>
      )}

      {isChatOpen && (
        <AIChatPanel metadata={metadata} onClose={() => setIsChatOpen(false)} />
      )}
      
      {isVoiceOpen && (
        <LiveAudioPanel metadata={metadata} onClose={() => setIsVoiceOpen(false)} />
      )}
    </Layout>
  );
};

export default App;
