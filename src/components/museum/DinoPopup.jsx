import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DinoPopup.css";
import { prefetchEraAssets } from "../../services/assetPreloader";

export default function DinoPopup({ dino, onClose }) {
  const navigate = useNavigate();

  // Khi popup mở → kick prefetch era ngay (non-blocking)
  // Lúc user đọc thông tin thì GLB đã download xong
  useEffect(() => {
    if (!dino?.id) return;
    prefetchEraAssets(dino.id);
  }, [dino?.id]);

  if (!dino) return null;

  const handleGoToEra = () => {
    navigate(dino.route);
  };

  return (
    <div className={`dino-popup dino-popup--${dino.id}`}>
      <button className="dino-popup__close" onClick={onClose}>
        ×
      </button>

      <div className="dino-popup__era">{dino.era}</div>

      <h2 className="dino-popup__title">{dino.name}</h2>

      <p className="dino-popup__description">{dino.description}</p>

      <button className="dino-popup__action" onClick={handleGoToEra}>
        Đi tới {dino.era}
      </button>
    </div>
  );
}