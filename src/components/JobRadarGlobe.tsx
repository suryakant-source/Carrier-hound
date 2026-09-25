"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  RADAR_CITIES,
  RADAR_COUNTRIES,
  RadarCity,
  RadarJob,
  CountryRegion,
} from "@/data/radarCities";
import {
  RotateCw,
  MapPin,
  ExternalLink,
  DollarSign,
  Clock,
  X,
  ChevronRight,
  ShieldCheck,
  Radio,
  CheckCircle2,
  Compass,
} from "lucide-react";

// Convert latitude and longitude to a 3D Cartesian Vector3 on a sphere
function latLngToVector3(lat: number, lng: number, radius: number = 5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

export default function JobRadarGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Three.js instances stored in refs
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const earthMeshRef = useRef<any>(null);

  // Camera animation target
  const targetCameraPosRef = useRef<any>(null);
  const targetLookAtRef = useRef<any>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // State
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<RadarCity | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [markerPositions, setMarkerPositions] = useState<
    Array<{
      city: RadarCity;
      x: number;
      y: number;
      visible: boolean;
    }>
  >([]);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  const isSpinningRef = useRef<boolean>(true);
  isSpinningRef.current = isSpinning;

  // Initialize Three.js 3D Globe
  useEffect(() => {
    let isCancelled = false;

    const initGlobe = async () => {
      if (!containerRef.current) return;

      const THREE = await import("three");
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // 1. Scene, Camera, Renderer
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 4, 14);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      rendererRef.current = renderer;

      // Clear container and append canvas
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(renderer.domElement);

      // 2. OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.rotateSpeed = 0.6;
      controls.zoomSpeed = 0.8;
      controls.minDistance = 7;
      controls.maxDistance = 25;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controlsRef.current = controls;

      // When user starts dragging, pause auto-rotation and release transition
      controls.addEventListener("start", () => {
        isTransitioningRef.current = false;
        setIsSpinning(false);
      });

      // 3. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0x7dd3fc, 1.6);
      sunLight.position.set(12, 8, 14);
      scene.add(sunLight);

      const backLight = new THREE.DirectionalLight(0x0284c7, 0.8);
      backLight.position.set(-10, -5, -10);
      scene.add(backLight);

      // 4. Background Starfield
      const starsGeometry = new THREE.BufferGeometry();
      const starsCount = 1200;
      const starPositions = new Float32Array(starsCount * 3);
      for (let i = 0; i < starsCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 160;
        starPositions[i + 1] = (Math.random() - 0.5) * 160;
        starPositions[i + 2] = (Math.random() - 0.5) * 160;
      }
      starsGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
      );
      const starsMaterial = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.6,
        transparent: true,
        opacity: 0.7,
      });
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);

      // 5. Earth Sphere with Night Texture
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        "/globe/earth-night.jpg",
        (texture) => {
          if (isCancelled) return;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

          const earthGeo = new THREE.SphereGeometry(5, 64, 64);
          const earthMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.65,
            metalness: 0.15,
          });

          const earthMesh = new THREE.Mesh(earthGeo, earthMat);
          scene.add(earthMesh);
          earthMeshRef.current = earthMesh;
        },
        undefined,
        (err) => {
          console.warn("Failed to load earth-night.jpg, falling back to basic wireframe:", err);
          const fallbackMat = new THREE.MeshStandardMaterial({
            color: 0x0c1b33,
            wireframe: true,
          });
          const earthMesh = new THREE.Mesh(
            new THREE.SphereGeometry(5, 32, 32),
            fallbackMat
          );
          scene.add(earthMesh);
          earthMeshRef.current = earthMesh;
        }
      );

      // 6. Glowing Atmospheric Shell
      const atmosGeo = new THREE.SphereGeometry(5.18, 64, 64);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide,
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      scene.add(atmosMesh);

      // Outer Cyan Atmospheric Halo
      const haloGeo = new THREE.SphereGeometry(5.35, 64, 64);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      scene.add(haloMesh);

      // 7. City Markers in 3D
      RADAR_CITIES.forEach((city) => {
        const { x, y, z } = latLngToVector3(
          city.coordinates[1],
          city.coordinates[0],
          5.02
        );
        const markerVec = new THREE.Vector3(x, y, z);

        // Core glowing diode
        const diodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const diodeMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
        const diode = new THREE.Mesh(diodeGeo, diodeMat);
        diode.position.copy(markerVec);
        scene.add(diode);

        // Outer pulsing ring
        const ringGeo = new THREE.RingGeometry(0.12, 0.22, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(markerVec);
        ring.lookAt(markerVec.clone().multiplyScalar(2));
        scene.add(ring);
      });

      // 8. Resize Handler
      const handleResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // 9. Main Animation Loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);

        // Smooth camera transition (flyTo) - keeping pivot at Earth center (0,0,0)
        if (isTransitioningRef.current && targetCameraPosRef.current) {
          camera.position.lerp(targetCameraPosRef.current, 0.075);
          controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.075);
          controls.update();

          // Check if arrived close enough to stop transition
          if (camera.position.distanceTo(targetCameraPosRef.current) < 0.1) {
            isTransitioningRef.current = false;
          }
        } else {
          // Controls update with auto-rotate
          controls.autoRotate = isSpinningRef.current && !selectedCity;
          controls.update();
        }

        // Project 3D City Coordinates to 2D Screen Space
        const newMarkerPositions: Array<{
          city: RadarCity;
          x: number;
          y: number;
          visible: boolean;
        }> = [];

        const camPos = camera.position.clone().normalize();

        RADAR_CITIES.forEach((city) => {
          const { x, y, z } = latLngToVector3(
            city.coordinates[1],
            city.coordinates[0],
            5.05
          );
          const worldPos = new THREE.Vector3(x, y, z);

          // Dot product determines if on the camera-facing side of the earth
          const markerDir = worldPos.clone().normalize();
          const dot = camPos.dot(markerDir);
          const isFacingCamera = dot > 0.15;

          const screenVec = worldPos.clone().project(camera);
          const screenX = (screenVec.x * 0.5 + 0.5) * containerRef.current!.clientWidth;
          const screenY = (-(screenVec.y * 0.5) + 0.5) * containerRef.current!.clientHeight;

          newMarkerPositions.push({
            city,
            x: screenX,
            y: screenY,
            visible: isFacingCamera && screenVec.z < 1,
          });
        });

        setMarkerPositions(newMarkerPositions);
        renderer.render(scene, camera);
      };

      animate();
    };

    initGlobe();

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  // Handle City Select: Smooth Cinematic FlyTo without locking orbit center
  const handleCitySelect = useCallback(async (city: RadarCity) => {
    setSelectedCity(city);
    setIsSpinning(false);

    if (!cameraRef.current || !controlsRef.current) return;

    const THREE = await import("three");
    const { x, y, z } = latLngToVector3(
      city.coordinates[1],
      city.coordinates[0],
      5
    );
    const cityVec = new THREE.Vector3(x, y, z);

    // Zoom directly in front of the city looking toward center (0, 0, 0)
    // Distance 8.2 allows dramatic zoom while maintaining free 360-degree orbit capability
    const cameraTarget = cityVec.clone().normalize().multiplyScalar(8.2);

    targetCameraPosRef.current = cameraTarget;
    targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    isTransitioningRef.current = true;
  }, []);

  // Handle Close City Drawer and Smoothly Pull Back to Orbit
  const handleCloseCity = useCallback(async () => {
    setSelectedCity(null);
    if (!cameraRef.current || !controlsRef.current) return;

    const THREE = await import("three");
    const currentDir = cameraRef.current.position.clone().normalize();
    targetCameraPosRef.current = currentDir.multiplyScalar(13.8);
    targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    isTransitioningRef.current = true;
    setIsSpinning(true);
  }, []);

  // Handle Country Filter Pill Click: Smooth Camera Orbit to Country Center
  const handleCountryFilter = async (country: CountryRegion) => {
    setSelectedCountry(country.id);
    setSelectedCity(null);

    if (!cameraRef.current || !controlsRef.current) return;

    const THREE = await import("three");

    if (country.id === "all") {
      setIsSpinning(true);
      targetCameraPosRef.current = new THREE.Vector3(0, 4, 14);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
      isTransitioningRef.current = true;
    } else {
      setIsSpinning(false);
      // Coordinates of country center
      const { x, y, z } = latLngToVector3(
        country.center[1],
        country.center[0],
        5
      );
      const countryVec = new THREE.Vector3(x, y, z);
      const targetPos = countryVec.clone().normalize().multiplyScalar(10.5);

      targetCameraPosRef.current = targetPos;
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
      isTransitioningRef.current = true;
    }
  };

  // Reset Orbit / Zoom Out
  const handleResetOrbit = async () => {
    setSelectedCity(null);
    setSelectedCountry("all");
    setIsSpinning(true);

    if (!cameraRef.current || !controlsRef.current) return;
    const THREE = await import("three");
    targetCameraPosRef.current = new THREE.Vector3(0, 4, 14);
    targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    isTransitioningRef.current = true;
  };

  const handleApplyClick = (jobId: string) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[640px] bg-[#040610] text-white overflow-hidden select-none font-sans">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onClick={() => {
          if (selectedCity) {
            handleCloseCity();
          }
        }}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Cyber Radial Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/10 to-slate-950/70" />

      {/* ========================================================================= */}
      {/* 3D PROJECTED HTML CITY MARKERS (Interactive overlay)                      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {markerPositions.map(({ city, x, y, visible }) => {
          const isFilterMatch =
            selectedCountry === "all" || city.countryCode === selectedCountry;
          if (!visible || !isFilterMatch) return null;

          const isSelected = selectedCity?.id === city.id;

          return (
            <button
              key={city.id}
              type="button"
              aria-label={`View ${city.activeJobsCount} jobs in ${city.name}`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
              }}
              className="city-marker-btn absolute pointer-events-auto flex flex-col items-center cursor-pointer group transition-transform duration-200 hover:scale-115 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleCitySelect(city);
              }}
            >
              {/* Concentric Radar Ping Animation */}
              <div className="absolute -top-3.5 -left-3.5 w-11 h-11 rounded-full bg-cyan-400/25 animate-radar-ping pointer-events-none" />
              <div className="absolute -top-3.5 -left-3.5 w-11 h-11 rounded-full bg-emerald-400/20 animate-radar-ping-delay pointer-events-none" />

              {/* Core Pulsing Diode */}
              <div
                className={`relative w-4 h-4 rounded-full border-2 border-white shadow-[0_0_15px_#22d3ee] flex items-center justify-center transition-all ${
                  isSelected ? "bg-emerald-400 scale-125" : "bg-cyan-400 group-hover:bg-cyan-300"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* City Tag Badge */}
              <div
                className={`mt-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-slate-950 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30"
                    : "bg-slate-950/90 border-cyan-500/40 text-cyan-300 group-hover:border-cyan-300 group-hover:bg-slate-900"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{city.name}</span>
                <span className="text-cyan-400/70 font-normal">
                  ({city.activeJobsCount})
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TOP FLOATING BAR: Country Filter Pills & Radar Telemetry                 */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-0 right-0 z-30 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 pointer-events-none gap-3">
        {/* Left: Radar Status Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-cyan-200">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="uppercase font-mono">3D JOB RADAR</span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300 font-normal">
              348 Live Direct Openings
            </span>
          </div>
        </div>

        {/* Center: Country Filter Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-slate-950/85 border border-slate-700/60 backdrop-blur-md shadow-xl max-w-full overflow-x-auto no-scrollbar">
          {RADAR_COUNTRIES.map((country) => {
            const isActive = selectedCountry === country.id;
            return (
              <button
                key={country.id}
                type="button"
                onClick={() => handleCountryFilter(country)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] font-bold scale-102"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{country.flag}</span>
                <span>{country.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Controls (Reset, Spin Toggle) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Reset Orbit Button */}
          <button
            type="button"
            onClick={handleResetOrbit}
            title="Reset to Global Orbit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:border-cyan-400 hover:bg-slate-900 transition-all backdrop-blur-md shadow-md"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset Orbit</span>
          </button>

          {/* Auto-Spin Toggle */}
          <button
            type="button"
            onClick={() => setIsSpinning((prev) => !prev)}
            title={isSpinning ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
            className={`p-2 rounded-full border text-xs font-medium transition-all backdrop-blur-md shadow-md ${
              isSpinning
                ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300"
                : "bg-slate-950/80 border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <Compass
              className={`w-4 h-4 ${
                isSpinning ? "animate-spin text-cyan-400" : ""
              }`}
              style={{ animationDuration: "12s" }}
            />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POP-OUT JOB CARDS DRAWER / HUD (When city is selected)                   */}
      {/* ========================================================================= */}
      {selectedCity && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[480px] z-40 max-h-[82vh] flex flex-col rounded-2xl bg-slate-950/92 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_10px_40px_rgba(6,182,212,0.25)] animate-pop-out overflow-hidden">
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900/95 to-cyan-950/50 border-b border-cyan-500/20 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  RADAR LOCKED • {selectedCity.countryCode.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                <MapPin className="w-5 h-5 text-cyan-400" />
                {selectedCity.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="font-mono text-cyan-300/80 text-[11px]">
                  LAT: {selectedCity.coordinates[1].toFixed(2)}° | LNG:{" "}
                  {selectedCity.coordinates[0].toFixed(2)}°
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-400">
                  {selectedCity.activeJobsCount} Active Direct Jobs
                </span>
              </div>
            </div>

            {/* Close / Orbit Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCloseCity}
                title="Back to Global Orbit"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 hover:bg-cyan-950/80 text-xs font-semibold text-cyan-300 hover:text-white transition-all border border-cyan-500/30 cursor-pointer shadow-xs"
              >
                <RotateCw className="w-3 h-3 text-cyan-400" />
                <span>Orbit</span>
              </button>
              <button
                type="button"
                onClick={handleCloseCity}
                aria-label="Close job drawer"
                className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-600/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Job Cards List (Scrollable) */}
          <div className="p-4 overflow-y-auto max-h-[58vh] space-y-3.5 divide-y divide-slate-800/60">
            {selectedCity.jobs.map((job, idx) => {
              const isApplied = appliedJobs[job.id];

              return (
                <div
                  key={job.id}
                  className={`pt-3.5 first:pt-0 group transition-all duration-200 ${
                    idx === 0
                      ? "p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/30 shadow-inner"
                      : ""
                  }`}
                >
                  {/* Top line: Company + Logo + Time */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Company Avatar / Logo */}
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job.companyColor} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 ring-1 ring-white/10`}
                      >
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {job.role}
                        </h4>
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{job.company}</span>
                          <span>•</span>
                          <span className="text-slate-400">{job.type}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-cyan-400/80 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {job.postedTime}
                    </span>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Compensation & Tags */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      {job.salary}
                    </span>

                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Row */}
                  <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/40">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Direct ATS</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleApplyClick(job.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                          isApplied
                            ? "bg-emerald-600 text-white"
                            : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30 hover:shadow-cyan-400/50"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>Link Opened</span>
                          </>
                        ) : (
                          <>
                            <span>Direct Apply</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-3 bg-slate-950 border-t border-cyan-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Showing {selectedCity.jobs.length} of {selectedCity.activeJobsCount} roles
            </span>
            <Link
              href={`/job-search/all?city=${selectedCity.id}`}
              className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300"
            >
              <span>Explore all in {selectedCity.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM-LEFT HUD: Radar Telemetry & Instructions                           */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[11px] text-slate-400 pointer-events-none max-w-xs shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>HOW TO NAVIGATE RADAR</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          • Click any glowing <span className="text-cyan-300 font-semibold">City Marker</span> for cinematic fly-in.
          <br />
          • Click <span className="text-cyan-300 font-semibold">Country Pills</span> above to auto-rotate globe to that region.
          <br />
          • Drag to rotate freely • Scroll to zoom.
        </p>
      </div>
    </div>
  );
}
