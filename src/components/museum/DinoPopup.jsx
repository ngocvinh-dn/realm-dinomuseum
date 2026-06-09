import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DinoPopup.css";
import { prefetchEraAssets } from "../../services/assetPreloader";

export default function DinoPopup({ dino, onClose, language = "vi" }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!dino?.id) return;
    prefetchEraAssets(dino.id);
  }, [dino?.id]);

  if (!dino) return null;

  const handleGoToEra = () => {
    navigate(dino.route);
  };

  const t = (vi, en) => (language === "en" ? en : vi);

  const displayEra = language === "en" ? dino.eraEn || dino.era : dino.era;
  const displayDesc =
    language === "en"
      ? dino.descriptionEn || dino.description
      : dino.description;

  return (
    <div className={`dino-popup dino-popup--${dino.id}`}>
      <button className="dino-popup__close" onClick={onClose}>
      </button>

      <div className="dino-popup__era">{displayEra}</div>

      <h2 className="dino-popup__title">{dino.name}</h2>

      <p className="dino-popup__description">{displayDesc}</p>

      <button className="dino-popup__action" onClick={handleGoToEra}>
        {t("Đi tới", "Go to")} {displayEra}
      </button>
    </div>
  );
}
