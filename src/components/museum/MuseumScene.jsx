import { Canvas } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import MuseumLoader from "./MuseumLoader";

import "./MuseumScene.css";

import { Crosshair } from "./Crosshair";
import DinoPopup from "./DinoPopup";
import InteractableModel from "./InteractableModel";
import MuseumEnvironment from "./MuseumEnvironment";
import PlayerController from "./PlayerController";
import { getSceneAssets } from "../../services/sceneAssetsService";

export default function MuseumScene() {
  const [sceneAssets, setSceneAssets] = useState(null);
  const [selectedDino, setSelectedDino] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSceneAssets() {
      try {
        const data = await getSceneAssets();
        setSceneAssets(data);
      } catch (error) {
        console.error("Failed to load scene assets:", error);
        setErrorMessage("Không tải được dữ liệu mô hình bảo tàng.");
      } finally {
        setLoading(false);
      }
    }

    loadSceneAssets();
  }, []);

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

          <PointerLockControls
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