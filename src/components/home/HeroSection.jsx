import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSiteAssets } from "../../hooks/useSiteAssets";

const HERO_POSTER_FALLBACK = "/images/hero-poster.webp";
const HERO_VIDEO_WEBM_FALLBACK =
  "https://pub-62f0025b68a84e4a8cc1f0fcd8cd8664.r2.dev/video/0514.webm";
const HERO_VIDEO_MP4_FALLBACK =
  "https://pub-62f0025b68a84e4a8cc1f0fcd8cd8664.r2.dev/video/0514.mp4";
const REVEAL_EASE = [0.22, 1, 0.36, 1];

function splitWords(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const mid = Math.ceil(words.length / 2);

  return {
    left: words.slice(0, mid).join(" "),
    right: words.slice(mid).join(" "),
  };
}

function pickAssetUrl(items, matchers, fallback = "") {
  return (
    items.find((item) => matchers.some((matcher) => matcher(item)))
      ?.public_url || fallback
  );
}

function uniqueVideoSources(sources) {
  const seen = new Set();

  return sources.filter((source) => {
    if (!source?.src || seen.has(source.src)) return false;
    seen.add(source.src);
    return true;
  });
}

const HeroSection = ({ copy }) => {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const { assets } = useSiteAssets();

  const heroPoster = useMemo(
    () =>
      pickAssetUrl(
        assets,
        [
          (item) => item.asset_key === "hero-bg-poster",
          (item) => item.slug === "hero-bg-poster",
          (item) =>
            item.asset_type === "image" && item.asset_key === "hero-poster",
        ],
        HERO_POSTER_FALLBACK,
      ),
    [assets],
  );

  const heroVideoWebm = useMemo(
    () =>
      pickAssetUrl(
        assets,
        [
          (item) => item.asset_key === "hero-bg-video-webm",
          (item) => item.slug === "hero-bg-video-webm",
        ],
        HERO_VIDEO_WEBM_FALLBACK,
      ),
    [assets],
  );

  const heroVideoMp4 = useMemo(
    () =>
      pickAssetUrl(
        assets,
        [
          (item) => item.asset_key === "hero-bg-video",
          (item) => item.slug === "hero-bg-video",
          (item) =>
            item.asset_type === "video" && item.asset_key === "hero-video",
        ],
        HERO_VIDEO_MP4_FALLBACK,
      ),
    [assets],
  );

  const mainTitle = useMemo(() => splitWords(copy.heroTitle), [copy.heroTitle]);

  const videoSources = useMemo(
    () =>
      uniqueVideoSources([
        { src: heroVideoMp4, type: "video/mp4" },
        { src: heroVideoWebm, type: "video/webm" },
      ]),
    [heroVideoMp4, heroVideoWebm],
  );

  const activeVideoSource = videoSources[videoSourceIndex] || null;

  useEffect(() => {
    setIsVideoReady(false);
    setVideoSourceIndex(0);
  }, [heroVideoMp4, heroVideoWebm]);

  useEffect(() => {
    if (!activeVideoSource || !videoRef.current) return undefined;

    const video = videoRef.current;
    video.load();

    const attemptPlayback = async () => {
      try {
        await video.play();
      } catch {}
    };

    attemptPlayback();
    return undefined;
  }, [activeVideoSource]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(el, {
        offset: -80,
        duration: 2.2,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleVideoError = () => {
    setIsVideoReady(false);
    setVideoSourceIndex((current) => {
      if (current >= videoSources.length - 1) return current;
      return current + 1;
    });
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#0a0804",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
          backgroundImage: `url("${heroPoster}")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {activeVideoSource ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            aria-hidden="true"
            onLoadedData={() => setIsVideoReady(true)}
            onCanPlay={() => setIsVideoReady(true)}
            onError={handleVideoError}
            className="w-full h-full object-cover"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: isVideoReady ? 1 : 0,
              transition: "opacity 0.7s ease",
            }}
            src={activeVideoSource.src}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, transparent 34%, rgba(10,8,4,0.68) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(10,8,4,0.58) 0%, rgba(10,8,4,0.14) 38%, rgba(10,8,4,0.18) 68%, rgba(10,8,4,0.74) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center top, rgba(245,158,11,0.14) 0%, transparent 55%)",
          }}
        />
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 24px 72px",
          textAlign: "center",
          overflow: "visible",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: REVEAL_EASE }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.45rem 1.1rem",
              borderRadius: "999px",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ade80",
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span
              style={{
                color: "rgba(245,158,11,0.9)",
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {copy.heroOpen}
            </span>
          </div>
        </motion.div>

        <div style={{ overflow: "visible" }}>
          <h1
            className="hero-title hero-title--split font-serif"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--theme-heading)",
              gap: "0.16em",
              marginBottom: "clamp(0.6rem,2vw,1.2rem)",
              overflow: "visible",
            }}
          >
            <span
              className="hero-title__line hero-title__main"
              aria-label={copy.heroTitle}
            >
              <motion.span
                className="hero-title__piece"
                initial={{ opacity: 0, x: "-26%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.14, duration: 0.85, ease: REVEAL_EASE }}
              >
                <span className="hero-title__piece-inner">
                  {mainTitle.left}
                </span>
              </motion.span>
              <motion.span
                className="hero-title__piece"
                initial={{ opacity: 0, x: "26%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.14, duration: 0.85, ease: REVEAL_EASE }}
              >
                <span className="hero-title__piece-inner">
                  {mainTitle.right}
                </span>
              </motion.span>
            </span>

            <motion.span
              className="hero-title__line hero-title__accent italic"
              aria-label={copy.heroSubtitle}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.9, ease: REVEAL_EASE }}
            >
              <span className="hero-title__piece">
                <span className="hero-title__piece-inner hero-title__subtitle-text">
                  {copy.heroSubtitle}
                </span>
              </span>
            </motion.span>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.7, ease: REVEAL_EASE }}
          style={{ marginTop: "clamp(1rem,2.5vw,1.75rem)" }}
        >
          <motion.button
            className="btn-amber-primary"
            onClick={() => scrollTo("dang-ky")}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 32px rgba(245,158,11,0.55)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {copy.heroExplore}
          </motion.button>
        </motion.div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to top, #0a0804, transparent)",
          zIndex: 8,
          pointerEvents: "none",
        }}
      />
    </section>
  );
};

export default HeroSection;
