import React from "react";
import dynamic from "next/dynamic";
import GuideHeader from "@/components/GuideHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Globe Job Radar | Real-Time Direct Source Jobs",
  description:
    "Explore verified direct-source tech jobs globally using an interactive 3D Globe Radar. Instant cinematic fly-to zoom across Bangalore, SF, NYC, London, Berlin and more.",
};

// Dynamically import JobRadarGlobe with SSR disabled for Mapbox GL JS
const JobRadarGlobe = dynamic(() => import("@/components/JobRadarGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-64px)] min-h-[640px] bg-[#040610] flex flex-col items-center justify-center text-cyan-400 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-emerald-500/20 border-b-emerald-400 animate-spin" style={{ animationDirection: "reverse" }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold tracking-widest uppercase text-cyan-300">
          INITIALIZING 3D GLOBE RADAR...
        </p>
        <p className="text-xs text-slate-400">
          Calibrating orbital telemetry & scanning direct-ATS job pipelines
        </p>
      </div>
    </div>
  ),
});

export default function RadarPage() {
  return (
    <main className="min-h-screen bg-[#040610] text-white flex flex-col overflow-hidden">
      <GuideHeader />
      <div className="flex-1 w-full relative">
        <JobRadarGlobe />
      </div>
    </main>
  );
}
