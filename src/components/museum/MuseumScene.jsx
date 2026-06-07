import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import MuseumLoader from "./MuseumLoader";

import "./MuseumScene.css";

import { Crosshair } from "./Crosshair";
import DinoPopup from "./DinoPopup";
import InteractableModel from "./InteractableModel";
import MuseumEnvironment from "./MuseumEnvironment";
import PlayerController from "./PlayerController";
import SafePointerLockControls from "./SafePointerLockControls";
import {
  getCachedMuseumAssets,
  prefetchMuseumAssets,
  prefetchEraAssets,
} from "../../services/assetPreloader";

export default function MuseumScene() {
  const [sceneAssets, setSceneAssets] = useState(() => getCachedMuseumAssets());
  const [selectedDino, setSelectedDino] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [loading, setLoading] = useState(!getCachedMuseumAssets());
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Nếu đã có cache từ prefetch ở Home → không cần fetch lại
    if (sceneAssets) {
      setLoading(false);
      return;
    }

    // Fallback: tự fetch nếu user vào thẳng /museum
    let cancelled = false;
    prefetchMuseumAssets()
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setSceneAssets(data);
        } else {
          setErrorMessage("Không tải được dữ liệu mô hình bảo tàng.");
        }
      })
      .catch(() => {
        if (!cancelled)
          setErrorMessage("Không tải được dữ liệu mô hình bảo tàng.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Khi museum đã load → warm-up cả 3 era trong background (idle time)
  useEffect(() => {
    if (loading) return;
    const slugs = ["triassic", "jurassic", "cretaceous"];
    let idx = 0;
    // Prefetch tuần tự để không tranh băng thông với museum GLB
    const next = () => {
      if (idx >= slugs.length) return;
      prefetchEraAssets(slugs[idx++]).finally(() => {
        if ("requestIdleCallback" in window) {
          requestIdleCallback(next, { timeout: 5000 });
        } else {
          setTimeout(next, 1500);
        }
      });
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(next, { timeout: 6000 });
    } else {
      setTimeout(next, 2000);
    }
  }, [loading]);

  const dinoList = sceneAssets
    ? [
        {
          id: "triassic",
          era: "KỶ TRIAS",
          eraEn: "TRIASSIC PERIOD",
          name: "Plateosaurus",
          description:
            "Đại diện cho kỷ Trias, giai đoạn đầu của kỷ nguyên khủng long. Đây sẽ là cổng dẫn vào khu trưng bày sinh vật thời Trias.",
          descriptionEn:
            "Representative of the Triassic, the dawn of the dinosaur age. This is the gateway to the Triassic exhibit.",
          url: sceneAssets.triassic_fossil_url,
          route: "/era/triassic",
          position: [-3, 0.95, -2],
          scale: 1,
          eraColor: "#e07b39",
        },
        {
          id: "jurassic",
          era: "KỶ JURA",
          eraEn: "JURASSIC PERIOD",
          name: "Diplodocus",
          description:
            "Đại diện cho kỷ Jura, thời kỳ khủng long phát triển mạnh mẽ với nhiều loài khổng lồ. Đây là cổng dẫn vào khu trưng bày kỷ Jura.",
          descriptionEn:
            "Representative of the Jurassic, when giant dinosaurs ruled the Earth. This is the gateway to the Jurassic exhibit.",
          url: sceneAssets.jurassic_fossil_url,
          route: "/era/jurassic",
          position: [0, 1.05, -2],
          scale: 1,
          eraColor: "#4ade80",
        },
        {
          id: "cretaceous",
          era: "KỶ PHẤN TRẮNG",
          eraEn: "CRETACEOUS PERIOD",
          name: "Triceratops",
          description:
            "Đại diện cho kỷ Phấn Trắng, giai đoạn cuối cùng của thời đại khủng long. Đây là cổng dẫn vào khu trưng bày kỷ Phấn Trắng.",
          descriptionEn:
            "Representative of the Cretaceous, the final chapter of the dinosaur era. This is the gateway to the Cretaceous exhibit.",
          url: sceneAssets.cretaceous_fossil_url,
          route: "/era/cretaceous",
          position: [3, 1, -2],
          scale: 1,
          eraColor: "#f59e0b",
        },
      ]
    : [];

  if (errorMessage) {
    return (
      <div className="museum-scene-page museum-scene-center">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="museum-scene-page">
      <Canvas
        className="museum-canvas"
        camera={{
          position: [0, 2, 8],
          fov: 60,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} />

          {!loading && sceneAssets?.asset_url && (
            <MuseumEnvironment url={sceneAssets.asset_url} />
          )}

          {!loading &&
            dinoList.map((dino) => (
              <InteractableModel
                key={dino.id}
                url={dino.url}
                position={dino.position}
                scale={dino.scale}
                eraColor={dino.eraColor}
                data={dino}
                onInteract={setSelectedDino}
              />
            ))}

          <PlayerController />

          <SafePointerLockControls
            onLock={() => setIsPointerLocked(true)}
            onUnlock={() => setIsPointerLocked(false)}
          />
        </Suspense>
      </Canvas>

      <MuseumLoader isFetchingAssets={loading} />

      <Crosshair />

      {!isPointerLocked && (
        <div className="museum-guide-box">
          {/* Toggle VI/EN */}
          <button
            onClick={() => setLanguage((l) => (l === "vi" ? "en" : "vi"))}
            style={{
              position: "absolute",
              top: 12,
              right: 14,
              border: "1px solid rgba(245,200,100,0.45)",
              borderRadius: "14px",
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "0.08em",
              color: "#f5f0e8",
              background:
                "linear-gradient(135deg, rgba(180,120,30,0.55), rgba(0,0,0,0.65))",
            }}
          >
            {language === "vi" ? "VI" : "EN"}
          </button>

          <h3>{language === "en" ? "Controls" : "Hướng dẫn"}</h3>
          <p>
            {language === "en"
              ? "Click screen to start."
              : "Click vào màn hình để bắt đầu."}
          </p>
          <p>
            <b>W A S D:</b> {language === "en" ? "move" : "di chuyển"}
          </p>
          <p>
            <b>Space:</b> {language === "en" ? "jump" : "nhảy"}
          </p>
          <p>
            <b>{language === "en" ? "Mouse" : "Chuột"}:</b>{" "}
            {language === "en" ? "rotate camera" : "xoay camera"}
          </p>
          <p>
            <b>Shift:</b> {language === "en" ? "run" : "chạy nhanh"}
          </p>
          <p>
            <b>ESC:</b>{" "}
            {language === "en" ? "exit controls" : "thoát chế độ điều khiển"}
          </p>
          <p>
            {language === "en"
              ? "Click fossils to select an era."
              : "Click vào hóa thạch để chọn kỷ nguyên."}
          </p>
        </div>
      )}

      {selectedDino && (
        <DinoPopup
          dino={selectedDino}
          language={language}
          onClose={() => setSelectedDino(null)}
        />
      )}
    </div>
  );
}
