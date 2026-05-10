import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, Html, OrbitControls } from "@react-three/drei";

import DinosaurPopup from "../museum/DinosaurPopup";
import ReviveEffect from "./effects/ReviveEffect";

function TestReviveWorld({
  exhibit,
  selectedExhibit,
  revivedExhibitId,
  onSelectExhibit,
}) {
  const dinosaur = exhibit?.dinosaurs;

  if (!exhibit || !dinosaur) return null;

  const isSelected = selectedExhibit?.id === exhibit.id;
  const isRevived = revivedExhibitId === exhibit.id;

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 8, 6]} intensity={2} />
      <pointLight position={[-4, 4, 4]} intensity={1.4} />

      <Grid args={[20, 20]} cellSize={1} sectionSize={5} />

      <ReviveEffect
        fossilModelUrl={dinosaur.fossil_model_url}
        revivedModelUrl={dinosaur.revived_model_url}
        fossilPosition={exhibit.position}
        fossilRotation={exhibit.rotation}
        fossilScale={exhibit.modelScale}
        reviveOffset={exhibit.reviveOffset}
        revivedScale={exhibit.revivedScale}
        revivedRotation={exhibit.revivedRotation}
        isRevived={isRevived}
        onClickFossil={() => onSelectExhibit(exhibit)}
      />

      <Html
        position={[
          exhibit.position[0],
          exhibit.position[1] + 1.8,
          exhibit.position[2],
        ]}
        center
        distanceFactor={8}
      >
        <div
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            background: isSelected
              ? "rgba(245, 158, 11, 0.95)"
              : "rgba(15, 23, 42, 0.86)",
            color: "white",
            fontSize: "12px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {dinosaur.common_name_vi || dinosaur.scientific_name || "Dinosaur"}
        </div>
      </Html>

      <Environment preset="city" />
      <OrbitControls makeDefault />
    </>
  );
}

export default function TestReviveScene({ exhibit }) {
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [revivedExhibitId, setRevivedExhibitId] = useState(null);

  const selectedDinosaur = selectedExhibit?.dinosaurs;
  const isSelectedRevived = revivedExhibitId === selectedExhibit?.id;

  function handleToggleRevive() {
    if (!selectedExhibit) return;

    setRevivedExhibitId((currentId) =>
      currentId === selectedExhibit.id ? null : selectedExhibit.id
    );
  }

  function handleClosePopup() {
    setSelectedExhibit(null);
  }

  if (!exhibit) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          color: "white",
          background: "#020617",
        }}
      >
        Chưa có dữ liệu exhibit test.
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#020617",
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [0, 4, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <TestReviveWorld
            exhibit={exhibit}
            selectedExhibit={selectedExhibit}
            revivedExhibitId={revivedExhibitId}
            onSelectExhibit={setSelectedExhibit}
          />
        </Suspense>
      </Canvas>

      {selectedDinosaur && (
        <DinosaurPopup
          dinosaur={selectedDinosaur}
          isRevived={isSelectedRevived}
          onClose={handleClosePopup}
          onRevive={handleToggleRevive}
          reviveButtonText={isSelectedRevived ? "Tắt mô phỏng" : "Hồi sinh"}
        />
      )}
    </div>
  );
}