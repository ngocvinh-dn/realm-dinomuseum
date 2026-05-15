import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

function easeInCubic(t)   { return t * t * t; }
function easeOutCubic(t)  { return 1 - Math.pow(1 - t, 3); }
function easeOutBack(t)   { const s=1.6; return 1+(s+1)*Math.pow(t-1,3)+s*Math.pow(t-1,2); }
function easeInOutSine(t) { return -(Math.cos(Math.PI*t)-1)/2; }

const P_SINK  = 0.30;
const P_BURST = 0.50;

export default function ReviveEffect({
  active,
  fossilObject = null,
  revivedScene = null,
  position = [0, 0, 0],
  duration = 3.2,
  onSequenceDone,
}) {
  const groupRef     = useRef();
  const coreLightRef = useRef();
  const burstRef     = useRef();
  const waveRef      = useRef();
  const glowRef      = useRef();

  const progressRef     = useRef(0);
  const [progress, setProgress] = useState(0);
  const fossilOriginY   = useRef(null);
  const fossilOriginS   = useRef(null);
  const doneFiredRef    = useRef(false);

  const embers = useMemo(() => Array.from({ length: 60 }, () => ({
    angle:  Math.random()*Math.PI*2,
    radius: 0.3+Math.random()*1.6,
    height: Math.random()*2.2,
    speed:  0.5+Math.random()*1.2,
    size:   0.02+Math.random()*0.05,
    drift:  (Math.random()-0.5)*0.6,
    hot:    Math.random()>0.6,
  })), []);

  const dust = useMemo(() => Array.from({ length: 28 }, () => ({
    angle:  Math.random()*Math.PI*2,
    radius: 0.2+Math.random()*1.1,
    size:   0.05+Math.random()*0.12,
    height: 0.04+Math.random()*0.22,
  })), []);

  useEffect(() => {
    progressRef.current = 0;
    doneFiredRef.current = false;
    setProgress(0);

    if (!active) {
      if (fossilObject && fossilOriginY.current !== null) {
        fossilObject.visible = true;
        fossilObject.position.y = fossilOriginY.current;
        fossilObject.scale.setScalar(fossilOriginS.current ?? 1);
      }
      if (revivedScene) revivedScene.visible = false;
      fossilOriginY.current = null;
      fossilOriginS.current = null;
      return;
    }

    if (fossilObject) {
      fossilOriginY.current = fossilObject.position.y;
      fossilOriginS.current = fossilObject.scale.x;
      fossilObject.visible  = true;
    }
    if (revivedScene) {
      revivedScene.visible = false;
      revivedScene.scale.setScalar(0.01);
    }
  }, [active]); // eslint-disable-line

  useFrame((_, delta) => {
    if (!active || !groupRef.current) return;

    const prev = progressRef.current;
    if (prev >= 1) return;

    const next = Math.min(prev + delta / duration, 1);
    progressRef.current = next;
    setProgress(next);

    // ── Phase 0: fossil sinks ─────────────────────────────────────────────
    if (next <= P_SINK && fossilObject && fossilOriginY.current !== null) {
      const t  = next / P_SINK;
      const et = easeInCubic(t);
      fossilObject.position.y = fossilOriginY.current - et * 2.0;
      fossilObject.scale.setScalar(Math.max(0.01, (fossilOriginS.current ?? 1) * (1 - et)));
    }

    // ── Phase 1: burst ────────────────────────────────────────────────────
    if (next >= P_SINK && next <= P_BURST) {
      const t     = (next - P_SINK) / (P_BURST - P_SINK);
      const burst = Math.sin(t * Math.PI);

      if (fossilObject) fossilObject.visible = false;

      if (coreLightRef.current) coreLightRef.current.intensity = 3 + burst * 20;
      if (burstRef.current)     burstRef.current.intensity     = burst * 24;
      if (waveRef.current) {
        const sc = 0.5 + easeOutCubic(t) * 6.5;
        waveRef.current.scale.set(sc, sc, sc);
        waveRef.current.material.opacity = Math.max(0, 0.5 * (1 - t));
      }
      if (glowRef.current) {
        const sc = 0.8 + burst * 1.6;
        glowRef.current.scale.set(sc, sc, sc);
        glowRef.current.material.opacity = 0.55 * burst;
      }
    }

    // ── Phase 2: revived rises ────────────────────────────────────────────
    if (next > P_BURST) {
      const t  = (next - P_BURST) / (1 - P_BURST);
      const et = easeOutBack(Math.min(t, 1));

      if (coreLightRef.current) coreLightRef.current.intensity = Math.max(0, 3 * (1 - t));
      if (burstRef.current)     burstRef.current.intensity = 0;
      if (waveRef.current)      waveRef.current.material.opacity = 0;
      if (glowRef.current)      glowRef.current.material.opacity = 0;

      if (revivedScene) {
        revivedScene.visible   = true;
        revivedScene.position.y = -2.2 + et * 2.2;
        revivedScene.scale.setScalar(Math.max(0.01, 0.05 + et * 0.95));
      }
    }

    if (groupRef.current) groupRef.current.rotation.y += delta * 0.09;

    if (next >= 1 && !doneFiredRef.current) {
      doneFiredRef.current = true;
      if (revivedScene) { revivedScene.position.y = 0; revivedScene.scale.setScalar(1); }
      onSequenceDone?.();
    }
  });

  if (!active) return null;

  const smooth  = easeOutCubic(Math.min(progress, 1));
  const rise    = easeInOutSine(Math.max(0, (progress - P_BURST) / (1 - P_BURST)));
  const bT      = progress >= P_SINK && progress <= P_BURST
    ? (progress - P_SINK) / (P_BURST - P_SINK) : 0;
  const bSin    = Math.sin(bT * Math.PI);

  return (
    <group ref={groupRef} position={position}>
      <pointLight ref={coreLightRef} color="#ffb86b" intensity={0} distance={9} position={[0,1.2,0]} />
      <pointLight ref={burstRef} color="#fff5c0" intensity={0} distance={15} position={[0,2.5,0]} />

      {/* Shockwave */}
      <mesh ref={waveRef} rotation={[-Math.PI/2,0,0]} position={[0,0.04,0]} scale={[0.5,0.5,0.5]}>
        <ringGeometry args={[0.32,0.40,96]} />
        <meshBasicMaterial color="#ffb45c" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef} position={[0,0.3,0]}>
        <sphereGeometry args={[0.6,32,32]} />
        <meshBasicMaterial color="#ffd98a" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Dust during sink */}
      {progress < P_BURST + 0.1 && dust.map((p, i) => {
        const x  = Math.cos(p.angle)*p.radius*(0.4+smooth*0.8);
        const z  = Math.sin(p.angle)*p.radius*(0.4+smooth*0.8);
        const y  = p.height + smooth*0.3;
        const op = Math.max(0, 0.26*(1 - progress/P_BURST));
        return (
          <mesh key={`d${i}`} position={[x,y,z]} scale={p.size*(1.2 - Math.min(progress/P_SINK,1)*0.3)}>
            <sphereGeometry args={[1,7,7]} />
            <meshBasicMaterial color="#b08050" transparent opacity={op} depthWrite={false} />
          </mesh>
        );
      })}

      {/* Embers during burst+rise */}
      {progress >= P_SINK && embers.map((p, i) => {
        const spiral = p.angle + progress*p.speed*2.5;
        const rad    = p.radius*(0.3+smooth*0.9);
        const x      = Math.cos(spiral)*rad + p.drift*rise;
        const z      = Math.sin(spiral)*rad;
        const y      = p.height + rise*3.8 + bSin*0.9;
        const op     = Math.max(0, 0.9*(1 - (progress-P_SINK)/(1-P_SINK)));
        return (
          <mesh key={`e${i}`} position={[x,y,z]} scale={p.size*(1-progress*0.2)}>
            <sphereGeometry args={[1,7,7]} />
            <meshBasicMaterial color={p.hot?"#fff2aa":"#ff9f43"} transparent opacity={op} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}
