/**
 * MAMU OIL — PETROLEUM NOIR DESIGN CONTRACT
 * This component expresses material honesty through a slow, interactive black-metal barrel,
 * amber oil energy traces, and a gravity-led droplet. It must remain spacious and cinematic.
 */
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function BarrelModel({ onExplore }: { onExplore: () => void }) {
  const group = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.1 + pointer.x * 0.18;
    group.current.rotation.x = Math.sin(t * 0.32) * 0.035 + pointer.y * 0.08;
    group.current.position.y = Math.sin(t * 0.7) * 0.08;
  });

  return (
    <group ref={group} scale={1.2}>
      <mesh rotation={[Math.PI / 2, 0, 0]} onClick={onExplore} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 3.35, 72, 1, false]} />
        <meshPhysicalMaterial
          color="#101113"
          metalness={0.95}
          roughness={0.18}
          clearcoat={0.8}
          clearcoatRoughness={0.12}
        />
      </mesh>
      {[-1.34, -0.42, 0.42, 1.34].map((offset) => (
        <mesh key={offset} position={[0, 0, offset]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.17, 0.07, 20, 80]} />
          <meshPhysicalMaterial color="#2f3235" metalness={0.92} roughness={0.21} />
        </mesh>
      ))}
      <mesh position={[0, 0, 1.69]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.05, 72]} />
        <meshPhysicalMaterial color="#161719" metalness={0.92} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0, -1.69]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.05, 72]} />
        <meshPhysicalMaterial color="#161719" metalness={0.92} roughness={0.24} />
      </mesh>
      <mesh position={[-0.26, 1.08, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
        <meshPhysicalMaterial color="#d9852e" metalness={0.72} roughness={0.2} />
      </mesh>
    </group>
  );
}

function OilDrop() {
  const drop = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!drop.current) return;
    const phase = (clock.getElapsedTime() % 3.9) / 3.9;
    const y = 2.35 - phase * 4.9;
    const stretch = phase > 0.68 && phase < 0.88 ? 1.38 : 1;
    drop.current.position.set(0.2, y, 0.8);
    drop.current.scale.set(0.72 / stretch, 1.1 * stretch, 0.72 / stretch);
  });

  return (
    <>
      <mesh ref={drop}>
        <sphereGeometry args={[0.22, 40, 40]} />
        <meshPhysicalMaterial color="#070708" metalness={0.25} roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position={[0.2, -2.52, 0.8]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4, 0.55, 1]}>
        <circleGeometry args={[0.38, 48]} />
        <meshPhysicalMaterial color="#050506" metalness={0.2} roughness={0.05} clearcoat={1} transparent opacity={0.95} />
      </mesh>
    </>
  );
}

function Scene({ onExplore }: { onExplore: () => void }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight color="#f2c184" intensity={3.2} position={[4, 5, 6]} />
      <directionalLight color="#586275" intensity={2.1} position={[-5, 1, 2]} />
      <pointLight color="#d9852e" intensity={22} distance={9} position={[-2.5, -0.2, 2.5]} />
      <BarrelModel onExplore={onExplore} />
      <OilDrop />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2.55}
        maxPolarAngle={Math.PI / 1.7}
      />
    </>
  );
}

export default function BarrelScene({ onExplore }: { onExplore: () => void }) {
  return (
    <Canvas
      className="barrel-canvas"
      camera={{ position: [0, 0.35, 8.2], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene onExplore={onExplore} />
    </Canvas>
  );
}
