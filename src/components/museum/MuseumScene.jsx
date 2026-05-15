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

    return () => { cancelled = true; };
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
        if ('requestIdleCallback' in window) {
          requestIdleCallback(next, { timeout: 5000 });
        } else {
          setTimeout(next, 1500);
        }
      });
    };
    if ('requestIdleCallback' in window) {
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
          name: "Plateosaurus",
          description:
            "Đại diện cho kỷ Trias, giai đoạn đầu của kỷ nguyên khủng long. Đây sẽ là cổng dẫn vào khu trưng bày sinh vật thời Trias.",
          url: sceneAssets.triassic_fossil_url,
          route: "/era/triassic",
          position: [-3, 0.95, -2],
          scale: 1,
          eraColor: "#e07b39",
        },
        {
          id: "jurassic",
          era: "KỶ JURA",
          name: "Diplodocus",
          description:
            "Đại diện cho kỷ Jura, thời kỳ khủng long phát triển mạnh mẽ với nhiều loài khổng lồ. Đây là cổng dẫn vào khu trưng bày kỷ Jura.",
          url: sceneAssets.jurassic_fossil_url,
          route: "/era/jurassic",
          position: [0, 1.05, -2],
          scale: 1,
          eraColor: "#4ade80",
        },
        {
          id: "cretaceous",
          era: "KỶ PHẤN TRẮNG",
          name: "Triceratops",
          description:
            "Đại diện cho kỷ Phấn Trắng, giai đoạn cuối cùng của thời đại khủng long. Đây là cổng dẫn vào khu trưng bày kỷ Phấn Trắng.",
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
          <h3>Hướng dẫn di chuyển</h3>
          <p>Click vào màn hình để bắt đầu.</p>
          <p>
            <b>W A S D:</b> di chuyển
          </p>
          <p>
            <b>Chuột:</b> xoay camera
          </p>
          <p>
            <b>Shift:</b> chạy nhanh
          </p>
          <p>
            <b>ESC:</b> thoát chế độ điều khiển
          </p>
          <p>Click vào hóa thạch để chọn kỷ nguyên.</p>
        </div>
      )}

      {selectedDino && (
        <DinoPopup dino={selectedDino} onClose={() => setSelectedDino(null)} />
      )}
    </div>
  );
}
