import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import PlayerController from "../components/museum/PlayerController";
import EraTransitionLoader from "../components/museum/EraTransitionLoader";
import { Crosshair } from "../components/museum/Crosshair";
import DinosaurPopup from "../components/museum/DinosaurPopup";
import SafePointerLockControls from "../components/museum/SafePointerLockControls";
import ReviveEffect from "../components/scene/effects/ReviveEffect";
import CanvasErrorBoundary from "../components/home/CanvasErrorBoundary";

import { getEnvironmentBySlug } from "../services/environmentService";
import { getExhibitsByEraSlug } from "../services/exhibitsService";
import {
  getCachedEraData,
  prefetchEraAssets,
} from "../services/assetPreloader";

function getEraColor(slug) {
  if (slug === "triassic") return "#e07b39";
  if (slug === "jurassic") return "#4ade80";
  return "#f59e0b";
}

function getEraSceneConfig(slug) {
  const configs = {
    triassic: {
      cameraPosition: [0, 1.75, 6.4],
      environmentScale: 0.38,
      environmentPosition: [0, -0.08, 0],
      playerSpeed: 2.2,
      bounds: { minX: -14, maxX: 14, minZ: -18, maxZ: 7 },
    },
    jurassic: {
      cameraPosition: [0, 1.75, 6.8],
      environmentScale: 0.38,
      environmentPosition: [0, -0.08, 0],
      playerSpeed: 2.15,
      bounds: { minX: -15, maxX: 15, minZ: -19, maxZ: 7 },
    },
    cretaceous: {
      cameraPosition: [0, 1.75, 6.8],
      environmentScale: 0.38,
      environmentPosition: [0, -0.08, 0],
      playerSpeed: 2.15,
      bounds: { minX: -15, maxX: 15, minZ: -19, maxZ: 7 },
    },
  };

  return configs[slug] || configs.triassic;
}

function getDinosaurFromExhibit(exhibit) {
  return exhibit?.dinosaur || exhibit?.dinosaurs || null;
}

function normalizeDinosaurForPopup(dinosaur, era) {
  if (!dinosaur) return null;

  return {
    ...dinosaur,
    eras: dinosaur.eras || {
      id: era?.id,
      slug: era?.slug,
      name_vi: era?.name_vi,
      name_en: era?.name_en,
    },
  };
}


async function canLoadGLB(url) {
  if (!url) return false;

  const loader = new GLTFLoader();

  try {
    await loader.loadAsync(url.trim());
    return true;
  } catch (error) {
    console.error("[EraPage] Revived model load failed:", url, error);
    return false;
  }
}

function EnvironmentScene({
  url,
  era,
  exhibits,
  revivedMap,
  onSelectDinosaur,
  onRegisterFossilTransform,
  onRegisterFossilObject,
  onRegisterInteractiveObjects,
}) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    if (!scene) return null;

    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    if (!clonedScene || !exhibits?.length) return;

    clonedScene.updateMatrixWorld(true);

    const clickableObjects = [];

    exhibits.forEach((exhibit) => {
      const dinosaur = normalizeDinosaurForPopup(
        getDinosaurFromExhibit(exhibit),
        era
      );

      const objectName = exhibit.object_name;

      if (!objectName || !dinosaur) return;

      const fossilObject = clonedScene.getObjectByName(objectName);

      if (!fossilObject) {
        console.warn("[EraPage] Không tìm thấy fossil object:", objectName);
        return;
      }

      fossilObject.visible = !revivedMap[objectName];

      fossilObject.userData.dinosaur = dinosaur;
      fossilObject.userData.objectName = objectName;
      fossilObject.userData.isFossil = true;

      clickableObjects.push(fossilObject);

      fossilObject.updateMatrixWorld(true);

      const worldPosition = new THREE.Vector3();
      const worldQuaternion = new THREE.Quaternion();
      const worldScale = new THREE.Vector3();

      fossilObject.getWorldPosition(worldPosition);
      fossilObject.getWorldQuaternion(worldQuaternion);
      fossilObject.getWorldScale(worldScale);

      const fossilLocalPosition = clonedScene.worldToLocal(worldPosition.clone());

      const spawnLocalPosition = new THREE.Vector3(0, -0.4, 0);

      onRegisterFossilTransform(objectName, {
        fossilPosition: fossilLocalPosition.toArray(),
        spawnPosition: spawnLocalPosition.toArray(),
        quaternion: worldQuaternion.toArray(),
        scale: worldScale.toArray(),
      });

      fossilObject.traverse((child) => {
        if (!child.isMesh) return;

        child.castShadow = true;
        child.receiveShadow = true;

        child.userData.dinosaur = dinosaur;
        child.userData.objectName = objectName;
        child.userData.isFossil = true;
      });
    });

    console.log(
      "[EraPage] Clickable fossil objects:",
      clickableObjects.map((obj) => obj.name)
    );

      // Expose fossilObject THREE refs for ReviveEffect animation
      clickableObjects.forEach((obj) => {
        if (obj.userData?.objectName) {
          onRegisterFossilObject?.(obj.userData.objectName, obj);
        }
      });

      onRegisterInteractiveObjects(clickableObjects);
  }, [
    clonedScene,
    exhibits,
    era,
    revivedMap,
    onRegisterFossilTransform,
    onRegisterInteractiveObjects,
    onRegisterFossilObject,
  ]);

  if (!clonedScene) return null;

  return (
    <primitive
      object={clonedScene}
      onClick={(event) => {
        const dinosaur = event.object.userData?.dinosaur;

        if (!dinosaur) return;

        event.stopPropagation();
        onSelectDinosaur(dinosaur);
      }}
    />
  );
}

