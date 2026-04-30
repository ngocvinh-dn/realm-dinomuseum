import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

function DinoFallback() {
  return (
    <group position={[0, -0.8, 0]}>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color="#7c4a1b" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0.95, 0.1, 0.05]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#8c5a22" roughness={0.65} metalness={0.03} />
      </mesh>
      <mesh position={[-0.65, -0.95, 0.25]} rotation={[0.1, 0, 0.15]}>
        <capsuleGeometry args={[0.16, 0.65, 4, 8]} />
        <meshStandardMaterial color="#6a3d16" roughness={0.75} />
      </mesh>
      <mesh position={[0.15, -0.95, 0.25]} rotation={[0.1, 0, -0.12]}>
        <capsuleGeometry args={[0.16, 0.65, 4, 8]} />
        <meshStandardMaterial color="#6a3d16" roughness={0.75} />
      </mesh>
      <mesh position={[-0.05, 0.35, -0.6]} rotation={[0.2, 0, 0.25]}>
        <coneGeometry args={[0.16, 1.05, 8]} />
        <meshStandardMaterial color="#9b6a2f" roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function Dino() {
  const dinoRef = useRef();

  useFrame((state, delta) => {
    if (dinoRef.current) {
      dinoRef.current.rotation.y += delta * 0.2;
      dinoRef.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <group ref={dinoRef} scale={0.9}>
        <DinoFallback />
      </group>
      <Environment preset="city" />
      <ambientLight intensity={1.1} />
      <directionalLight position={[10, 10, 5]} intensity={2.2} />
      <pointLight position={[-5, 3, 2]} intensity={1.2} color="#f59e0b" />
    </Float>
  );
}