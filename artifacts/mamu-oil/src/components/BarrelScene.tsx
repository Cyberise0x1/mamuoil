/**
 * MAMU OIL — GOLD & PLATINUM LUXURY MOTION CONTRACT
 * A polished platinum barrel, viscous black oil droplet, impact pool, ripple rings, and splash
 * particles form one concise material-performance accent for the executive hero.
 */
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import BarrelFallback from "./BarrelFallback";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

function BarrelModel({ onExplore }: { onExplore: () => void }) {
  const group = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = -0.26 + pointer.x * 0.26 + Math.sin(t * 0.22) * 0.025;
    group.current.rotation.x = 0.08 + pointer.y * 0.1;
    group.current.position.y = 0.15 + Math.sin(t * 0.62) * 0.05;
  });

  return (
    <group ref={group} scale={1.03} rotation={[0, 0, -0.07]}>
      <mesh rotation={[0, 0, Math.PI / 2]} onClick={onExplore} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 3.35, 96, 1, false]} />
        <meshPhysicalMaterial color="#eff0ec" metalness={0.78} roughness={0.32} clearcoat={0.86} clearcoatRoughness={0.16} reflectivity={0.82} />
      </mesh>
      {[-1.34, -0.42, 0.42, 1.34].map((offset) => (
        <mesh key={offset} position={[offset, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[1.17, 0.07, 24, 96]} />
          <meshPhysicalMaterial color="#d5b06e" metalness={1} roughness={0.14} clearcoat={0.95} />
        </mesh>
      ))}
      {[-1.69, 1.69].map((offset) => (
        <mesh key={offset} position={[offset, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.965, 96]} />
          <meshPhysicalMaterial color="#d8dcda" metalness={0.82} roughness={0.3} clearcoat={0.82} />
        </mesh>
      ))}
      <mesh position={[-0.34, 1.08, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 48]} />
        <meshPhysicalMaterial color="#d6a957" metalness={1} roughness={0.16} clearcoat={0.95} />
      </mesh>
      <mesh position={[-0.34, 1.15, 0]}>
        <torusGeometry args={[0.14, 0.024, 16, 48]} />
        <meshPhysicalMaterial color="#f4dfab" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}