function RevivedDinosaur({ dinosaur, transform, onSelect, sceneRef }) {
  const url = dinosaur?.revived_model_url?.trim();
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
  if (!scene) return null;

  const clone = scene.clone(true);

  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.dinosaur = dinosaur;
      child.userData.isRevived = true;
    }
  });

  // lưu ref của revived model
  if (sceneRef) {
    sceneRef.current = clone;
  }

  return clone;
  }, [scene, dinosaur, sceneRef]);

  if (!url || !clonedScene || !transform) return null;

  return (
    <primitive
      object={clonedScene}
      position={transform.spawnPosition || transform.fossilPosition}
      quaternion={new THREE.Quaternion(...transform.quaternion)}
      scale={1}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(dinosaur);
      }}
    />
  );
}

function FossilRaycastClicker({ interactiveObjects, onSelectDinosaur }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();

    function handlePointerDown(event) {
      if (!interactiveObjects?.length) {
        console.warn("[EraPage] Không có interactiveObjects để click.");
        return;
      }

      const rect = gl.domElement.getBoundingClientRect();
      const isPointerLocked = document.pointerLockElement === gl.domElement;

      const pointer = isPointerLocked
        ? new THREE.Vector2(0, 0)
        : new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
          );

      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObjects(interactiveObjects, true);

      console.log(
        "[EraPage] Raycast hits:",
        hits.map((hit) => hit.object.name)
      );

      if (!hits.length) return;

      let object = hits[0].object;

      while (object) {
        if (object.userData?.dinosaur) {
          onSelectDinosaur(object.userData.dinosaur);
          return;
        }

        object = object.parent;
      }
    }

    gl.domElement.addEventListener("pointerdown", handlePointerDown);

    return () => {
      gl.domElement.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [camera, gl, interactiveObjects, onSelectDinosaur]);

  return null;
}

