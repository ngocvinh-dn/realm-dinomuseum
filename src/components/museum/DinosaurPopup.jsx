import { useState } from "react";
import "./DinosaurPopup.css";
import CloseButton from "../common/CloseButton";
import GlowButton from "../common/GlowButton";
import DinosaurFactsCarousel from "./DinosaurFactsCarousel";

const CLOSE_ANIMATION_DURATION = 280;

function getEraSlug(dinosaur) {
  return dinosaur?.eras?.slug || "cretaceous";
}

function translate(vi, en, language) {
  if (language === "en") return en || vi || "Unknown";
  return vi || en || "Chưa rõ";
}

function formatValue(value, suffix = "", language = "vi") {
  if (value === null || value === undefined || value === "") {
    return language === "en" ? "Unknown" : "Chưa rõ";
  }

  return `${value}${suffix}`;
}

function formatDiet(diet, language) {
  const dietMap = {
    carnivore: {
      vi: "Ăn thịt",
      en: "Carnivore",
    },
    herbivore: {
      vi: "Ăn thực vật",
      en: "Herbivore",
    },
    omnivore: {
      vi: "Ăn tạp",
      en: "Omnivore",
    },
  };

  if (!diet) return language === "en" ? "Unknown" : "Chưa rõ";

  return dietMap[diet]?.[language] || diet;
}

function getText(language, viText, enText) {
  if (language === "en") return enText || viText || "Unknown";
  return viText || enText || "Chưa rõ";
}

function updateEdgeGlow(event) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const dx = x - centerX;
  const dy = y - centerY;

  const kx = dx === 0 ? Infinity : centerX / Math.abs(dx);
  const ky = dy === 0 ? Infinity : centerY / Math.abs(dy);

  const edgeProximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  const edgeOpacity = Math.max(0, Math.min(1, (edgeProximity - 0.32) / 0.68));

  let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;

  element.style.setProperty("--edge-opacity", edgeOpacity.toFixed(3));
  element.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  element.style.setProperty("--glow-x", `${((x / rect.width) * 100).toFixed(2)}%`);
  element.style.setProperty("--glow-y", `${((y / rect.height) * 100).toFixed(2)}%`);
}

function resetEdgeGlow(event) {
  const element = event.currentTarget;

  element.style.setProperty("--edge-opacity", "0");
  element.style.setProperty("--glow-x", "50%");
  element.style.setProperty("--glow-y", "50%");
}

export default function DinosaurPopup({
  dinosaur,
  onClose,
  onRevive,
  language = "vi",
}) {
  const [isClosing, setIsClosing] = useState(false);

  if (!dinosaur) return null;

  const eraSlug = getEraSlug(dinosaur);

  const facts = [...(dinosaur.dinosaur_facts || [])].sort(
    (a, b) => (a.order_index || 0) - (b.order_index || 0)
  );

  function handleClose() {
    if (isClosing) return;

    setIsClosing(true);

    window.setTimeout(() => {
      onClose?.();
    }, CLOSE_ANIMATION_DURATION);
  }

  return (
    <aside
      className={`dinosaur-popup dinosaur-popup--${eraSlug} ${
        isClosing ? "dinosaur-popup--closing" : ""
      }`}
      onPointerMove={updateEdgeGlow}
      onPointerLeave={resetEdgeGlow}
    >
      <div className="dinosaur-popup__close">
        <CloseButton
          onClick={handleClose}
          ariaLabel={getText(language, "Đóng popup", "Close popup")}
        />
      </div>

      <div className="dinosaur-popup__content">
        <header className="dinosaur-popup__header">
          <span className="dinosaur-popup__era">
            {translate(dinosaur?.eras?.name_vi, dinosaur?.eras?.name_en, language)}
          </span>

          <h2 className="dinosaur-popup__title">
            {translate(dinosaur.common_name_vi, dinosaur.common_name_en, language)}
          </h2>

          <p className="dinosaur-popup__subtitle">
            {dinosaur.scientific_name || dinosaur.common_name_en}
          </p>
        </header>

        <section className="dinosaur-popup__section">
          <p className="dinosaur-popup__description">
            {translate(
              dinosaur.description_vi,
              dinosaur.description_en,
              language
            )}
          </p>
        </section>

        <section className="dinosaur-popup__stats">
          <div
            className="dinosaur-popup__stat"
            onPointerMove={updateEdgeGlow}
            onPointerLeave={resetEdgeGlow}
          >
            <span>{getText(language, "Chế độ ăn", "Diet")}</span>
            <strong>{formatDiet(dinosaur.diet, language)}</strong>
          </div>

          <div
            className="dinosaur-popup__stat"
            onPointerMove={updateEdgeGlow}
            onPointerLeave={resetEdgeGlow}
          >
            <span>{getText(language, "Chiều dài", "Length")}</span>
            <strong>{formatValue(dinosaur.length_m, " m", language)}</strong>
          </div>

          <div
            className="dinosaur-popup__stat"
            onPointerMove={updateEdgeGlow}
            onPointerLeave={resetEdgeGlow}
          >
            <span>{getText(language, "Chiều cao", "Height")}</span>
            <strong>{formatValue(dinosaur.height_m, " m", language)}</strong>
          </div>

          <div
            className="dinosaur-popup__stat"
            onPointerMove={updateEdgeGlow}
            onPointerLeave={resetEdgeGlow}
          >
            <span>{getText(language, "Cân nặng", "Weight")}</span>
            <strong>{formatValue(dinosaur.weight_kg, " kg", language)}</strong>
          </div>
        </section>

        <section className="dinosaur-popup__section">
          <h3 className="dinosaur-popup__section-title">
            {getText(language, "Thông tin phát hiện", "Discovery Info")}
          </h3>

          <p className="dinosaur-popup__meta">
            <span>{getText(language, "Nơi phát hiện:", "Discovery:")}</span>{" "}
            {dinosaur.discovery_location ||
              getText(language, "Chưa rõ", "Unknown")}
          </p>

          <p className="dinosaur-popup__meta">
            <span>{getText(language, "Môi trường sống:", "Habitat:")}</span>{" "}
            {translate(dinosaur.habitat_vi, dinosaur.habitat_en, language)}
          </p>
        </section>

        <section className="dinosaur-popup__section">
          <div className="dinosaur-popup__section-head">
            <h3 className="dinosaur-popup__section-title">
              {getText(language, "Facts", "Facts")}
            </h3>
          </div>

          <DinosaurFactsCarousel facts={facts} language={language} />
        </section>

        <div className="dinosaur-popup__revive">
          <GlowButton onClick={() => onRevive?.(dinosaur)}>
            {getText(language, "Hồi sinh", "Revive")}
          </GlowButton>
        </div>
      </div>
    </aside>
  );
}