import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const MOVE_SPEED = 50;

export default function PlayerController() {
  const { camera } = useThree();

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "shift") {
        keys.current.shift = true;
      }

      if (key in keys.current) {
        keys.current[key] = true;
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (key === "shift") {
        keys.current.shift = false;
      }

      if (key in keys.current) {
        keys.current[key] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const speed = keys.current.shift ? MOVE_SPEED * 1.8 : MOVE_SPEED;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    const move = new THREE.Vector3();

    if (keys.current.w) move.add(forward);
    if (keys.current.s) move.sub(forward);
    
    if (keys.current.d) move.add(right);
    if (keys.current.a) move.sub(right);
    
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      camera.position.add(move);
    }

    camera.position.y = 2;
  });

  return null;
}