
export interface GeoLocation {
  lat: number;
  lng: number;
  displayName: string;
}

export interface MeshNode {
  id: string;
  status: 'active' | 'relay' | 'failing';
  signal: number; // 0-100
  type: 'Static' | 'Mobile' | 'Fog' | 'Fiber' | 'Wi-Fi';
  cidRef?: string; // Reference to which Community ID this node serves
}

export interface CID {
  id: string;
  name: string;
  population: number;
  meshActive: boolean;
}

export interface TacticalAlert {
  timestamp: string;
  sender: string;
  message: string;
  priority: 'low' | 'high' | 'critical';
  targetCid?: string; // If null, it's global. If set, specific to a community.
}

export interface NeighborhoodBLan {
  name: string;
  nodes: number;
  health: number; // 0-100
  status: 'stable' | 'degraded' | 'isolated';
  cid: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface GISLayerEndpoints {
  parcels?: string;
  utilities?: string;
  infrastructure?: string;
  safety?: string;
}

export interface TwinMetadata {
  name: string;
  address: string;
  location: GeoLocation | null;
  type: 'City' | 'Community' | 'Farm' | 'Special District';
  officialUrl?: string;
  gisLayers?: GISLayerEndpoints;
  isEmergencyMode?: boolean;
  cids: CID[]; // Community IDs supported in this region
}

export enum NISTLayer {
  ENERGY = 'Energy',
  WATER = 'Water',
  WASTE = 'Waste',
  TRANSPORTATION = 'Transportation',
  PUBLIC_SAFETY = 'Public Safety',
  HEALTHCARE = 'Healthcare'
}

export interface SmartCityInsight {
  layer: NISTLayer;
  status: 'optimal' | 'warning' | 'critical';
  value: string;
  summary: string;
  recommendations: string[];
}

// Added missing BranchSuggestion interface to resolve import errors
export interface BranchSuggestion {
  name: string;
  purpose: string;
  prTitle: string;
  prBody: string;
}

// Added missing PRInfo interface for GitHub API response typing
export interface PRInfo {
  number: number;
  html_url: string;
  title: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface Feedback {
  id: string;
  type: 'bug' | 'feature';
  title: string;
  description: string;
  timestamp: string;
}

export type ViewType = 'dashboard' | 'gis-analysis' | 'admin' | 'documentation';

export type ConnectivityStatus = 'online' | 'offline-fog' | 'disconnected';

export interface DashboardState {
  metadata: TwinMetadata;
  insights: SmartCityInsight[];
  isGenerating: boolean;
  currentView: ViewType;
}

export interface TrafficSimState {
  publicTransportAvailability: number; // 0-100
  trafficDensity: number; // 0-100
  peakHourDelay: number; // calculated
}
