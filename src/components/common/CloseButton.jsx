import "./CloseButton.css";

export default function CloseButton({
  onClick,
  ariaLabel = "Đóng",
  className = "",
}) {
  return (
    <button
      className={`close-button ${className}`.trim()}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="close-button__symbol"></span>
    </button>
  );
}