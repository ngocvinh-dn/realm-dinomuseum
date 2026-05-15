import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

export default function InteractableModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  data = null,
  eraColor = "#f59e0b",
  normalize = false,
  normalizedSize = 1.4,
  onEnter,
  onLeave,
  onInteract,
}) {
  const materialsRef = useRef([]);
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => cloneSkeleton(scene), [scene]);

  const [modelTransform, setModelTransform] = useState({
    position: [0, 0, 0],
    scale: 1,
  });

  const [hitBox, setHitBox] = useState({
    center: [0, 0.8, 0],
    size: [1.4, 1.6, 1.4],
  });

  useEffect(() => {
    if (!clonedScene) return;

    const materials = [];

    clonedScene.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return;

      // Interaction is handled by the invisible hitbox, not by tiny mesh pieces.
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

        material.userData.originalEmissiveIntensity =
          typeof material.emissiveIntensity === "number"
            ? material.emissiveIntensity
            : 0;

        material.userData.originalWireframe = Boolean(material.wireframe);

        materials.push(material);
      });
    });

    materialsRef.current = materials;

    const rawBox = new THREE.Box3().setFromObject(clonedScene);
    if (rawBox.isEmpty()) return;

    const rawSize = rawBox.getSize(new THREE.Vector3());
    const rawCenter = rawBox.getCenter(new THREE.Vector3());
    const safeScale = Math.max(Number(scale) || 1, 0.001);

    if (!normalize) {
      // IMPORTANT: Main museum portal fossils already have their own authored
      // transform/offset inside the GLB. Do not center or normalize them here,
      // otherwise their heads become huge and their original placement drifts.
      setModelTransform({
        position: [0, 0, 0],
        scale: 1,
      });

      setHitBox({
        center: [rawCenter.x, rawCenter.y, rawCenter.z],
        size: [
          Math.max(rawSize.x * 1.18, 1.1),
          Math.max(rawSize.y * 1.18, 1.1),
          Math.max(rawSize.z * 1.18, 1.1),
        ],
      });

      return;
    }

    // Era exhibit mode: normalize each model independently, place its bottom at
    // y=0, and center it around its own local X/Z axis. This keeps exhibits tidy
    // without changing unrelated models.
    const maxAxis = Math.max(rawSize.x, rawSize.y, rawSize.z, 0.001);
    const safeNormalizedSize = Math.max(Number(normalizedSize) || 1.4, 0.1);
    const finalScale = (safeNormalizedSize / maxAxis) * safeScale;

    const finalSize = rawSize.clone().multiplyScalar(finalScale);

    setModelTransform({
      position: [
        -rawCenter.x * finalScale,
        -rawBox.min.y * finalScale,
        -rawCenter.z * finalScale,
      ],
      scale: finalScale,
    });

    setHitBox({
      center: [0, Math.max(finalSize.y / 2, 0.7), 0],
      size: [
        Math.max(finalSize.x * 1.18, 1.15),
        Math.max(finalSize.y * 1.18, 1.25),
        Math.max(finalSize.z * 1.18, 1.15),
      ],
    });
  }, [clonedScene, normalize, normalizedSize, scale]);

  const setHighlight = (active) => {
    materialsRef.current.forEach((material) => {
      if (active) {
        if (material.color) material.color.set(eraColor);

        if (material.emissive) {
          material.emissive.set(eraColor);
          material.emissiveIntensity = 0.28;
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
        material.emissiveIntensity =
          material.userData.originalEmissiveIntensity ?? 0;
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
    onEnter?.(data);
  };

  const handlePointerLeave = (event) => {
    event.stopPropagation();
    setHighlight(false);
    document.body.style.cursor = "auto";
    onLeave?.(data);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onInteract?.(data);
  };

  return (
    <group
      position={position}
      rotation={rotation}
      scale={normalize ? 1 : scale}
    >
      <mesh
        position={hitBox.center}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <boxGeometry args={hitBox.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group position={modelTransform.position} scale={modelTransform.scale}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}
