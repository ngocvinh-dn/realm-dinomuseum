import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const DEFAULT_WALK_SPEED = 10;
const DEFAULT_RUN_MULTIPLIER = 5;
const DEFAULT_CAMERA_HEIGHT = 2;

const EMPTY_KEYS = {
  w: false,
  a: false,
  s: false,
  d: false,
  shift: false,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function PlayerController({
  moveSpeed = DEFAULT_WALK_SPEED,
  runMultiplier = DEFAULT_RUN_MULTIPLIER,
  cameraHeight = DEFAULT_CAMERA_HEIGHT,
  bounds = null,
  enabled = true,
}) {
  const { camera } = useThree();

  const keys = useRef({ ...EMPTY_KEYS });
  const isPointerLocked = useRef(false);
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const move = useRef(new THREE.Vector3());

  const resetKeys = () => {
    keys.current = { ...EMPTY_KEYS };
  };

  useEffect(() => {
    const isMovementKey = (code) =>
      ["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "ShiftRight"].includes(code);

    const setKey = (event, pressed) => {
      if (!enabled) return;

      const { code } = event;

      if (code === "KeyW") keys.current.w = pressed;
      if (code === "KeyA") keys.current.a = pressed;
      if (code === "KeyS") keys.current.s = pressed;
      if (code === "KeyD") keys.current.d = pressed;
      if (code === "ShiftLeft" || code === "ShiftRight") {
        keys.current.shift = pressed;
      }

      if (isPointerLocked.current && isMovementKey(code)) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event) => setKey(event, true);
    const handleKeyUp = (event) => setKey(event, false);

    const handlePointerLockChange = () => {
      // SafePointerLockControls may lock the canvas itself or the R3F event target.
      // Checking only gl.domElement is too strict and can block all movement.
      isPointerLocked.current = Boolean(document.pointerLockElement);

      if (!isPointerLocked.current) {
        resetKeys();
      }
    };

    const handleBlur = () => resetKeys();

    const handleVisibilityChange = () => {
      if (document.hidden) resetKeys();
    };

    const handleContextMenu = (event) => {
      resetKeys();
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    handlePointerLockChange();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resetKeys();
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled || !isPointerLocked.current) {
      return;
    }

    const currentSpeed = keys.current.shift
      ? moveSpeed * runMultiplier
      : moveSpeed;

    camera.getWorldDirection(forward.current);
    forward.current.y = 0;

    if (forward.current.lengthSq() > 0) {
      forward.current.normalize();
    }

    right.current.crossVectors(forward.current, camera.up).normalize();
    move.current.set(0, 0, 0);

    if (keys.current.w) move.current.add(forward.current);
    if (keys.current.s) move.current.sub(forward.current);
    if (keys.current.d) move.current.add(right.current);
    if (keys.current.a) move.current.sub(right.current);

    if (move.current.lengthSq() > 0) {
      move.current.normalize().multiplyScalar(currentSpeed * delta);
      camera.position.add(move.current);
    }

    if (bounds) {
      if (typeof bounds.minX === "number") {
        camera.position.x = clamp(camera.position.x, bounds.minX, bounds.maxX);
      }

      if (typeof bounds.minZ === "number") {
        camera.position.z = clamp(camera.position.z, bounds.minZ, bounds.maxZ);
      }
    }

    camera.position.y = cameraHeight;
  });

  return null;
}
