import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";

export default function SafePointerLockControls({
  camera: explicitCamera,
  domElement,
  onChange,
  onLock,
  onUnlock,
  enabled = true,
  makeDefault = false,
  ...props
}) {
  const setEvents = useThree((state) => state.setEvents);
  const gl = useThree((state) => state.gl);
  const defaultCamera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const events = useThree((state) => state.events);
  const get = useThree((state) => state.get);
  const set = useThree((state) => state.set);

  const camera = explicitCamera || defaultCamera;
  const target = domElement || events.connected || gl.domElement;
  const controls = useMemo(() => new PointerLockControlsImpl(camera), [camera]);

  useEffect(() => {
    if (!enabled || !target) return undefined;

    // Suppress noisy browser/API failures; actual lock state is handled below.
    controls.onPointerlockError = () => {};
    controls.connect(target);

    const previousCompute = get().events.compute;
    setEvents({
      compute(event, state) {
        const offsetX = state.size.width / 2;
        const offsetY = state.size.height / 2;
        state.pointer.set(
          (offsetX / state.size.width) * 2 - 1,
          -((offsetY / state.size.height) * 2) + 1
        );
        state.raycaster.setFromCamera(state.pointer, state.camera);
      },
    });

    return () => {
      controls.disconnect();
      setEvents({ compute: previousCompute });
    };
  }, [controls, enabled, get, setEvents, target]);

  useEffect(() => {
    const handleChange = (event) => {
      invalidate();
      onChange?.(event);
    };

    controls.addEventListener("change", handleChange);
    if (onLock) controls.addEventListener("lock", onLock);
    if (onUnlock) controls.addEventListener("unlock", onUnlock);

    return () => {
      controls.removeEventListener("change", handleChange);
      if (onLock) controls.removeEventListener("lock", onLock);
      if (onUnlock) controls.removeEventListener("unlock", onUnlock);
    };
  }, [controls, invalidate, onChange, onLock, onUnlock]);

  useEffect(() => {
    if (!enabled || !target) return undefined;

    let lastUnlockAt = 0;

    const handleUnlock = () => {
      lastUnlockAt = performance.now();
    };

    const handleClick = () => {
      if (target.ownerDocument.pointerLockElement === target) return;
      if (performance.now() - lastUnlockAt < 250) return;

      const lockResult = target.requestPointerLock?.();
      if (lockResult && typeof lockResult.catch === "function") {
        lockResult.catch(() => {});
      }
    };

    controls.addEventListener("unlock", handleUnlock);
    target.addEventListener("click", handleClick);

    return () => {
      controls.removeEventListener("unlock", handleUnlock);
      target.removeEventListener("click", handleClick);
    };
  }, [controls, enabled, target]);

  useEffect(() => {
    if (!makeDefault) return undefined;

    const previous = get().controls;
    set({ controls });

    return () => set({ controls: previous });
  }, [controls, get, makeDefault, set]);

  return <primitive object={controls} {...props} />;
}
