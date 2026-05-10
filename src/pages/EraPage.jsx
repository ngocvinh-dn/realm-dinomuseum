import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Environment } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import InteractableModel from "../components/museum/InteractableModel";
import PlayerController from "../components/museum/PlayerController";
import MuseumLoader from "../components/museum/MuseumLoader";
import { Crosshair } from "../components/museum/Crosshair";
import DinoPopup from "../components/museum/DinoPopup";
import { getEnvironmentBySlug } from "../services/environmentService";
import { getExhibitsByEraId } from "../services/exhibitsService";

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

  if (error) {
    return (
      <div style={styles.centered}>
        <p style={{ color: "#fff", marginBottom: 16 }}>{error}</p>
        <button style={styles.backBtnStatic} onClick={() => navigate("/museum")}>
          ← Quay lại Bảo Tàng
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Nút quay lại */}
      <button style={styles.backBtn} onClick={() => navigate("/museum")}>
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
          {!loading && era?.environment_url && (
            <Environment files={era.environment_url} background />
          )}

          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />

          {/* Model khủng long từ bảng exhibits */}
          {!loading &&
            exhibits.map((exhibit) => {
              const modelUrl = exhibit.dinosaurs?.fossil_model_url;
              if (!modelUrl) return null;
              return (
                <InteractableModel
                  key={exhibit.id}
                  url={modelUrl}
                  position={exhibit.position}
                  rotation={exhibit.rotation}
                  scale={exhibit.modelScale}
                  eraColor={eraColor}
                  data={exhibit.dinosaurs}
                  onInteract={setSelectedDino}
                />
              );
            })}

          <PlayerController />

          <PointerLockControls
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
        <DinoPopup
          dino={{
            id: slug,
            era: era?.name_vi || slug,
            name: selectedDino.common_name_vi || selectedDino.common_name_en,
            description:
              selectedDino.description_vi ||
              selectedDino.description_en ||
              "Chưa có mô tả.",
            route: `/era/${slug}`,
          }}
          onClose={() => setSelectedDino(null)}
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