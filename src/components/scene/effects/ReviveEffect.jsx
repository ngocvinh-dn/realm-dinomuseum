import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function cloneSceneWithMaterial(scene, options = {}) {
  const {
    opacity = 1,
    forceOpaque = false,
    color = null,
    emissive = null,
    emissiveIntensity = 0,
    wireframe = false,
  } = options;

  const clone = cloneSkeleton(scene);

  clone.traverse((child) => {
    if (!child.isMesh && !child.isSkinnedMesh) return;

    const materials = Array.isArray(child.material)
      ? child.material.map((material) => material.clone())
      : child.material.clone();

    child.material = materials;

    const applyToMaterial = (material) => {
      material.transparent = !forceOpaque && opacity < 1;
      material.opacity = forceOpaque ? 1 : opacity;
      material.depthWrite = forceOpaque || opacity >= 1;
      material.depthTest = true;
      material.wireframe = wireframe;

      if (color && material.color) {
        material.color = new THREE.Color(color);
      }

      if (emissive && material.emissive) {
        material.emissive = new THREE.Color(emissive);
        material.emissiveIntensity = emissiveIntensity;
      }
    };

    if (Array.isArray(child.material)) {
      child.material.forEach(applyToMaterial);
    } else {
      applyToMaterial(child.material);
    }
  });

  return clone;
}

function createDustPositions(count = 120) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const radius = 0.25 + Math.random() * 1.9;
    const angle = Math.random() * Math.PI * 2;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 0.35;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return positions;
}

function createEnergyPositions(count = 90) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const radius = 0.4 + Math.random() * 1.5;
    const angle = Math.random() * Math.PI * 2;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 2.2;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return positions;
}

