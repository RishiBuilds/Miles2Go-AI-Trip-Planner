"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Load Globe client-side only
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type Props = {
  className?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

const GlobalMap: React.FC<Props> = ({
  className = "",
  autoRotate = true,
  autoRotateSpeed = 0.4,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);

  const [dims, setDims] = useState({ width: 600, height: 400 });
  const [countries, setCountries] = useState<any[]>([]);

  // ✅ Fetch country borders
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
      .then((res) => res.json())
      .then((data) => setCountries(data.features));
  }, []);

  // ✅ Responsive resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setDims({
          width: Math.max(320, Math.floor(cr.width)),
          height: Math.max(260, Math.floor(cr.height)),
        });
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ✅ Controls setup (rotate, zoom, pan)
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    if (!controls) return;

    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 150;
    controls.maxDistance = 1500;
  }, [autoRotate, autoRotateSpeed]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[400px] sm:h-[500px] md:h-[200px] lg:h-[620px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 ${className}`}
    >
      <Globe
        ref={globeRef}
        width={dims.width}
        height={dims.height}
        backgroundColor="#f0f9ff"
        showAtmosphere
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.25}
        // 🌍 High-resolution Earth textures
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        // 🌍 Country borders
        polygonsData={countries}
        polygonCapColor={() => "rgba(255,255,255,0.1)"} // subtle light overlay
        polygonSideColor={() => "rgba(200,200,200,0.1)"} // light shading
        polygonStrokeColor={() => "#94a3b8"} // soft gray borders
        polygonLabel={(d: any) => `
          <div style="
            padding: 8px 12px;
            max-width: 180px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <strong style="color: #1e293b; font-size: 14px;">${d.properties.name}</strong>
          </div>
        `}
      />
    </div>
  );
};

export default GlobalMap;