function EraWorld({ era, exhibits, revivedMap, fossilObjectsRef, setSelectedDino, sceneConfig }) {
  const [fossilTransforms, setFossilTransforms] = useState({});
  const [interactiveObjects, setInteractiveObjects] = useState([]);

  // objectName → ref holding the cloned revived THREE.Object3D (set by RevivedDinosaur)
  const revivedSceneRefs = useRef({});

  // Internal fossil objects map (populated by EnvironmentScene callback)
  if (!fossilObjectsRef.current) fossilObjectsRef.current = {};

  const registerFossilTransform = useRef((objectName, transform) => {
    setFossilTransforms((prev) => {
      const old = prev[objectName];
      if (
        old &&
        JSON.stringify(old.fossilPosition) === JSON.stringify(transform.fossilPosition) &&
        JSON.stringify(old.spawnPosition)  === JSON.stringify(transform.spawnPosition) &&
        JSON.stringify(old.quaternion)     === JSON.stringify(transform.quaternion)
      ) {
        return prev;
      }
      return { ...prev, [objectName]: transform };
    });
  }).current;

  const revivedExhibits = useMemo(() => {
    return exhibits.filter((exhibit) => revivedMap[exhibit.object_name]);
  }, [exhibits, revivedMap]);

  return (
    <group position={sceneConfig.environmentPosition} scale={sceneConfig.environmentScale}>
      <EnvironmentScene
        url={era.environment_map_url}
        era={era}
        exhibits={exhibits}
        revivedMap={revivedMap}
        onSelectDinosaur={setSelectedDino}
        onRegisterFossilTransform={registerFossilTransform}
        onRegisterFossilObject={(name, obj) => { fossilObjectsRef.current[name] = obj; }}
        onRegisterInteractiveObjects={setInteractiveObjects}
      />

      <FossilRaycastClicker
        interactiveObjects={interactiveObjects}
        onSelectDinosaur={setSelectedDino}
      />

      {/* Always mount revived dinosaurs for ALL exhibits so GLB stays cached,
          but they start invisible; ReviveEffect animates them into view */}
      {revivedExhibits.map((exhibit) => {
      const dinosaur = normalizeDinosaurForPopup(
        getDinosaurFromExhibit(exhibit),
        era
      );
    
      if (!dinosaur?.revived_model_url) return null;
    
      const objectName = exhibit.object_name;
      const transform = fossilTransforms[objectName];
    
      if (!transform) return null;
    
      if (!revivedSceneRefs.current[objectName]) {
        revivedSceneRefs.current[objectName] = { current: null };
      }
    
      const sceneRef = revivedSceneRefs.current[objectName];
    
      return (
        <RevivedDinosaur
          key={`revived-${objectName}`}
          dinosaur={dinosaur}
          transform={transform}
          onSelect={setSelectedDino}
          sceneRef={sceneRef}
        />
      );
      })}

      {/* ReviveEffect gets direct refs to both THREE objects for animation */}
      {Object.entries(revivedMap).map(([objectName, isRevived]) => {
        const transform = fossilTransforms[objectName];
        if (!transform) return null;

        const fossilObj  = fossilObjectsRef?.current?.[objectName] ?? null;
        const revivedRef = revivedSceneRefs.current[objectName];
        const revivedObj = revivedRef?.current ?? null;

        return (
          <ReviveEffect
            key={`effect-${objectName}`}
            active={isRevived}
            fossilObject={fossilObj}
            revivedScene={revivedObj}
            position={transform.fossilPosition || transform.spawnPosition}
          />
        );
      })}
    </group>
  );
}

export default function EraPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [era, setEra] = useState(null);
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [selectedDino, setSelectedDino] = useState(null);
  const [revivedMap, setRevivedMap] = useState({});
  // Stores THREE.Object3D refs for fossil meshes – populated by EnvironmentScene
  const fossilObjectsRef = useRef({});

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        setWarning("");
        setSelectedDino(null);
        setRevivedMap({});

        // Thử cache trước – nếu user đã prefetch từ DinoPopup/hover thì instant
        const cached = getCachedEraData(slug);
        if (cached) {
          if (!ignore) {
            setEra(cached.eraData);
            setExhibits(cached.exhibitData);
            setLoading(false);
          }
          return;
        }

        // Cache miss → fetch, nhưng dùng prefetchEraAssets để đồng thời preload GLB
        const result = await prefetchEraAssets(slug);
        if (!result) throw new Error("Era not found");

        if (!ignore) {
          setEra(result.eraData);
          setExhibits(result.exhibitData);
        }
      } catch (err) {
        console.error("Failed to load era:", err);
        if (!ignore) setError("Không thể tải môi trường này.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();

    return () => { ignore = true; };
  }, [slug]);

  const eraColor = getEraColor(slug);
  const sceneConfig = getEraSceneConfig(slug);

