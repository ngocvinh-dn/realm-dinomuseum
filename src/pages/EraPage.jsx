import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import InteractableModel from "../components/museum/InteractableModel";
import PlayerController from "../components/museum/PlayerController";
import MuseumLoader from "../components/museum/MuseumLoader";
import { Crosshair } from "../components/museum/Crosshair";
import DinosaurPopup from "../components/museum/DinosaurPopup";
import MuseumEnvironment from "../components/museum/MuseumEnvironment";
import SafePointerLockControls from "../components/museum/SafePointerLockControls";
import { getEnvironmentBySlug } from "../services/environmentService";
import { getExhibitsByEraId } from "../services/exhibitsService";
import CanvasErrorBoundary from "../components/home/CanvasErrorBoundary";

function isModelScene(url = "") {
  return /\.(glb|gltf)(?:[?#].*)?$/i.test(url);
}
export default function EraPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [era, setEra] = useState(null);
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [selectedDino, setSelectedDino] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const eraData = await getEnvironmentBySlug(slug);
        setEra(eraData);
        const exhibitData = await getExhibitsByEraId(eraData.id);
        setExhibits(exhibitData);
      } catch (err) {
        console.error("Failed to load era:", err);
        setError("Không thể tải môi trường này.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const eraColor =
    slug === "triassic"
      ? "#e07b39"
      : slug === "jurassic"
      ? "#4ade80"
      : "#f59e0b";
  const environmentUrl = era?.environment_map_url || "";
  const renderModelEnvironment = isModelScene(environmentUrl);

  if (error) {
    return (
      <div style={styles.centered}>
        <p style={{ color: "#fff", marginBottom: 16 }}>{error}</p>
        <button style={{...styles.backBtn, borderColor: eraColor, color: eraColor}} onClick={() => navigate("/museum")}>
  ← Quay lại Bảo Tàng
</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
     {/* Nút quay lại */}
<button
  style={{
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
    background: `linear-gradient(135deg, ${eraColor}99, rgba(0,0,0,0.7))`,  
    color: "#f5f0e8",
    border: `1px solid ${eraColor}77`,
    borderRadius: "18px",
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "800",
    backdropFilter: "blur(8px)",
    letterSpacing: "0.05em",
  }}
  onClick={() => navigate("/museum")}
>
  ← Quay lại Bảo Tàng
</button>

      {/* Tên kỷ */}
      {era && (
        <div style={styles.eraLabel}>
          <span style={{ ...styles.eraName, color: eraColor, textShadow: `0 0 12px ${eraColor}88` }}>
            {era.name_vi}
          </span>
          {era.period_start_mya && era.period_end_mya && (
            <span style={styles.eraPeriod}>
              {era.period_end_mya} – {era.period_start_mya} triệu năm trước
            </span>
          )}
        </div>
      )}

      {/* Canvas 3D */}
      <Canvas style={styles.canvas} camera={{ position: [0, 2, 8], fov: 60 }}>
        <Suspense fallback={null}>
          {/* EXR làm background + lighting */}
          {!loading && environmentUrl && (
            renderModelEnvironment ? (
              <MuseumEnvironment url={environmentUrl} />
            ) : (
              <Environment files={environmentUrl} background backgroundBlurriness={0} />
            )
          )}

          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />

          {/* Model khủng long từ bảng exhibits */}
          {!loading &&
            exhibits.map((exhibit) => {
              const modelUrl = exhibit.dinosaurs?.fossil_model_url;
              if (!modelUrl) return null;
              return (
                <CanvasErrorBoundary key={exhibit.id}>
  <InteractableModel
    url={modelUrl}
    position={exhibit.position}
    rotation={exhibit.rotation}
    scale={3}
    normalize={true}
    eraColor={eraColor}
    data={exhibit.dinosaurs}
    onInteract={setSelectedDino}
  />
</CanvasErrorBoundary>
              );
            })}

          <PlayerController />

          <SafePointerLockControls
            onLock={() => setIsPointerLocked(true)}
            onUnlock={() => setIsPointerLocked(false)}
          />
        </Suspense>
      </Canvas>

      <MuseumLoader isFetchingAssets={loading} />
      <Crosshair />

      {/* Hướng dẫn */}
      {!isPointerLocked && !loading && (
        <div style={styles.guideBox}>
          <h3 style={{ margin: "0 0 8px", fontSize: "1rem", color: eraColor }}>
            Hướng dẫn di chuyển
          </h3>
          <p style={styles.guideText}>Click vào màn hình để bắt đầu.</p>
          <p style={styles.guideText}><b>W A S D</b> — di chuyển</p>
          <p style={styles.guideText}><b>Chuột</b> — xoay camera</p>
          <p style={styles.guideText}><b>Shift</b> — chạy nhanh</p>
          <p style={styles.guideText}><b>ESC</b> — thoát điều khiển</p>
          <p style={{ ...styles.guideText, marginTop: 8, color: eraColor }}>
            Click vào khủng long để xem thông tin
          </p>
        </div>
      )}

      {/* Popup thông tin khủng long */}
{selectedDino && (
  <DinosaurPopup
    dinosaur={selectedDino}
    onClose={() => setSelectedDino(null)}
    language="vi"
  />
)}
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    background: "#0a0a0a",
    position: "relative",
    overflow: "hidden",
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
  centered: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "0.9rem",
    backdropFilter: "blur(8px)",
  },
  backBtnStatic: {
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  eraLabel: {
    position: "absolute",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    pointerEvents: "none",
  },
  eraName: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    letterSpacing: "0.08em",
  },
  eraPeriod: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.8rem",
  },
  guideBox: {
    position: "absolute",
    bottom: 32,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    borderRadius: "12px",
    padding: "16px 24px",
    minWidth: 220,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },
  guideText: {
    margin: "4px 0",
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.8)",
  },
};
