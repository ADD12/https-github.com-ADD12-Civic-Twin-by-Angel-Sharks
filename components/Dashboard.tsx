
import React, { useState, useEffect } from 'react';
import { TwinMetadata, SmartCityInsight, MeshNode, TacticalAlert, ConnectivityStatus } from '../types';
import { Map } from './Map';
import { DataLayerCard } from './DataLayerCard';
import { BLanTacticalPanel } from './BLanTacticalPanel';
import { FeedbackModal } from './FeedbackModal';

interface DashboardProps {
  metadata: TwinMetadata;
  insights: SmartCityInsight[];
  isLoading: boolean;
  onRefresh: () => void;
  connectivity: ConnectivityStatus;
}

export const Dashboard: React.FC<DashboardProps> = ({ metadata, insights, isLoading, onRefresh, connectivity }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>([]);
  const [tacticalAlerts, setTacticalAlerts] = useState<TacticalAlert[]>([]);
  
  const isFogMode = connectivity === 'offline-fog';

  useEffect(() => {
    // Populate Mesh Nodes with CID References
    const baseNodes: MeshNode[] = [
      { id: 'FOG-PRIMARY-01', status: 'active', signal: 98, type: 'Fog', cidRef: metadata.cids[0]?.id },
      { id: 'B-LAN-RELAY-A', status: 'active', signal: 72, type: 'Static', cidRef: metadata.cids[1]?.id },
      { id: 'MOBILE-HUB-X', status: 'relay', signal: 55, type: 'Mobile', cidRef: metadata.cids[2]?.id },
    ];
    setMeshNodes(baseNodes);

    if (isFogMode || metadata.isEmergencyMode) {
      setTacticalAlerts([
        { timestamp: 'L-14:22', sender: 'FOG-COORD', message: 'Internet disrupted. B-lan Core syncing CID Community networks.', priority: 'high' },
        { timestamp: 'L-14:30', sender: 'B-LAN-SYS', message: 'CID-772 Mesh active. Peer-to-peer data distribution enabled.', priority: 'critical' },
      ]);
    }
  }, [isFogMode, metadata.isEmergencyMode, metadata.cids]);

  return (
    <div className={`flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative ${isFogMode || metadata.isEmergencyMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[1800] w-full max-w-[300px] border-r transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isFogMode || metadata.isEmergencyMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/50' : 'bg-white border-slate-200'}
      `} aria-label="City Metadata Sidebar">
        <div className="h-full flex flex-col p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
          
          <div className="mb-8">
            <div className={`flex items-center gap-2 text-[10px] font-black mb-2 uppercase tracking-[0.2em] ${isFogMode ? 'text-amber-500' : 'text-emerald-700'}`}>
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isFogMode ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-emerald-600'}`}></span>
              {isFogMode ? 'FOG NODE ACTIVE (B-LAN)' : 'CLOUD SYNCHRONIZED'}
            </div>
            <h2 className="text-2xl font-black leading-tight mb-2">{metadata.name}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${isFogMode ? 'bg-amber-900/40 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                {metadata.type}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-blue-900/40 text-blue-300">
                {metadata.cids.length} CIDs ACTIVE
              </span>
            </div>
          </div>

          <nav className="space-y-8 flex-1">
            <section>
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-4">Regional CIDs</h3>
              <div className="space-y-2">
                {metadata.cids.map(cid => (
                  <div key={cid.id} className={`p-3 rounded-xl border flex items-center justify-between ${isFogMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">CID-{cid.id}</p>
                      <p className="text-xs font-bold text-slate-300 truncate w-32">{cid.name}</p>
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full ${cid.meshActive ? 'bg-emerald-500' : 'bg-rose-500 opacity-30'}`}></span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-4">Core Telemetry</h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl border ${isFogMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-black uppercase mb-1 opacity-60">Last Sync Source</p>
                  <p className="text-xs font-bold">{isFogMode ? 'Local Fog Peer' : 'Azure/GCP Cloud'}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isFogMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-black uppercase mb-1 opacity-60">Spatial Cache</p>
                  <p className="text-xs font-bold">100% Sustained</p>
                </div>
              </div>
            </section>
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <button
              onClick={onRefresh}
              disabled={isLoading || isFogMode}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30 transition-all ${isFogMode ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-slate-900 text-white'}`}
            >
              {isFogMode ? 'SYNC BLOCKED (OFFLINE)' : isLoading ? 'REFRESHING...' : 'FORCE CLOUD SYNC'}
            </button>
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="w-full py-3 bg-slate-800 text-slate-400 font-black text-[10px] rounded-xl transition-all border border-slate-700 uppercase"
            >
              System Feedback
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative" role="main">
        {isFogMode && (
          <div className="bg-amber-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-center shadow-lg relative z-10 animate-pulse" role="alert">
            FOG NETWORK ACTIVE: B-LAN CORE SUSTAINING LAST STATE
          </div>
        )}

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <div className={`transition-all duration-500 p-4 lg:p-6 relative ${isMapExpanded ? 'h-full sticky top-0 z-[1500] !p-0' : 'h-[60vh] pb-0'}`}>
              <div className="h-full rounded-3xl overflow-hidden relative shadow-2xl border-4 border-white">
                {metadata.location && <Map location={metadata.location} name={metadata.name} isExpanded={isMapExpanded} />}
                <button 
                  onClick={() => setIsMapExpanded(!isMapExpanded)} 
                  className="absolute top-6 right-6 z-[2000] p-4 bg-white/90 backdrop-blur shadow-2xl rounded-2xl text-slate-900 hover:scale-110 active:scale-90 transition-all border border-slate-200"
                >
                  <span className="text-xl leading-none">{isMapExpanded ? '🏹' : '🔍'}</span>
                </button>
              </div>
            </div>

            <div className={`p-4 sm:p-6 lg:p-10 transition-all duration-500 ${isMapExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
              <header className="mb-8 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Intelligence Matrix</h3>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Community Improvement Districts (CIDs)</p>
                </div>
                {isFogMode && <span className="text-[10px] font-black bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full uppercase">Fog AI Analysis Active</span>}
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                {insights.map((insight, idx) => (
                  <DataLayerCard key={idx} insight={insight} />
                ))}
              </div>
            </div>
          </div>
          
          <div className={`transition-all duration-500 xl:h-full overflow-hidden ${isMapExpanded ? 'w-0 border-0 opacity-0' : 'w-full xl:w-[350px] bg-slate-950 p-6 border-l border-slate-800'}`}>
            <BLanTacticalPanel nodes={meshNodes} alerts={tacticalAlerts} />
          </div>
        </div>
      </div>

      {isFeedbackOpen && (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      )}
    </div>
  );
};
