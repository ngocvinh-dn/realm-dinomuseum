import { useGLTF } from "@react-three/drei";

export default function MuseumEnvironment({ url }) {
  const { scene } = useGLTF(url);

  return <primitive object={scene} />;
}