function OilImpact() {
  const drop = useRef<Mesh>(null);
  const pool = useRef<Mesh>(null);
  const rippleOne = useRef<Mesh>(null);
  const rippleTwo = useRef<Mesh>(null);
  const splashes = useRef<(Mesh | null)[]>([]);
  const splashSeeds = useMemo(() => Array.from({ length: 13 }, (_, index) => {
    const angle = (index / 13) * Math.PI * 2;
    return { angle, speed: 0.58 + (index % 4) * 0.13, lift: 0.55 + (index % 3) * 0.22, size: 0.045 + (index % 4) * 0.014 };
  }), []);

  useFrame(({ clock }) => {
    const phase = (clock.getElapsedTime() % 3.25) / 3.25;
    const fall = smoothstep(0.08, 0.71, phase);
    const impact = smoothstep(0.68, 0.76, phase);
    const splash = clamp((phase - 0.71) / 0.29);
    const fade = 1 - smoothstep(0.89, 1, phase);

    if (drop.current) {
      const y = 2.55 - fall * 4.75;
      const stretch = 1 + smoothstep(0.4, 0.68, phase) * 0.74;
      drop.current.position.set(-0.25, y, 0.92);
      drop.current.scale.set(0.72 / stretch, 1.18 * stretch, 0.72 / stretch);
      drop.current.visible = phase < 0.745;
    }
    if (pool.current) {
      const spread = 1 + impact * 0.42 + (1 - fade) * 0.13;
      pool.current.scale.set(spread, spread * 0.68, 1);
    }
    if (rippleOne.current) {
      const scale = 0.35 + impact * 2.1 + splash * 0.45;
      rippleOne.current.scale.set(scale, scale, 1);
      rippleOne.current.visible = phase > 0.66 && phase < 0.98;
    }
    if (rippleTwo.current) {
      const laterImpact = smoothstep(0.75, 0.84, phase);
      const scale = 0.25 + laterImpact * 2.35;
      rippleTwo.current.scale.set(scale, scale, 1);
      rippleTwo.current.visible = phase > 0.74 && phase < 0.99;
    }
    splashes.current.forEach((particle, index) => {
      if (!particle) return;
      const seed = splashSeeds[index];
      const travel = splash * seed.speed;
      const x = -0.25 + Math.cos(seed.angle) * travel * 1.3;
      const z = 0.92 + Math.sin(seed.angle) * travel * 0.7;
      const y = -2.16 + splash * seed.lift - splash * splash * seed.lift * 0.74;
      const size = seed.size * (0.55 + fade * 0.72);
      particle.position.set(x, y, z);
      particle.scale.set(size, size * (1.05 + splash * 0.9), size);
      particle.visible = phase > 0.705 && phase < 0.99;
    });
  });

  return (
    <group>
      <mesh ref={drop} castShadow>
        <sphereGeometry args={[0.22, 48, 48]} />
        <meshPhysicalMaterial color="#07090a" metalness={0.5} roughness={0.05} clearcoat={1} clearcoatRoughness={0.04} />
      </mesh>
      <mesh ref={pool} position={[-0.25, -2.17, 0.92]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 72]} />
        <meshPhysicalMaterial color="#080a0b" metalness={0.38} roughness={0.06} clearcoat={1} transparent opacity={0.97} />
      </mesh>
      <mesh ref={rippleOne} position={[-0.25, -2.155, 0.92]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.018, 14, 72]} />
        <meshPhysicalMaterial color="#d7ae62" metalness={0.72} roughness={0.14} transparent opacity={0.74} />
      </mesh>
      <mesh ref={rippleTwo} position={[-0.25, -2.15, 0.92]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.012, 14, 72]} />
        <meshPhysicalMaterial color="#fff0cc" metalness={0.65} roughness={0.12} transparent opacity={0.48} />
      </mesh>
      {splashSeeds.map((seed, index) => (
        <mesh key={seed.angle} ref={(node) => { splashes.current[index] = node; }} castShadow>
          <sphereGeometry args={[1, 20, 20]} />
          <meshPhysicalMaterial color="#080a0b" metalness={0.45} roughness={0.06} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ onExplore }: { onExplore: () => void }) {
  return (
    <>
      <ambientLight intensity={1.35} color="#f8ebd1" />
      <hemisphereLight args={["#fff7df", "#6d5e4a", 1.35]} />
      <directionalLight castShadow color="#fff1cd" intensity={4.8} position={[4, 6, 6]} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight color="#b6bdc0" intensity={2.25} position={[-6, 2, 3]} />
      <pointLight color="#d6a957" intensity={18} distance={8} position={[-2.7, 1.3, 3.4]} />
      <pointLight color="#ffffff" intensity={10} distance={6} position={[2.8, -1, 4]} />
      <BarrelModel onExplore={onExplore} />
      <OilImpact />
      <OrbitControls enablePan={false} enableZoom={false} enableDamping dampingFactor={0.08} minPolarAngle={Math.PI / 2.55} maxPolarAngle={Math.PI / 1.7} />
    </>
  );
}

export default function BarrelScene({ onExplore, isActive }: { onExplore: () => void; isActive: boolean }) {
  const supportsWebGl = useMemo(() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
      );
    } catch {
      return false;
    }
  }, []);

  if (!supportsWebGl) {
    return <BarrelFallback />;
  }

  return (
    <Canvas className="barrel-canvas" camera={{ position: [0.45, 0.25, 8.6], fov: 34 }} dpr={[1, 1.5]} frameloop={isActive ? "always" : "never"} shadows gl={{ alpha: true, antialias: true }}>
      <Scene onExplore={onExplore} />
    </Canvas>
  );
}
