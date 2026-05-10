import { useNavigate } from "react-router-dom";
import "./DinoPopup.css";

export default function DinoPopup({ dino, onClose }) {
  const navigate = useNavigate();

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