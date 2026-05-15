import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function MuseumEnvironment({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    const clone = cloneSkeleton(scene);

    clone.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;
    });

    return clone;
  }, [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
