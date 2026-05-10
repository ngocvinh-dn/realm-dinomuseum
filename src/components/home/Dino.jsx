import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, useGLTF } from '@react-three/drei';

export default function Dino() {
  const dinoRef = useRef();
  const { scene } = useGLTF('/models/Trex.glb');

  // Hiệu ứng xoay tròn từ từ
  useFrame((state, delta) => {
    if (dinoRef.current) {
      dinoRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <primitive 
        object={scene} 
        ref={dinoRef} 
        scale={0.5} 
        position={[0, -1, 0]} 
      />
      
      {/* Ánh sáng */}
      <Environment preset="city" />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
    </Float>
  );
}

useGLTF.preload('/models/Trex.glb');