import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export default function ReviveEffect({
  active,
  position = [0, 0, 0],
  duration = 2.4,
}) {
  const groupRef = useRef();
  const coreLightRef = useRef();
  const burstLightRef = useRef();
  const shockwaveRef = useRef();
  const innerGlowRef = useRef();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    let frameId;
    const start = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - start) / 1000;
      const p = Math.min(elapsed / duration, 1);

      setProgress(p);

      if (p < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [active, duration]);

  const embers = useMemo(() => {
    return Array.from({ length: 70 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.35 + Math.random() * 1.8;

      return {
        angle,
        radius,
        height: Math.random() * 1.8,
        speed: 0.6 + Math.random() * 1.4,
        size: 0.025 + Math.random() * 0.055,
        drift: (Math.random() - 0.5) * 0.7,
      };
    });
  }, []);

  const dust = useMemo(() => {
    return Array.from({ length: 34 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 1.3;

      return {
        angle,
        radius,
        size: 0.06 + Math.random() * 0.14,
        height: 0.05 + Math.random() * 0.25,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (!active || !groupRef.current) return;

    const burst = Math.sin(progress * Math.PI);
    const smooth = easeOutCubic(progress);
    const pulse = 0.7 + Math.sin(progress * Math.PI * 6) * 0.3;

    groupRef.current.rotation.y += delta * 0.12;

    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.5 + burst * 8;
    }

    if (burstLightRef.current) {
      burstLightRef.current.intensity = burst * 14 * pulse;
      burstLightRef.current.distance = 5 + smooth * 12;
    }

    if (shockwaveRef.current) {
      const scale = 0.6 + smooth * 5.8;
      shockwaveRef.current.scale.set(scale, scale, scale);
      shockwaveRef.current.material.opacity = Math.max(0, 0.45 * (1 - smooth));
    }

    if (innerGlowRef.current) {
      const scale = 0.7 + burst * 1.2;
      innerGlowRef.current.scale.set(scale, scale, scale);
      innerGlowRef.current.material.opacity = 0.5 * (1 - progress);
    }
  });

  if (!active) return null;

  const smooth = easeOutCubic(progress);
  const rise = easeInOutSine(progress);

  return (
    <group ref={groupRef} position={position}>
      {/* Warm fossil flash */}
      <pointLight
        ref={coreLightRef}
        color="#ffb86b"
        intensity={2}
        distance={7}
        position={[0, 1.1, 0]}
      />

      {/* Big revive burst */}
      <pointLight
        ref={burstLightRef}
        color="#ffdf9a"
        intensity={0}
        distance={10}
        position={[0, 2.2, 0]}
      />

      {/* Ground shockwave */}
      <mesh
        ref={shockwaveRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.035, 0]}
      >
        <ringGeometry args={[0.35, 0.42, 96]} />
        <meshBasicMaterial
          color="#ffb45c"
          transparent
          opacity={0.42}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Soft center glow */}
      <mesh ref={innerGlowRef} position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial
          color="#ffcf7a"
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>

      {/* Dust near ground */}
      {dust.map((p, idx) => {
        const x = Math.cos(p.angle) * p.radius * (0.5 + smooth * 0.9);
        const z = Math.sin(p.angle) * p.radius * (0.5 + smooth * 0.9);
        const y = p.height + smooth * 0.45;

        return (
          <mesh
            key={`dust-${idx}`}
            position={[x, y, z]}
            scale={p.size * (1.2 - progress * 0.45)}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color="#b58a5a"
              transparent
              opacity={0.28 * (1 - progress)}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Amber sparks rising */}
      {embers.map((p, idx) => {
        const spiral = p.angle + progress * p.speed * 2.2;
        const radius = p.radius * (0.4 + smooth * 0.8);

        const x = Math.cos(spiral) * radius + p.drift * progress;
        const z = Math.sin(spiral) * radius;
        const y = p.height + rise * 3.2;

        return (
          <mesh
            key={`ember-${idx}`}
            position={[x, y, z]}
            scale={p.size * (1 - progress * 0.25)}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={idx % 3 === 0 ? "#fff2b0" : "#ff9f43"}
              transparent
              opacity={Math.max(0, 0.95 * (1 - progress))}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}