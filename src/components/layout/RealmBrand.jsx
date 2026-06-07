import React from "react";

const RealmBrand = ({
  className = "",
  logoSize = 70,
  titleClassName = "text-lg",
  subtitleFontSize = 14,
  subtitleLetterSpacing = "1px",
  subtitleOpacity = 0.6,
}) => (
  <div className={`flex items-center gap-3 ${className}`.trim()}>
    <img
      src="/icons/realm-logo.png"
      alt="R.E.A.L.M logo"
      style={{
        height: `${logoSize}px`,
        width: `${logoSize}px`,
        objectFit: "contain",
        filter: "drop-shadow(0 0 8px rgba(245,158,11,0.4))",
      }}
    />
    <div className="flex flex-col">
      <span
        className={`font-serif font-bold leading-none ${titleClassName}`.trim()}
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--theme-accent-bright)",
          marginBottom: "1px",
        }}
      >
        R.E.A.L.M
      </span>
      <span
        className="leading-none"
        style={{
          color: "rgba(245,158,11,0.5)",
          fontFamily: "var(--font-body)",
          fontSize: `${subtitleFontSize}px`,
          letterSpacing: subtitleLetterSpacing,
          opacity: subtitleOpacity,
          marginBottom: "1px",
          marginTop: "5px",
        }}
      >
        Research Exhibition
      </span>
      <span
        className="leading-none"
        style={{
          color: "rgba(245,158,11,0.5)",
          fontFamily: "var(--font-body)",
          fontSize: `${subtitleFontSize}px`,
          letterSpacing: subtitleLetterSpacing,
          opacity: subtitleOpacity,
        }}
      >
        Of Ancient Life Models
      </span>
    </div>
  </div>
);

export default RealmBrand;
