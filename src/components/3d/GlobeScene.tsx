"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { InteractiveGlobe } from "./InteractiveGlobe";
import { CityPin } from "@/config/site";
import { OrbitControls } from "@react-three/drei";

interface GlobeSceneProps {
  activeCityId: string;
  onSelectCity: (city: CityPin) => void;
}

export function GlobeScene({ activeCityId, onSelectCity }: GlobeSceneProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full w-full min-h-[420px] bg-transparent" />;
  }

  return (
    <div className="relative h-[420px] md:h-[540px] w-full max-w-2xl mx-auto cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#00E5A0" />
        <pointLight position={[-8, -5, -5]} intensity={0.8} color="#00D2FF" />

        <Suspense fallback={null}>
          <InteractiveGlobe
            activeCityId={activeCityId}
            onSelectCity={onSelectCity}
            radius={2.9}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

