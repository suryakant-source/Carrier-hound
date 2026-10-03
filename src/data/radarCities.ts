/**
 * Radar Types & Region Configuration for CareerMonke 3D Job Radar.
 * Completely backed by live Supabase telemetry.
 */

export interface RadarJobCard {
  id: string;
  title: string;
  company: string;
  location: string;
  countryCode: string | null;
  remoteScope: string;
  remoteEligibility: string;
  jobType: string;
  salaryText: string | null;
  verified: boolean;
  sourceType: string;
  applyUrl: string;
  postedAt: string | null;
  discoveredAt: string | null;
  lastSeenAt: string | null;
  seniority: string | null;
}

export interface RadarCityAggregate {
  id: string;
  name: string;
  countryCode: string;
  region: 'americas' | 'europe' | 'asia_pac' | 'global';
  coordinates: [number, number]; // [longitude, latitude]
  totalCount: number;
  verifiedCount: number;
  topCompanies: string[];
}

export interface RadarCountryAggregate {
  total: number;
  verified: number;
  name: string;
  coordinates: [number, number];
}

export interface RadarTelemetryPayload {
  header: {
    totalActive: number;
    totalVerified: number;
    dataAsOf: string;
  };
  cities: RadarCityAggregate[];
  countries: Record<string, RadarCountryAggregate>;
  worldwideRemote: {
    id: string;
    name: string;
    totalCount: number;
    verifiedCount: number;
    topCompanies: string[];
  };
  unlocated: {
    totalCount: number;
    verifiedCount: number;
  };
}

export interface CountryRegion {
  id: string;
  name: string;
  isoCode: string;
  label: string;
  flag: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
}

export const RADAR_REGIONS: CountryRegion[] = [
  {
    id: 'all',
    name: 'Global',
    isoCode: 'ALL',
    label: 'Global Orbit',
    flag: '🌐',
    center: [0, 20],
    zoom: 2,
  },
  {
    id: 'US',
    name: 'United States',
    isoCode: 'US',
    label: 'United States',
    flag: '🇺🇸',
    center: [-98.5795, 39.8283],
    zoom: 3.5,
  },
  {
    id: 'IN',
    name: 'India',
    isoCode: 'IN',
    label: 'India',
    flag: '🇮🇳',
    center: [78.9629, 20.5937],
    zoom: 4,
  },
  {
    id: 'EU',
    name: 'Europe',
    isoCode: 'EU',
    label: 'Europe',
    flag: '🇪🇺',
    center: [10.4515, 51.1657],
    zoom: 4,
  },
  {
    id: 'APAC',
    name: 'Asia-Pacific',
    isoCode: 'APAC',
    label: 'Asia-Pacific',
    flag: '🌏',
    center: [120.9842, 14.5995],
    zoom: 3.8,
  },
];

// Density Color Scale Helper (Fixed Logarithmic Thresholds)
export interface DensityColorInfo {
  hex: number;
  css: string;
  glowCss: string;
  label: string;
  min: number;
  max: number;
}

export const DENSITY_TIERS: DensityColorInfo[] = [
  {
    hex: 0x06b6d4, // Cyan
    css: '#06b6d4',
    glowCss: 'rgba(6, 182, 212, 0.4)',
    label: '1 - 9 jobs',
    min: 1,
    max: 9,
  },
  {
    hex: 0x3b82f6, // Blue
    css: '#3b82f6',
    glowCss: 'rgba(59, 130, 246, 0.45)',
    label: '10 - 99 jobs',
    min: 10,
    max: 99,
  },
  {
    hex: 0x8b5cf6, // Violet
    css: '#8b5cf6',
    glowCss: 'rgba(139, 92, 246, 0.5)',
    label: '100 - 999 jobs',
    min: 100,
    max: 999,
  },
  {
    hex: 0xf59e0b, // Amber / Orange
    css: '#f59e0b',
    glowCss: 'rgba(245, 158, 11, 0.55)',
    label: '1,000+ jobs',
    min: 1000,
    max: Infinity,
  },
];

export function getDensityColor(count: number): DensityColorInfo {
  if (count >= 1000) return DENSITY_TIERS[3];
  if (count >= 100) return DENSITY_TIERS[2];
  if (count >= 10) return DENSITY_TIERS[1];
  return DENSITY_TIERS[0];
}

// Capped logarithmic marker radius scaling (min 0.09, max 0.22)
export function getMarkerRadius(count: number): number {
  if (count <= 0) return 0.08;
  const scale = Math.log10(count + 1); // 1 job -> 0.3, 1000 jobs -> 3.0
  return Math.min(0.24, Math.max(0.09, 0.07 + scale * 0.05));
}
