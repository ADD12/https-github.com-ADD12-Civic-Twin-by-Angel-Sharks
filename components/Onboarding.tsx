
import React, { useState } from 'react';
import { TwinMetadata, GISLayerEndpoints, CID } from '../types';

interface OnboardingProps {
  onComplete: (metadata: TwinMetadata) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'City' as TwinMetadata['type'],
    officialUrl: ''
  });
  const [gisLayers, setGisLayers] = useState<GISLayerEndpoints>({
    parcels: '',
    utilities: '',
    infrastructure: '',
    safety: ''
  });
  const [cids, setCids] = useState<CID[]>([]);
  const [newCidName, setNewCidName] = useState('');
  const [tempLocation, setTempLocation] = useState<TwinMetadata['location']>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const encodedAddress = encodeURIComponent(formData.address);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        setTempLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name
        });
        setStep(2);
      } else {
        setError("Location not found. Try a street address or city name.");
      }
    } catch (err) {
      setError("Connectivity issue. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCid = () => {
    if (!newCidName) return;
    const cid: CID = {
      id: Math.floor(Math.random() * 900 + 100).toString(),
      name: newCidName,
      population: Math.floor(Math.random() * 5000 + 500),
      meshActive: true
    };
    setCids([...cids, cid]);
    setNewCidName('');
  };

  const finalizeOnboarding = (layers?: GISLayerEndpoints) => {
    onComplete({
      name: formData.name,
      address: formData.address,
      type: formData.type,
      location: tempLocation,
      officialUrl: formData.officialUrl,
      gisLayers: layers || {},
      isEmergencyMode: false,
      cids: cids.length > 0 ? cids : [
        { id: '772', name: `${formData.name} Central CID`, population: 1200, meshActive: true },
        { id: '104', name: `${formData.name} Highlands CID`, population: 850, meshActive: true }
      ]
    });
  };

  // Step 5: CID Definition
  if (step === 5) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 text-center bg-blue-50 border-b border-blue-200">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Define Community IDs</h2>
            <p className="text-sm text-slate-700 font-medium">Link local CIDs to your Wi-Fi Mesh Fog network (B-lan).</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCidName}
                onChange={(e) => setNewCidName(e.target.value)}
                placeholder="Community / CID Name" 
                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none"
              />
              <button 
                onClick={handleAddCid}
                className="px-6 py-4 bg-blue-600 text-white font-black rounded-2xl"
              >Add</button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {cids.map(c => (
                <div key={c.id} className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between">
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <span className="text-[10px] font-black text-blue-600 uppercase">CID-{c.id}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => finalizeOnboarding(gisLayers)}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl uppercase text-xs tracking-[0.2em]"
            >Launch Digital Twin Core</button>
          </div>
        </div>
      </div>
    );
  }

  // Simplified existing steps (logic preserved but Step 4 targets Step 5)
  if (step === 4) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 text-center bg-emerald-50 border-b border-emerald-200">
             <h2 className="text-3xl font-black text-slate-900 mb-2">Configure GIS Layers</h2>
             <p className="text-sm text-slate-700 font-medium">Provide spatial endpoints for precise urban modeling.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setStep(5); }} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['parcels', 'utilities', 'infrastructure', 'safety'].map(k => (
                <div key={k} className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">{k}</label>
                  <input
                    type="url"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm"
                    placeholder={`https://gis-server/${k}`}
                    value={(gisLayers as any)[k]}
                    onChange={(e) => setGisLayers({ ...gisLayers, [k]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest">Next: Define CIDs</button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-12 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-6">GIS Data Strategy</h2>
            <div className="space-y-4">
              <button onClick={() => setStep(4)} className="w-full p-6 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-between">
                <span>Add Custom GIS Layers</span>
                <span>→</span>
              </button>
              <button onClick={() => setStep(5)} className="w-full p-6 border-2 border-slate-200 text-slate-800 rounded-2xl font-bold flex items-center justify-between">
                <span>Use AI Data Defaults</span>
                <span>⚡</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 text-center bg-blue-50 border-b border-blue-200">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Connect Portal</h2>
            <p className="text-sm text-slate-700 font-medium">Link your official city website for AI data scraping.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="p-8 space-y-6">
            <input
              type="url"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none"
              placeholder="https://www.cityname.gov"
              value={formData.officialUrl}
              onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
            />
            <div className="flex gap-4">
               <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-slate-200 rounded-2xl font-bold">Back</button>
               <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg">Next Step</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-8 text-center bg-slate-50 border-b border-slate-200">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Initialize Civic Twin</h2>
          <p className="text-sm text-slate-700 font-medium">Calibrate your physical region for spatial simulation.</p>
        </div>
        <form onSubmit={handleStep1Submit} className="p-8 space-y-6">
          <input
            type="text"
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none"
            placeholder="Entity Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none"
            placeholder="Official Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-3"
          >
            {isLoading ? 'Calibrating...' : 'Next: Configure Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};
