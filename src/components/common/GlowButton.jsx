import "./GlowButton.css";

export default function GlowButton({ children, onClick, className = "" }) {
  return (
    <button
      className={`glow-button ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}