/**
 * EraTransitionLoader.jsx
 *
 * Overlay loading mượt khi navigate Museum → EraPage.
 * Hiển thị era color + tên kỷ nguyên trong lúc GLB load.
 * Tự ẩn khi Three.js useProgress báo complete.
 */

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

const ERA_META = {
  triassic: { label: "Kỷ Trias", color: "#e07b39", period: "252 – 201 triệu năm trước" },
  jurassic: { label: "Kỷ Jura", color: "#4ade80", period: "201 – 145 triệu năm trước" },
  cretaceous: { label: "Kỷ Phấn Trắng", color: "#f59e0b", period: "145 – 66 triệu năm trước" },
};

export default function EraTransitionLoader({ slug, isFetchingData }) {
  const { progress, active } = useProgress();
  const meta = ERA_META[slug] || { label: slug, color: "#f59e0b", period: "" };
  const color = meta.color;

  // Smoothed progress để tránh giật ngược
  const [displayProgress, setDisplayProgress] = useState(isFetchingData ? 5 : progress);
  const targetRef = useRef(isFetchingData ? 5 : progress);

  useEffect(() => {
    // Khi fetch data xong, bắt đầu từ 15%
    const raw = isFetchingData ? 5 : Math.max(15, progress);
    targetRef.current = raw;
  }, [isFetchingData, progress]);

  useEffect(() => {
    let raf;
    const tick = () => {
      setDisplayProgress((prev) => {
        const diff = targetRef.current - prev;
        if (Math.abs(diff) < 0.3) return targetRef.current;
        return prev + diff * 0.08; // ease toward target
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const done = !isFetchingData && !active && progress >= 100;
  const safeProgress = Math.min(100, Math.max(0, Math.round(displayProgress)));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#080808",
        transition: "opacity 0.5s ease",
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "all",
        fontFamily: "var(--font-body, 'Hind', sans-serif)",
      }}
    >
      {/* Ambient glow màu era */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${color}22 0%, transparent 55%)`,
          animation: "eraPulse 2.8s ease-in-out infinite",
        }}
      />

      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(to bottom, ${color}08 0px, ${color}08 1px, transparent 1px, transparent 48px)`,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "min(380px, 86vw)" }}>
        {/* Spinner ring */}
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 28px",
            borderRadius: "50%",
            border: `2px solid ${color}22`,
            borderTopColor: color,
            borderRightColor: color + "cc",
            boxShadow: `0 0 20px ${color}55`,
            animation: "eraSpinner 0.85s linear infinite",
          }}
        />

        <p
          style={{
            margin: "0 0 4px",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color,
            textShadow: `0 0 14px ${color}88`,
            fontFamily: "var(--font-heading, 'Montserrat', sans-serif)",
          }}
        >
          {meta.label}
        </p>

        {meta.period && (
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 13,
              color: "rgba(245,240,232,0.55)",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            {meta.period}
          </p>
        )}

        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            color: "rgba(245,240,232,0.6)",
            letterSpacing: "0.04em",
          }}
        >
          {isFetchingData ? "Đang khởi tạo môi trường..." : "Đang tải mô hình 3D..."}
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: 5,
            borderRadius: 999,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 999,
              width: `${safeProgress}%`,
              background: `linear-gradient(90deg, ${color}99, ${color}, #fff8 100%)`,
              boxShadow: `0 0 14px ${color}99`,
              transition: "width 0.1s linear",
            }}
          />
        </div>

        <span
          style={{
            display: "block",
            marginTop: 10,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color,
            fontFamily: "var(--font-heading, 'Montserrat', sans-serif)",
          }}
        >
          {safeProgress}%
        </span>
      </div>

      <style>{`
        @keyframes eraSpinner { to { transform: rotate(360deg); } }
        @keyframes eraPulse { 0%,100%{opacity:.7} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
