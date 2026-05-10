import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function InteractableModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  data = null,
  eraColor = "#f59e0b",
  onEnter,
  onLeave,
  onInteract,
}) {
  const groupRef = useRef(null);
  const materialsRef = useRef([]);
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const [hitBox, setHitBox] = useState({
    center: [0, 0, 0],
    size: [1, 1, 1],
  });

  useEffect(() => {
    if (!clonedScene) return;

    const materials = [];

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      child.raycast = () => null;
      child.castShadow = true;
      child.receiveShadow = true;

      if (!child.material) return;

      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone();

      const childMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      childMaterials.forEach((material) => {
        material.userData.originalColor = material.color
          ? material.color.clone()
          : new THREE.Color("#ffffff");

        material.userData.originalMap = material.map || null;
        material.userData.originalEmissive = material.emissive
          ? material.emissive.clone()
          : null;

        material.userData.originalWireframe = material.wireframe || false;

        materials.push(material);
      });
    });

    materialsRef.current = materials;

    const box = new THREE.Box3().setFromObject(clonedScene);

    if (!box.isEmpty()) {
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      setHitBox({
        center: [center.x, center.y, center.z],
        size: [
          Math.max(size.x * 1.15, 0.8),
          Math.max(size.y * 1.15, 0.8),
          Math.max(size.z * 1.15, 0.8),
        ],
      });
    }
  }, [clonedScene]);

  const setHighlight = (active) => {
    materialsRef.current.forEach((material) => {
      if (active) {
        if (material.color) {
          material.color.set(eraColor);
        }

        if (material.emissive) {
          material.emissive.set(eraColor);
          material.emissiveIntensity = 0.25;
        }

        material.wireframe = true;
        material.needsUpdate = true;
        return;
      }

      if (material.color && material.userData.originalColor) {
        material.color.copy(material.userData.originalColor);
      }

      if (material.emissive && material.userData.originalEmissive) {
        material.emissive.copy(material.userData.originalEmissive);
        material.emissiveIntensity = 0;
      }

      material.map = material.userData.originalMap;
      material.wireframe = material.userData.originalWireframe;
      material.needsUpdate = true;
    });
  };

  const handlePointerEnter = (event) => {
    event.stopPropagation();
    setHighlight(true);
    document.body.style.cursor = "pointer";

    if (onEnter) {
      onEnter(data);
    }
  };

  const handlePointerLeave = (event) => {
    event.stopPropagation();
    setHighlight(false);
    document.body.style.cursor = "auto";

    if (onLeave) {
      onLeave(data);
    }
  };

  const handleClick = (event) => {
    event.stopPropagation();

    if (onInteract) {
      onInteract(data);
    }
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh
        position={hitBox.center}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <boxGeometry args={hitBox.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <primitive object={clonedScene} />
    </group>
  );
}