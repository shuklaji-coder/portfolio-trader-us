"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CandlestickLandscapeProps {
  scrollProgress?: number;
}

export function CandlestickLandscape({ scrollProgress = 0 }: CandlestickLandscapeProps) {
  const bodiesRef = useRef<THREE.InstancedMesh>(null);
  const wicksRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Responsive instance count
  const isMobile = viewport.width < 5;
  const countX = isMobile ? 24 : 48;
  const countZ = isMobile ? 8 : 16;
  const totalCount = countX * countZ;

  // Generate procedural candlestick data
  const candleData = useMemo(() => {
    const data = [];
    const profitColor = new THREE.Color("#00E5A0");
    const lossColor = new THREE.Color("#FF4D5E");
    const cyanColor = new THREE.Color("#00D2FF");

    for (let z = 0; z < countZ; z++) {
      let currentPrice = Math.sin(z * 0.5) * 2;
      for (let x = 0; x < countX; x++) {
        // Procedural trending price action
        const delta = (Math.random() - 0.48) * 0.8 + Math.sin(x * 0.15) * 0.3;
        const open = currentPrice;
        const close = open + delta;
        currentPrice = close;

        const high = Math.max(open, close) + Math.random() * 0.6 + 0.1;
        const low = Math.min(open, close) - Math.random() * 0.6 - 0.1;

        const isUp = close >= open;
        const bodyHeight = Math.max(0.12, Math.abs(close - open));
        const bodyY = (open + close) / 2;
        const wickHeight = Math.max(0.3, high - low);
        const wickY = (high + low) / 2;

        const posX = (x - countX / 2) * 0.7;
        const posZ = (z - countZ / 2) * 1.8;

        // Occasional cyan highlight for special key level breakout
        let color = isUp ? profitColor : lossColor;
        if (x % 11 === 0 && isUp) {
          color = cyanColor;
        }

        data.push({
          posX,
          posZ,
          bodyY,
          bodyHeight,
          wickY,
          wickHeight,
          color,
          seed: Math.random() * Math.PI * 2,
        });
      }
    }
    return data;
  }, [countX, countZ]);

  // Set initial instanced matrices
  useEffect(() => {
    if (!bodiesRef.current || !wicksRef.current) return;

    const dummy = new THREE.Object3D();

    candleData.forEach((candle, i) => {
      // Body instance
      dummy.position.set(candle.posX, candle.bodyY, candle.posZ);
      dummy.scale.set(0.32, candle.bodyHeight, 0.32);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bodiesRef.current?.setMatrixAt(i, dummy.matrix);
      bodiesRef.current?.setColorAt(i, candle.color);

      // Wick instance
      dummy.position.set(candle.posX, candle.wickY, candle.posZ);
      dummy.scale.set(0.04, candle.wickHeight, 0.04);
      dummy.updateMatrix();
      wicksRef.current?.setMatrixAt(i, dummy.matrix);
      wicksRef.current?.setColorAt(i, candle.color);
    });

    if (bodiesRef.current.instanceColor) bodiesRef.current.instanceColor.needsUpdate = true;
    if (wicksRef.current.instanceColor) wicksRef.current.instanceColor.needsUpdate = true;
    bodiesRef.current.instanceMatrix.needsUpdate = true;
    wicksRef.current.instanceMatrix.needsUpdate = true;
  }, [candleData]);

  // Animation frame loop: subtle floating + mouse tilt + scroll fly-through
  useFrame(({ clock, pointer, camera }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Mouse Parallax & tilt
      const targetRotX = pointer.y * 0.12 - 0.15;
      const targetRotY = pointer.x * 0.18;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);

      // Gentle wave float
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15 - 1.2;
    }

    // Scroll fly-through camera effect:
    // As the user scrolls, camera pushes forward deeper into the candlestick field
    const targetCamZ = 16 - scrollProgress * 22;
    const targetCamY = 2 + scrollProgress * 3;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Candlestick Bodies InstancedMesh */}
      <instancedMesh
        ref={bodiesRef}
        args={[undefined, undefined, totalCount]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Candlestick Wicks InstancedMesh */}
      <instancedMesh
        ref={wicksRef}
        args={[undefined, undefined, totalCount]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Floor Grid reflection plane */}
      <gridHelper
        args={[60, 40, "#00E5A0", "#002015"]}
        position={[0, -5, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}
