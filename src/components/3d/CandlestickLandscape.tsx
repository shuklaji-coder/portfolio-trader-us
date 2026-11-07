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
  const dustRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const splineRef = useRef<THREE.Line>(null);
  const { viewport } = useThree();

  // Dense, expansive 3D candlestick field covering the entire horizon
  const isMobile = viewport.width < 5;
  const countX = isMobile ? 32 : 56;
  const countZ = isMobile ? 12 : 22;
  const totalCount = countX * countZ;

  // Generate procedural candlestick data with trending waves
  const { candleData, splinePoints } = useMemo(() => {
    const data = [];
    const points: THREE.Vector3[] = [];
    const profitColor = new THREE.Color("#00E5A0");
    const lossColor = new THREE.Color("#FF4D5E");
    const goldColor = new THREE.Color("#F5D061");

    for (let z = 0; z < countZ; z++) {
      let currentPrice = Math.sin(z * 0.4) * 2.5;
      for (let x = 0; x < countX; x++) {
        // Procedural trending price action
        const wave = Math.sin(x * 0.18 + z * 0.25) * 1.2;
        const delta = (Math.random() - 0.47) * 0.9 + wave * 0.2;
        const open = currentPrice;
        const close = open + delta;
        currentPrice = close;

        const high = Math.max(open, close) + Math.random() * 0.7 + 0.15;
        const low = Math.min(open, close) - Math.random() * 0.7 - 0.15;

        const isUp = close >= open;
        const bodyHeight = Math.max(0.18, Math.abs(close - open));
        const bodyY = (open + close) / 2;
        const wickHeight = Math.max(0.4, high - low);
        const wickY = (high + low) / 2;

        const posX = (x - countX / 2) * 0.75;
        const posZ = (z - countZ / 2) * 1.9;

        // Occasional Monaco Gold breakout candles with high glow
        let color = isUp ? profitColor : lossColor;
        const isGold = (x + z * 3) % 11 === 0 && isUp;
        if (isGold) {
          color = goldColor;
        }

        data.push({
          posX,
          posZ,
          bodyY,
          bodyHeight,
          wickY,
          wickHeight,
          color,
          isGold,
        });

        // Collect spline points along center corridor for laser ribbon
        if (z === Math.floor(countZ / 2) && x % 2 === 0) {
          points.push(new THREE.Vector3(posX, high + 0.3, posZ));
        }
      }
    }
    return { candleData: data, splinePoints: points };
  }, [countX, countZ]);

  // Ambient floating glowing Monaco Gold dust motes
  const dustPositions = useMemo(() => {
    const coords = [];
    for (let i = 0; i < 350; i++) {
      coords.push(
        (Math.random() - 0.5) * 44,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 44
      );
    }
    return new Float32Array(coords);
  }, []);

  // Create smooth CatmullRom spline for glowing trendline ribbon
  const splineGeometry = useMemo(() => {
    if (splinePoints.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(splinePoints);
    const pts = curve.getPoints(120);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [splinePoints]);

  const splineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xf5d061,
      linewidth: 2,
      transparent: true,
      opacity: 0.75,
    });
  }, []);

  const splineLine = useMemo(() => {
    if (!splineGeometry) return null;
    return new THREE.Line(splineGeometry, splineMaterial);
  }, [splineGeometry, splineMaterial]);

  // Set initial instanced matrices & colors
  useEffect(() => {
    if (!bodiesRef.current || !wicksRef.current) return;

    const dummy = new THREE.Object3D();

    candleData.forEach((candle, i) => {
      // Body instance
      dummy.position.set(candle.posX, candle.bodyY, candle.posZ);
      dummy.scale.set(0.38, candle.bodyHeight, 0.38);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bodiesRef.current?.setMatrixAt(i, dummy.matrix);
      bodiesRef.current?.setColorAt(i, candle.color);

      // Wick instance
      dummy.position.set(candle.posX, candle.wickY, candle.posZ);
      dummy.scale.set(0.045, candle.wickHeight, 0.045);
      dummy.updateMatrix();
      wicksRef.current?.setMatrixAt(i, dummy.matrix);
      wicksRef.current?.setColorAt(i, candle.color);
    });

    if (bodiesRef.current.instanceColor) bodiesRef.current.instanceColor.needsUpdate = true;
    if (wicksRef.current.instanceColor) wicksRef.current.instanceColor.needsUpdate = true;
    bodiesRef.current.instanceMatrix.needsUpdate = true;
    wicksRef.current.instanceMatrix.needsUpdate = true;
  }, [candleData]);

  // Animation frame loop: subtle floating + dynamic mouse parallax + scroll fly-through
  useFrame(({ clock, pointer, camera }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Smooth responsive mouse parallax
      const targetRotX = pointer.y * 0.14 - 0.18;
      const targetRotY = pointer.x * 0.22;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);

      // Gentle floating sea wave
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.22 - 1.0;
    }

    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.04;
      dustRef.current.rotation.x = Math.sin(t * 0.02) * 0.08;
    }

    // Scroll fly-through camera effect:
    const targetCamZ = 17 - scrollProgress * 24;
    const targetCamY = 2.2 + scrollProgress * 3.5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, -1.0, 0]}>
      {/* Candlestick Bodies InstancedMesh with High Emissive Bloom */}
      <instancedMesh
        ref={bodiesRef}
        args={[undefined, undefined, totalCount]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.15}
          metalness={0.85}
          emissiveIntensity={0.8}
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

      {/* Glowing Golden Laser Trendline Ribbon */}
      {splineLine && <primitive object={splineLine} />}

      {/* High-Tech Perspective Floor Grid */}
      <gridHelper
        args={[70, 50, "#D4AF37", "#171203"]}
        position={[0, -6, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Floating Glowing Monaco Gold Dust Field */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustPositions.length / 3}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color="#F5D061"
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