function handleToggleRevive(dinosaur) {
  if (!dinosaur?.id) return;

  const exhibit = exhibits.find((item) => {
    const itemDino = getDinosaurFromExhibit(item);
    return itemDino?.id === dinosaur.id;
  });

  if (!exhibit?.object_name) {
    setWarning("Không tìm thấy object_name của hóa thạch trong exhibits.");
    return;
  }

  const objectName = exhibit.object_name;
  const alreadyRevived = Boolean(revivedMap[objectName]);

  setWarning("");

  // Toggle: nếu đã revived thì tắt lại
  setRevivedMap((prev) => ({
    ...prev,
    [objectName]: !alreadyRevived,
  }));

  // Preload revived model URL vào drei cache (non-blocking, không trigger useProgress)
  // Model sẽ được prefetch service xử lý khi popup mở, nhưng preload thêm lần nữa an toàn
  if (!alreadyRevived && dinosaur.revived_model_url) {
    useGLTF.preload(dinosaur.revived_model_url.trim());
  }
}

  if (error) {
    return (
      <div style={styles.centered}>
        <p style={{ color: "#fff", marginBottom: 16 }}>{error}</p>

        <button
          style={{
            ...styles.backBtn,
            borderColor: eraColor,
            color: eraColor,
          }}
          onClick={() => navigate("/museum")}
        >
          ← Quay lại Bảo Tàng
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <button
        style={{
          ...styles.backBtn,
          borderColor: `${eraColor}77`,
          color: "#f5f0e8",
          background: `linear-gradient(135deg, ${eraColor}99, rgba(0,0,0,0.7))`,
        }}
        onClick={() => navigate("/museum")}
      >
        ← Quay lại Bảo Tàng
      </button>

      {era && (
        <div style={styles.eraLabel}>
          <span
            style={{
              ...styles.eraName,
              color: eraColor,
              textShadow: `0 0 12px ${eraColor}88`,
            }}
          >
            {era.name_vi}
          </span>

          {era.period_start_mya && era.period_end_mya && (
            <span style={styles.eraPeriod}>
              {era.period_end_mya} – {era.period_start_mya} triệu năm trước
            </span>
          )}
        </div>
      )}

      {warning && <div style={styles.warningBox}>{warning}</div>}

      <Canvas
        style={styles.canvas}
        camera={{
          position: sceneConfig.cameraPosition,
          fov: 58,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />

          <directionalLight position={[5, 8, 5]} intensity={1.05} castShadow />

          <pointLight position={[0, 3, 2]} intensity={0.55} color={eraColor} />

          <Environment preset="warehouse" />

          {!loading && era?.environment_map_url && (
            <CanvasErrorBoundary>
              <EraWorld
                era={era}
                exhibits={exhibits}
                revivedMap={revivedMap}
                fossilObjectsRef={fossilObjectsRef}
                setSelectedDino={setSelectedDino}
                sceneConfig={sceneConfig}
              />
            </CanvasErrorBoundary>
          )}

          <PlayerController
            moveSpeed={sceneConfig.playerSpeed}
            runMultiplier={1.35}
            cameraHeight={1.75}
            bounds={sceneConfig.bounds}
          />

          <SafePointerLockControls
            onLock={() => setIsPointerLocked(true)}
            onUnlock={() => setIsPointerLocked(false)}
          />
        </Suspense>
      </Canvas>

      <EraTransitionLoader slug={slug} isFetchingData={loading} />

      <Crosshair />

      {!isPointerLocked && !loading && (
        <div style={styles.guideBox}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "1rem",
              color: eraColor,
            }}
          >
            Hướng dẫn di chuyển
          </h3>

          <p style={styles.guideText}>Click vào màn hình để bắt đầu.</p>
          <p style={styles.guideText}>
            <b>W A S D</b> — di chuyển
          </p>
          <p style={styles.guideText}>
            <b>Chuột</b> — xoay camera
          </p>
          <p style={styles.guideText}>
            <b>Shift</b> — chạy nhanh
          </p>
          <p style={styles.guideText}>
            <b>ESC</b> — thoát điều khiển
          </p>
          <p
            style={{
              ...styles.guideText,
              marginTop: 8,
              color: eraColor,
            }}
          >
            Click vào hóa thạch hoặc khủng long để xem thông tin.
          </p>
        </div>
      )}

      {selectedDino && (
        <DinosaurPopup
          dinosaur={selectedDino}
          onClose={() => setSelectedDino(null)}
          onRevive={handleToggleRevive}
          isRevived={Boolean(
            revivedMap[
              exhibits.find((item) => {
                const dino = getDinosaurFromExhibit(item);
                return dino?.id === selectedDino.id;
              })?.object_name
            ]
          )}
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
    display: "grid",
    placeItems: "center",
    background: "#080808",
  },

  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
    border: "1px solid",
    borderRadius: "18px",
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "800",
    backdropFilter: "blur(8px)",
    letterSpacing: "0.05em",
  },

  eraLabel: {
    position: "absolute",
    top: 22,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "12px 22px",
    borderRadius: 18,
    background: "rgba(0, 0, 0, 0.42)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  },

  eraName: {
    fontSize: "20px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  eraPeriod: {
    color: "rgba(245,240,232,0.72)",
    fontSize: "13px",
    fontWeight: 700,
  },

  guideBox: {
    position: "absolute",
    left: 24,
    bottom: 24,
    zIndex: 60,
    width: 280,
    padding: 18,
    borderRadius: 20,
    color: "#f5f0e8",
    background: "rgba(0,0,0,0.58)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
  },

  guideText: {
    margin: "4px 0",
    color: "rgba(245,240,232,0.78)",
    fontSize: 14,
    fontWeight: 600,
  },

  warningBox: {
    position: "absolute",
    left: "50%",
    bottom: 26,
    transform: "translateX(-50%)",
    zIndex: 110,
    maxWidth: 620,
    padding: "12px 16px",
    borderRadius: 14,
    color: "#fff4d6",
    background: "rgba(75, 36, 5, 0.86)",
    border: "1px solid rgba(245, 158, 11, 0.45)",
    fontWeight: 700,
    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
  },
};