import "./LoadingScreen.css";

export default function LoadingScreen({
  progress = 0,
  message = "Đang tải bảo tàng...",
}) {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="museum-loading-screen">
      <div className="loading-ambient" />
      <div className="loading-lines" />

      <div className="loading-center">
        <div className="loading-ring" />

        <p className="loading-message">{message}</p>

        <div className="loading-progress">
          <div
            className="loading-progress-fill"
            style={{ width: `${safeProgress}%` }}
          />
        </div>

        <span className="loading-percent">{safeProgress}%</span>
      </div>
    </div>
  );
}