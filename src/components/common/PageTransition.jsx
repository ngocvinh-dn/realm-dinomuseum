/**
 * PageTransition.jsx
 *
 * Bọc children, khi pathname thay đổi sẽ:
 * 1. Fade OUT nhanh (0.2s)
 * 2. Navigate sang route mới (React Router thực hiện)
 * 3. Fade IN (0.3s)
 *
 * Không cần thư viện thêm, chỉ dùng CSS transition + useLocation.
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [phase, setPhase] = useState("in"); // "in" | "out"
  const timerRef = useRef(null);

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    // Bắt đầu fade out
    setPhase("out");

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Sau khi fade out xong, swap location → React renders new page
      setDisplayLocation(location);
      setPhase("in");
    }, 180); // khớp với transition duration bên dưới

    return () => clearTimeout(timerRef.current);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out"
          ? "opacity 0.18s ease-out"
          : "opacity 0.3s ease-in",
        willChange: "opacity",
      }}
    >
      {children}
    </div>
  );
}