export default function ReviveEffect({
  fossilModelUrl,
  revivedModelUrl,
  fossilPosition = [0, 0, 0],
  fossilRotation = [0, 0, 0],
  fossilScale = 1,
  reviveOffset = [0, 0, 0],
  revivedScale = 1,
  revivedRotation = [0, 0, 0],
  isRevived = false,
  duration = 2.8,
  onClickFossil,
}) {
  const ringRef = useRef();
  const dustRef = useRef();
  const energyRef = useRef();
  const scanLightRef = useRef();
  const burstLightRef = useRef();
  const impactRingRef = useRef();

  const [progress, setProgress] = useState(0);

  const fossilGltf = useGLTF(fossilModelUrl);
  const revivedGltf = useGLTF(revivedModelUrl);

  const dustPositions = useMemo(() => createDustPositions(130), []);
  const energyPositions = useMemo(() => createEnergyPositions(100), []);

  const easedProgress = easeOutCubic(progress);
  const pulse = Math.sin(progress * Math.PI);

  const fossilOpacity = clamp01(1 - progress * 1.35);
  const fossilSinkY = -easedProgress * 1.15;

  const revivedOpacity = clamp01((progress - 0.28) / 0.55);
  const revivedRiseY = -1.8 + easedProgress * 1.8 + Math.sin(progress * Math.PI) * 0.15;

  const hologramOpacity =
    progress < 0.88 ? clamp01(progress * 1.6) * clamp01(1 - progress * 0.35) : 0;

  const burstWindow = clamp01(1 - Math.abs(progress - 0.93) / 0.08);
  const baseScale = revivedScale * (0.2 + progress * 0.8); // từ rất nhỏ → full
  const burst = 1 + Math.sin(progress * Math.PI) * 0.35;   // phình mạnh
  const revivePopScale = baseScale * burst;

  const revivedPosition = useMemo(() => {
    return [
      fossilPosition[0] + reviveOffset[0],
      fossilPosition[1] + reviveOffset[1],
      fossilPosition[2] + reviveOffset[2],
    ];
  }, [fossilPosition, reviveOffset]);

  const fossilScene = useMemo(() => {
    return cloneSceneWithMaterial(fossilGltf.scene, {
      opacity: fossilOpacity,
      emissive: "#f59e0b",
      emissiveIntensity: fossilOpacity > 0 ? progress * 1.6 : 0,
    });
  }, [fossilGltf.scene, fossilOpacity, progress]);

  const hologramScene = useMemo(() => {
    return cloneSceneWithMaterial(revivedGltf.scene, {
      opacity: hologramOpacity * 0.48,
      color: "#67e8f9",
      emissive: "#22d3ee",
      emissiveIntensity: 2.3,
      wireframe: true,
    });
  }, [revivedGltf.scene, hologramOpacity]);

  const revivedScene = useMemo(() => {
    return cloneSceneWithMaterial(revivedGltf.scene, {
      opacity: revivedOpacity,
      forceOpaque: progress >= 0.98,
      emissive: "#facc15",
      emissiveIntensity: progress < 0.96 ? pulse * 0.45 : 0,
    });
  }, [revivedGltf.scene, revivedOpacity, progress, pulse]);

  useEffect(() => {
    let animationFrame;
    const start = performance.now();
    const startProgress = progress;
    const targetProgress = isRevived ? 1 : 0;

    const animate = (time) => {
      const elapsed = (time - start) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      const nextProgress =
        startProgress + (targetProgress - startProgress) * eased;

      setProgress(nextProgress);

      if (t < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isRevived, duration]);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 3;
      ringRef.current.scale.setScalar(1 + progress * 2.4);
      ringRef.current.material.opacity =
        progress > 0.02 && progress < 0.9 ? 0.65 * pulse : 0;
    }

    if (impactRingRef.current) {
      impactRingRef.current.rotation.z -= delta * 1.8;
      impactRingRef.current.scale.setScalar(0.6 + progress * 3.6);
      impactRingRef.current.material.opacity = burstWindow * 0.75;
    }

    if (impactRingRef.current) {
      impactRingRef.current.rotation.z -= delta * 1.8;

      impactRingRef.current.scale.setScalar(
        0.6 + progress * 4 + Math.sin(progress * Math.PI) * 1.5
      );
    
      impactRingRef.current.material.opacity = 
        Math.max(0, 1 - Math.abs(progress - 0.9) * 6);
    }   

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.42;
      dustRef.current.position.y = fossilPosition[1] + progress * 0.85;

      const dustOpacity =
        progress < 0.55
          ? clamp01(progress / 0.3) * 0.48
          : clamp01(1 - (progress - 0.55) / 0.35) * 0.48;

      dustRef.current.material.opacity = dustOpacity;
    }

    if (energyRef.current) {
      energyRef.current.rotation.y -= delta * 0.7;
      energyRef.current.position.y = revivedPosition[1] + progress * 0.55;
      energyRef.current.material.opacity =
        progress > 0.18 && progress < 0.95 ? 0.42 * pulse : 0;
    }

    if (scanLightRef.current) {
      scanLightRef.current.intensity =
        progress > 0.04 && progress < 0.85 ? 6 * pulse : 0;
    }

    if (burstLightRef.current) {
      burstLightRef.current.intensity = burstWindow * 26;
    }
  });

  return (
    <group>
      {fossilOpacity > 0.01 && (
        <group
          position={[
            fossilPosition[0],
            fossilPosition[1] + fossilSinkY,
            fossilPosition[2],
          ]}
          rotation={fossilRotation}
          scale={fossilScale}
          onClick={(event) => {
            event.stopPropagation();
            onClickFossil?.();
          }}
        >
          <primitive object={fossilScene} />

          <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.85, 0.95, 96]} />
            <meshBasicMaterial
              color="#f59e0b"
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

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
              color="#c9a46a"
              size={0.055}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </points>

          <pointLight
            ref={scanLightRef}
            color="#f59e0b"
            intensity={0}
            distance={8}
          />
        </group>
      )}

      {progress > 0.08 && progress < 0.94 && (
        <group
          position={[
            revivedPosition[0],
            revivedPosition[1] + revivedRiseY,
            revivedPosition[2],
          ]}
          scale={revivedScale * (0.2 + progress * 0.5)}
          rotation={revivedRotation}
        >
          <primitive object={hologramScene} />
        </group>
      )}

      {progress > 0.28 && (
        <group
          position={[
            revivedPosition[0],
            revivedPosition[1] + revivedRiseY,
            revivedPosition[2],
          ]}
          scale={revivePopScale}
          rotation={revivedRotation}
          onClick={(event) => {
            event.stopPropagation();
            onClickFossil?.();
          }}
        >
          <primitive object={revivedScene} />
        </group>
      )}

      <points
        ref={energyRef}
        position={[
          revivedPosition[0],
          revivedPosition[1],
          revivedPosition[2],
        ]}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={energyPositions.length / 3}
            array={energyPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#67e8f9"
          size={0.04}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>

      <mesh
        ref={impactRingRef}
        position={[
          revivedPosition[0],
          revivedPosition[1] + 0.03,
          revivedPosition[2],
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.9, 1.04, 128]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={burstLightRef}
        position={[
          revivedPosition[0],
          revivedPosition[1] + 1.2,
          revivedPosition[2],
        ]}
        color="#facc15"
        intensity={0}
        distance={12}
      />
    </group>
  );
}