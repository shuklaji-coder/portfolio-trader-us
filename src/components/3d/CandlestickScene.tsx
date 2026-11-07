"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CandlestickLandscape } from "./CandlestickLandscape";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface CandlestickSceneProps {
  scrollProgress?: number;
}

export function CandlestickScene({ scrollProgress = 0 }: CandlestickSceneProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Detect mobile or low performance
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReducedMotion) {
      setIsLowPower(true);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="absolute inset-0 bg-[#05070A] -z-10" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 16], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        style={{ pointerEvents: "auto" }}
      >
        <color attach="background" args={["#040609"]} />
        <fog attach="fog" args={["#040609", 14, 48]} />

        {/* Lighting Setup */}
        <ambientLight intensity={0.55} />
        <directionalLight position={[10, 18, 12]} intensity={1.5} color="#FFF8DE" />
        <pointLight position={[-12, 10, 6]} intensity={1.8} color="#00E5A0" />
        <pointLight position={[12, -4, -4]} intensity={1.6} color="#F5D061" />
        <pointLight position={[0, 8, 10]} intensity={1.2} color="#00D2FF" />

        <Suspense fallback={null}>
          <CandlestickLandscape scrollProgress={scrollProgress} />

          {/* Cinematic Bloom Postprocessing */}
          {!isLowPower && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.8}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.8}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

