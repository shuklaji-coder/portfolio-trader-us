"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { siteConfig, CityPin } from "@/config/site";
import { Html } from "@react-three/drei";

interface InteractiveGlobeProps {
  activeCityId?: string;
  onSelectCity?: (city: CityPin) => void;
  radius?: number;
}

// Convert latitude and longitude to 3D sphere coordinate
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export function InteractiveGlobe({
  activeCityId = "bali",
  onSelectCity,
  radius = 3.2,
}: InteractiveGlobeProps) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Generate dotted points for globe surface
  const dotsPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 1400;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < count; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(theta) * Math.sin(phi);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [radius]);

  // Points buffer geometry
  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(dotsPoints);
    return geo;
  }, [dotsPoints]);

  // City Pin positions
  const cityPositions = useMemo(() => {
    return siteConfig.cities.map((city) => ({
      ...city,
      pos: latLngToVector3(city.lat, city.lng, radius * 1.01),
    }));
  }, [radius]);

  // Flight Arcs between cities
  const arcs = useMemo(() => {
    const pairs = [
      ["new-york", "london"],
      ["london", "dubai"],
      ["dubai", "singapore"],
      ["singapore", "tokyo"],
      ["tokyo", "bali"],
      ["new-york", "miami"],
      ["miami", "lisbon"],
      ["lisbon", "london"],
    ];

    return pairs.map(([fromId, toId]) => {
      const fromCity = cityPositions.find((c) => c.id === fromId);
      const toCity = cityPositions.find((c) => c.id === toId);

      if (!fromCity || !toCity) return null;

      const v1 = fromCity.pos;
      const v2 = toCity.pos;

      // Arc midpoint elevated above globe surface
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLength = mid.length();
      mid.normalize().multiplyScalar(radius * 1.35);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(32);
      return new THREE.BufferGeometry().setFromPoints(points);
    }).filter(Boolean) as THREE.BufferGeometry[];
  }, [cityPositions, radius]);

  // Three.js Line primitives for great circle arcs in Champagne Gold
  const lineObjects = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45,
    });
    return arcs.map((arcGeo) => new THREE.Line(arcGeo, mat));
  }, [arcs]);

  // Target rotation based on active city
  const activeCity = cityPositions.find((c) => c.id === activeCityId) || cityPositions[0];

  useFrame(({ clock }) => {
    if (!globeGroupRef.current) return;
    const t = clock.getElapsedTime();

    if (activeCity) {
      // Calculate target rotation to bring active city towards the front (z > 0)
      const targetPhi = (activeCity.lat * Math.PI) / 180 * 0.4;
      const targetTheta = -(activeCity.lng * Math.PI) / 180 - Math.PI / 2;

      globeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        globeGroupRef.current.rotation.x,
        targetPhi,
        0.04
      );
      globeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        globeGroupRef.current.rotation.y,
        targetTheta,
        0.04
      );
    } else {
      // Idle rotation
      globeGroupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={globeGroupRef}>
      {/* Inner Dark Sphere to mask backside dots */}
      <mesh>
        <sphereGeometry args={[radius * 0.98, 36, 36]} />
        <meshBasicMaterial color="#070B12" />
      </mesh>

      {/* Dotted Atmosphere / Landmasses in Monaco Gold */}
      <points geometry={pointsGeo}>
        <pointsMaterial
          size={0.07}
          color="#D4AF37"
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>

      {/* Wireframe Longitude / Latitude Rings */}
      <mesh>
        <sphereGeometry args={[radius, 18, 12]} />
        <meshBasicMaterial
          wireframe
          color="#D4AF37"
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Flight Paths / Great Circle Arcs */}
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}

      {/* City Pins & Labels */}
      {cityPositions.map((city) => {
        const isActive = city.id === activeCityId;
        const isHovered = city.id === hoveredCity;

        return (
          <group key={city.id} position={city.pos}>
            {/* Glowing Pin Bead */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectCity?.(city);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredCity(city.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredCity(null);
              }}
            >
              <sphereGeometry args={[isActive ? 0.12 : 0.08, 16, 16]} />
              <meshBasicMaterial
                color={isActive ? "#F5D061" : isHovered ? "#FFFFFF" : "#D4AF37"}
              />
            </mesh>

            {/* Pulsing Beacon Ring for Active City */}
            {isActive && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.16, 0.22, 24]} />
                <meshBasicMaterial
                  color="#D4AF37"
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {/* Floating City Label */}
            <Html
              position={[0, 0.25, 0]}
              center
              distanceFactor={9}
              style={{
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              <div
                className={`rounded-md px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-gold to-gold-light text-[#040609] shadow-[0_0_15px_#D4AF37] scale-110 font-bold"
                    : "bg-surface/90 text-slate-300 border border-white/10"
                }`}
              >
                {city.name.split(" ")[0]}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Atmospheric Rim Glow Halo */}
      <mesh scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
