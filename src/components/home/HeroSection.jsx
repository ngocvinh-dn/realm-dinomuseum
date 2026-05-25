import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteAssets } from '../../hooks/useSiteAssets';

gsap.registerPlugin(ScrollTrigger);

// ─── Cấu hình frame sequence ─────────────────────────────────
const TOTAL_FRAMES  = 462;
const FRAME_PREFIX  = '/sequences/0514_frame_';
const PRELOAD_BATCH = 80;
const getFrameSrc   = (i) => `${FRAME_PREFIX}${String(i).padStart(3, '0')}.webp`;

// ─── Split text helper ────────────────────────────────────────
function splitWords(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const mid   = Math.ceil(words.length / 2);
  return { left: words.slice(0, mid).join(' '), right: words.slice(mid).join(' ') };
}

const HeroSection = ({ copy }) => {
  // ── Refs ──────────────────────────────────────────────────
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  const audioRef   = useRef(null);
  const imagesRef  = useRef([]);
  const frameRef   = useRef({ val: 0 });
  const ctxRef     = useRef(null);
  const rafRef     = useRef(null);
  const loadedRef  = useRef(new Set());

  // Text refs cho GSAP entrance
  const badgeRef     = useRef(null);
  const titleLRef    = useRef(null);
  const titleRRef    = useRef(null);
  const subLRef      = useRef(null);
  const subRRef      = useRef(null);
  const ctaRef       = useRef(null);

  // ── State ─────────────────────────────────────────────────
  const [loadPct, setLoadPct]       = useState(0);
  const [isReady, setIsReady]       = useState(false);
  const [scrollFrac, setScrollFrac] = useState(0);

  const { assets } = useSiteAssets();
  const heroAudio  = assets.find(
    (a) => a.asset_key === 'hero-bg-audio' || a.asset_key === 'hero_music'
  )?.public_url || 'https://cdn.pixabay.com/audio/2022/10/30/audio_946f88d5c4.mp3';

  const mainTitle = splitWords(copy.heroTitle);
  const subtitle  = splitWords(copy.heroSubtitle);
  const controlsProgress = Math.min(scrollFrac / 0.18, 1);
  const textProgress = Math.min(scrollFrac / 0.22, 1);
  const badgeOffset = (1 - controlsProgress) * 90;
  const ctaOffset = (1 - controlsProgress) * 90;
  const controlsOpacity = isReady ? Math.min(controlsProgress * 1.4, 1) : 0;
  const titleOffset = (1 - textProgress) * 112;
  const subtitleOffset = (1 - textProgress) * 128;
  const titleOpacity = isReady ? Math.min(textProgress * 1.35, 1) : 0;
  const subtitleOpacity = isReady ? Math.min(textProgress * 1.4, 1) : 0;

  // ─── Vẽ frame lên canvas ─────────────────────────────────
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const ctx    = ctxRef.current;
    const img    = imagesRef.current[index];
    if (!canvas || !ctx || !img || !img.complete) return;

    const { width, height } = canvas;
    const iw = img.naturalWidth  || 1280;
    const ih = img.naturalHeight || 720;
    const scale = Math.max(width / iw, height / ih);
    const sw = iw * scale, sh = ih * scale;
    const sx = (width - sw) / 2, sy = (height - sh) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // ─── Resize canvas ────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctxRef.current = canvas.getContext('2d');
    drawFrame(Math.round(frameRef.current.val));
  }, [drawFrame]);

  // ─── Preload ảnh ─────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES + 1);
    let count = 0;

    const load = (i) => new Promise((res) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        count++;
        loadedRef.current.add(i);
        setLoadPct(Math.round((count / TOTAL_FRAMES) * 100));
        if (i === 1 && canvasRef.current) drawFrame(1);
        res();
      };
      img.src = getFrameSrc(i);
      imagesRef.current[i] = img;
    });

    const first = Array.from({ length: PRELOAD_BATCH }, (_, k) => k + 1);
    Promise.all(first.map(load)).then(() => {
      setIsReady(true);
      const rest = Array.from({ length: TOTAL_FRAMES - PRELOAD_BATCH }, (_, k) => k + PRELOAD_BATCH + 1);
      rest.forEach(load);
    });
  }, [drawFrame]);

  // ─── Resize listener ─────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ─── GSAP: ScrollTrigger ghim section + scrub frame ──────
  useEffect(() => {
    if (!isReady) return;
    const section = sectionRef.current;

    // Pin section và scrub qua 462 frames
    const tween = gsap.to(frameRef.current, {
      val: TOTAL_FRAMES,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight * 5}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameRef.current.val)));
          setScrollFrac(self.progress);
          if (loadedRef.current.has(idx)) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => drawFrame(idx));
          }
        },
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => { if (st.trigger === section) st.kill(); });
    };
  }, [isReady, drawFrame]);

  // ─── GSAP: Entrance animation chữ từ 2 bên vào giữa ─────────────────────────────
  useEffect(() => {
    return undefined;
    // khởi tạo trạng thái ẩn ban đầu ngay lập tức (trước khi animate)
    gsap.set(badgeRef.current,  { y: -28, opacity: 0 });
    gsap.set(ctaRef.current,    { y:  22, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1.2 },
      delay: 0.05,
    });

    tl
      // badge từ trên xuống
      .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.75, ease: 'back.out(1.4)' }, 0)
      // dòng 1: 2 từ trái / phải vào giữa cùng lúc
      // dòng 2: subtitle 20ms trễ hơn
      // button fade-up
      .to(ctaRef.current,    { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, 0.18);

    return () => tl.kill();
  }, [isReady]);

  // ─── Audio unlock ─────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const startAudio = async () => {
      try { audio.volume = 0.4; await audio.play(); localStorage.setItem('dino-audio-unlocked', '1'); } catch {}
    };
    if (localStorage.getItem('dino-audio-unlocked') === '1') startAudio();
    const unlock = () => { startAudio(); window.removeEventListener('pointerdown', unlock); };
    window.addEventListener('pointerdown', unlock, { passive: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  // ─── Scroll handler ───────────────────────────────────────
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -80, duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    // Section KHÔNG overflow:hidden — để chữ slide ra ngoài không bị cắt
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'visible',
        background: '#0a0804',
      }}
    >
      {/* ── Canvas + overlays — wrapper riêng có clip ── */}
      <div style={{
        position: 'absolute', inset: '-2px 0 0 0',
        overflow: 'hidden',
        zIndex: 0,
      }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            position: 'absolute', inset: 0,
            width: '100%', height: 'calc(100% + 2px)',
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,8,4,0.65) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(10,8,4,0.55) 0%, rgba(10,8,4,0.05) 35%, rgba(10,8,4,0.05) 65%, rgba(10,8,4,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.1) 0%, transparent 55%)' }} />
      </div>

      {/* ── Audio ── */}
      <audio ref={audioRef} src={heroAudio} preload="auto" loop />

      {/* ── Loader overlay ── */}
      {!isReady && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#0a0804', gap: '1.4rem',
        }}>
          <div style={{ fontSize: '3rem', animation: 'float-up-down 2s ease-in-out infinite' }}>🦕</div>
          <p style={{ color: '#fbbf24', fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85 }}>
            Đang tải...
          </p>
          <div style={{ width: '180px', height: '3px', background: 'rgba(245,158,11,0.15)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${loadPct}%`,
              background: 'linear-gradient(90deg,#f59e0b,#fbbf24)',
              borderRadius: '99px', transition: 'width 0.2s ease',
              boxShadow: '0 0 8px rgba(245,158,11,0.5)',
            }} />
          </div>
          <p style={{ color: 'rgba(245,240,232,0.3)', fontFamily: 'var(--font-body)', fontSize: '0.72rem' }}>{loadPct}%</p>
        </div>
      )}

      {/* ── Content overlay (title + button) ── */}
      {/* overflow:visible để chữ slide ra ngoài viền không bị cắt */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        paddingTop: '80px', textAlign: 'center',
        overflow: 'visible',              // ← quan trọng: không clip text
        pointerEvents: isReady ? 'auto' : 'none',
      }}>
        {/* Badge */}
        <div
          ref={badgeRef}
          style={{
            opacity: controlsOpacity,
            marginBottom: '2rem',
            transform: `translate3d(-${badgeOffset}%, 0, 0)`,
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.45rem 1.1rem', borderRadius: '999px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            backdropFilter: 'blur(12px)',
          }}>
            <motion.div
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span style={{ color: 'rgba(245,158,11,0.9)', fontFamily: 'var(--font-body)',
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {copy.heroOpen}
            </span>
          </div>
        </div>

        {/* Title — split từ 2 bên, overflow:visible để không cắt */}
        <h1
          className="hero-title hero-title--split font-serif"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--theme-heading)',
            gap: '0.16em',
            marginBottom: 'clamp(0.6rem,2vw,1.2rem)',
            overflow: 'visible',          // ← fix: không cắt chữ khi slide
          }}
        >
          <span className="hero-title__line hero-title__main" aria-label={copy.heroTitle}>
            <span
              ref={titleLRef}
              className="hero-title__piece"
              style={{ opacity: titleOpacity, transform: `translate3d(-${titleOffset}%, 0, 0)` }}
            >
              <span className="hero-title__piece-inner">{mainTitle.left}</span>
            </span>
            <span
              ref={titleRRef}
              className="hero-title__piece"
              style={{ opacity: titleOpacity, transform: `translate3d(${titleOffset}%, 0, 0)` }}
            >
              <span className="hero-title__piece-inner">{mainTitle.right}</span>
            </span>
          </span>

          {/* Subtitle — split từ 2 bên */}
          <span className="hero-title__line hero-title__accent italic" aria-label={copy.heroSubtitle}>
            <span
              ref={subLRef}
              className="hero-title__piece"
              style={{ opacity: subtitleOpacity, transform: `translate3d(-${subtitleOffset}%, 0, 0)` }}
            >
              <span className="hero-title__piece-inner text-gradient-gold">{subtitle.left}</span>
            </span>
            <span
              ref={subRRef}
              className="hero-title__piece"
              style={{ opacity: subtitleOpacity, transform: `translate3d(${subtitleOffset}%, 0, 0)` }}
            >
              <span className="hero-title__piece-inner text-gradient-gold">{subtitle.right}</span>
            </span>
          </span>
        </h1>

        {/* CTA Button */}
        <div
          ref={ctaRef}
          style={{
            opacity: controlsOpacity,
            marginTop: 'clamp(1rem,2.5vw,1.75rem)',
            transform: `translate3d(${ctaOffset}%, 0, 0)`,
          }}
        >
          <motion.button
            className="btn-amber-primary"
            onClick={() => scrollTo('dang-ky')}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(245,158,11,0.55)' }}
            whileTap={{ scale: 0.97 }}
          >
            {copy.heroExplore}
          </motion.button>
        </div>
      </div>

      {/* ── Scroll progress bar — dọc bên phải ── */}
      {isReady && (
        <div style={{
          position: 'absolute', right: '1.5rem', top: '50%',
          transform: 'translateY(-50%)', width: '3px', height: '110px',
          background: 'rgba(245,158,11,0.1)', borderRadius: '99px', overflow: 'hidden', zIndex: 15,
        }}>
          <motion.div style={{
            width: '100%',
            scaleY: scrollFrac,
            transformOrigin: 'top',
            height: '100%',
            background: 'linear-gradient(to bottom,#f59e0b,#fbbf24)',
            borderRadius: '99px',
            boxShadow: '0 0 6px rgba(245,158,11,0.5)',
          }} />
        </div>
      )}

      {/* ── Fade to next section ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to top, #0a0804, transparent)', zIndex: 8, pointerEvents: 'none',
      }} />
    </section>
  );
};

export default HeroSection;
