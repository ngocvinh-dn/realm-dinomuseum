import { useNavigate } from "react-router-dom";
import MuseumScene from "../components/museum/MuseumScene";

export default function MuseumPage() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
          border: "1px solid rgba(245,200,100,0.45)",
          borderRadius: "18px",
          padding: "12px 24px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "800",
          backdropFilter: "blur(8px)",
          letterSpacing: "0.05em",
          color: "#f5f0e8",
          background:
            "linear-gradient(135deg, rgba(180,120,30,0.55), rgba(0,0,0,0.65))",
        }}
      >
        ←
      </button>

      <MuseumScene />
    </div>
  );
}
