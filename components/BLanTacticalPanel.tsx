
import React from 'react';
import { MeshNode, TacticalAlert } from '../types';

interface BLanTacticalPanelProps {
  nodes: MeshNode[];
  alerts: TacticalAlert[];
}

export const BLanTacticalPanel: React.FC<BLanTacticalPanelProps> = ({ nodes, alerts }) => {
  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-right duration-500">
      {/* Mesh Status */}
      <section className="bg-slate-900 border border-rose-500/30 rounded-2xl p-4 shadow-lg shadow-rose-900/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Mesh Discovery (B-lan)</h3>
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </div>
        
        <div className="space-y-3">
          {nodes.map(node => (
            <div key={node.id} className="flex items-center justify-between bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-6 rounded-full ${node.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <div>
                  <p className="text-[10px] font-black text-slate-100 uppercase">{node.id}</p>
                  <p className="text-[9px] text-slate-500 font-bold italic">{node.type} Node</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-rose-400">{node.signal}%</p>
                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-rose-500" style={{ width: `${node.signal}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Neighbor Intake Feed */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Resident Mesh Pulse</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
             <span>Saratoga Sector</span>
             <span className="text-emerald-500">92 Households Active</span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
             <span>Highlands Sector</span>
             <span className="text-amber-500">41 Households Degraded</span>
          </div>
        </div>
      </section>

      {/* Tactical Comms */}
      <section className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Emergency Comms Log</h3>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {alerts.map((alert, i) => (
            <div key={i} className={`p-3 rounded-xl text-xs font-medium border-l-2 ${
              alert.priority === 'critical' ? 'bg-rose-950/20 border-rose-600 text-rose-200' : 'bg-slate-950/40 border-slate-700 text-slate-300'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-[9px] uppercase tracking-wider text-slate-500">{alert.sender}</span>
                <span className="text-[9px] font-mono text-slate-600">{alert.timestamp}</span>
              </div>
              <p className="leading-relaxed">{alert.message}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800">
          <input 
            type="text" 
            placeholder="Broadcast to Resident Mesh..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-rose-500/50 transition-colors"
          />
        </div>
      </section>
    </div>
  );
};
