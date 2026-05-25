import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── CẤU HÌNH ────────────────────────────────────────────────
const TOTAL_FRAMES = 462;
const FRAME_PREFIX = '/sequences/0514_frame_';
const PRELOAD_BATCH = 60; // số frame tải trước ban đầu (cho "above fold")

// Tạo đường dẫn frame theo số thứ tự (1 → "001", 12 → "012", ...)
const getFrameSrc = (i) =>
  `${FRAME_PREFIX}${String(i).padStart(3, '0')}.webp`;

// ─── COMPONENT ───────────────────────────────────────────────
// Scroll mượt đến section
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -80, duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const DinoScrollCanvas = () => {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const imagesRef   = useRef([]);
  const frameRef    = useRef({ val: 0 });
  const ctxRef      = useRef(null);
  const rafRef      = useRef(null);
  const loadedRef   = useRef(new Set());
  const titleLeftRef  = useRef(null);
  const titleRightRef = useRef(null);
  const subtitleRef   = useRef(null);
  const btnRef        = useRef(null);

  const [loadPct, setLoadPct]           = useState(0);
  const [isReady, setIsReady]           = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);

  // ─── Vẽ frame lên canvas ─────────────────────────────────
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const ctx    = ctxRef.current;
    const img    = imagesRef.current[index];
    if (!canvas || !ctx || !img || !img.complete) return;

    const { width, height } = canvas;

    // Cover: giữ tỉ lệ ảnh, cắt cho đầy canvas
    const iw = img.naturalWidth  || img.width  || 1280;
    const ih = img.naturalHeight || img.height || 720;
    const scale = Math.max(width / iw, height / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (width  - sw) / 2;
    const sy = (height - sh) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // ─── Resize canvas theo màn hình ─────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctxRef.current = canvas.getContext('2d');
    drawFrame(Math.round(frameRef.current.val));
  }, [drawFrame]);

  // ─── Tải ảnh bất đồng bộ theo batch ─────────────────────
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES + 1); // index 1..TOTAL_FRAMES
    let loadedCount = 0;

    const loadImage = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = img.onerror = () => {
          loadedCount++;
          loadedRef.current.add(i);
          setLoadPct(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          // vẽ ngay frame đầu khi sẵn sàng
          if (i === 1 && canvasRef.current) drawFrame(1);
          resolve();
        };
        img.src = getFrameSrc(i);
        imagesRef.current[i] = img;
      });

    // Tải batch đầu (frame 1‥PRELOAD_BATCH) → khởi động nhanh
    const firstBatch = Array.from({ length: PRELOAD_BATCH }, (_, k) => k + 1);
    Promise.all(firstBatch.map(loadImage)).then(() => {
      setIsReady(true);
      // Tải phần còn lại ở background
      const rest = Array.from(
        { length: TOTAL_FRAMES - PRELOAD_BATCH },
        (_, k) => k + PRELOAD_BATCH + 1
      );
      rest.forEach(loadImage);
    });
  }, [drawFrame]);

  // ─── Resize listener ─────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ─── Animate chữ từ 2 bên vào giữa khi isReady ───────────
  useEffect(() => {
    if (!isReady) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    tl.fromTo(titleLeftRef.current,  { x: -80, opacity: 0 }, { x: 0, opacity: 1 })
      .fromTo(titleRightRef.current, { x:  80, opacity: 0 }, { x: 0, opacity: 1 }, '<0.05')
      .fromTo(subtitleRef.current,   { y:  20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.5')
      .fromTo(btnRef.current,        { y:  16, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.5');
    return () => tl.kill();
  }, [isReady]);

  // ─── GSAP ScrollTrigger ghim + tween frame ───────────────
  useEffect(() => {
    if (!isReady) return;

    const section = sectionRef.current;

    const tween = gsap.to(frameRef.current, {
      val: TOTAL_FRAMES,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight * 4}`,   // 4× chiều cao màn hình để cuộn
        pin: true,
        scrub: 0.5,                            // lag nhỏ → mượt hơn
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.max(1, Math.min(
            TOTAL_FRAMES,
            Math.round(frameRef.current.val)
          ));
          setCurrentFrame(idx);

          // Chỉ vẽ nếu frame đã tải xong
          if (loadedRef.current.has(idx)) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => drawFrame(idx));
          }
        },
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, [isReady, drawFrame]);

  // ─── Cleanup RAF ─────────────────────────────────────────
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ─── Progress bar tải ảnh ────────────────────────────────
  const showLoader = loadPct < 100;

  return (
    <section
      ref={sectionRef}
      id="dino-canvas"
      style={{
        position:   'relative',
        width:      '100%',
        height:     '100vh',
        background: '#0a0804',
        overflow:   'hidden',
      }}
    >
      {/* Canvas toàn màn hình */}
      <canvas
        ref={canvasRef}
        style={{
          display:  'block',
          width:    '100%',
          height:   '100%',
          opacity:  isReady ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Gradient overlay — tạo chiều sâu */}
      <div
        style={{
          position:   'absolute',
          inset:       0,
          background: 'linear-gradient(to bottom, rgba(10,8,4,0.35) 0%, transparent 25%, transparent 75%, rgba(10,8,4,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette viền */}
      <div
        style={{
          position:   'absolute',
          inset:       0,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(10,8,4,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Loader overlay */}
      {showLoader && (
        <div
          style={{
            position:       'absolute',
            inset:           0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'rgba(10,8,4,0.92)',
            zIndex:          10,
            gap:             '1.5rem',
          }}
        >
          {/* Dino icon pulse */}
          <div style={{ fontSize: '3.5rem', animation: 'float-up-down 2s ease-in-out infinite' }}>
            🦕
          </div>
          <p style={{
            color:       '#fbbf24',
            fontFamily:  'var(--font-heading)',
            fontWeight:  700,
            fontSize:    '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            opacity:     0.9,
          }}>
            Đang tải cảnh quay
          </p>
          {/* Progress bar */}
          <div style={{
            width:         '200px',
            height:        '3px',
            background:    'rgba(245,158,11,0.15)',
            borderRadius:  '99px',
            overflow:      'hidden',
          }}>
            <div style={{
              height:     '100%',
              width:      `${loadPct}%`,
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              borderRadius: '99px',
              transition: 'width 0.2s ease',
              boxShadow:  '0 0 8px rgba(245,158,11,0.6)',
            }} />
          </div>
          <p style={{
            color:      'rgba(245,240,232,0.35)',
            fontFamily: 'var(--font-body)',
            fontSize:   '0.75rem',
          }}>
            {loadPct}%
          </p>
        </div>
      )}

      {/* HUD overlay khi ready */}
      {isReady && (
        <>
          {/* ── Tiêu đề section — giữa, chữ từ 2 bên vào ── */}
          <div style={{
            position:       'absolute',
            top:            '50%',
            left:           '50%',
            transform:      'translate(-50%, -50%)',
            textAlign:      'center',
            pointerEvents:  'none',
            zIndex:          5,
            opacity: currentFrame <= 8 ? 1 : 0,
            transition:     'opacity 0.6s ease',
          }}>
            {/* Label nhỏ */}
            <p ref={subtitleRef} style={{
              color:         '#f59e0b',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.7rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom:  '0.8rem',
              opacity:       0,
            }}>
              Hành trình tiến hóa
            </p>
            {/* Chữ lớn split từ 2 bên */}
            <div style={{
              display:        'flex',
              alignItems:     'baseline',
              justifyContent: 'center',
              gap:            '0.3em',
              overflow:       'hidden',
            }}>
              <span ref={titleLeftRef} style={{
                display:    'block',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize:   'clamp(2rem, 5vw, 4rem)',
                color:      '#f5f0e8',
                textShadow: '0 2px 30px rgba(0,0,0,0.9)',
                opacity:    0,
              }}>
                Khủng long
              </span>
              <span ref={titleRightRef} style={{
                display:    'block',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize:   'clamp(2rem, 5vw, 4rem)',
                background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                opacity:    0,
              }}>
                sống lại
              </span>
            </div>
            {/* Button scroll đến đăng ký */}
            <button
              ref={btnRef}
              onClick={() => scrollTo('dang-ky')}
              style={{
                marginTop:     '2rem',
                padding:       '0.85rem 2.2rem',
                background:    'linear-gradient(135deg,#f59e0b,#d97706)',
                color:         '#0a0804',
                fontFamily:    'var(--font-body)',
                fontWeight:    700,
                fontSize:      '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border:        'none',
                borderRadius:  '999px',
                cursor:        'pointer',
                boxShadow:     '0 4px 24px rgba(245,158,11,0.4)',
                pointerEvents: 'all',
                opacity:       0,
                transition:    'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(245,158,11,0.4)';
              }}
            >
              Đăng ký vé miễn phí
            </button>
          </div>

          {/* ── Caption thay đổi theo frame ── */}
          {(() => {
            const pct = currentFrame / TOTAL_FRAMES;
            let caption = '';
            if (pct < 0.25) caption = '65 triệu năm trước — bình minh của thời đại khủng long';
            else if (pct < 0.5) caption = 'Kỷ Jura — những gã khổng lồ thống trị Trái Đất';
            else if (pct < 0.75) caption = 'Kỷ Phấn Trắng — đỉnh cao của sự tiến hóa';
            else caption = 'Một kỷ nguyên vĩ đại... sắp biến mất mãi mãi';

            return (
              <div style={{
                position:       'absolute',
                bottom:         '5rem',
                left:           '50%',
                transform:      'translateX(-50%)',
                textAlign:      'center',
                pointerEvents:  'none',
                transition:     'opacity 0.8s ease',
                opacity: currentFrame > 8 && currentFrame < TOTAL_FRAMES - 5 ? 1 : 0,
              }}>
                <p style={{
                  color:       'rgba(245,240,232,0.72)',
                  fontFamily:  'var(--font-body)',
                  fontStyle:   'italic',
                  fontSize:    '0.82rem',
                  letterSpacing: '0.04em',
                  textShadow:  '0 2px 12px rgba(0,0,0,0.8)',
                  maxWidth:    '480px',
                  margin:      '0 auto',
                }}>
                  {caption}
                </p>
              </div>
            );
          })()}

          {/* ── Progress bar dọc bên phải ── */}
          <div style={{
            position:    'absolute',
            right:       '1.5rem',
            top:         '50%',
            transform:   'translateY(-50%)',
            width:       '3px',
            height:      '110px',
            background:  'rgba(245,158,11,0.1)',
            borderRadius: '99px',
            overflow:    'hidden',
          }}>
            <div style={{
              width:       '100%',
              height:      `${(currentFrame / TOTAL_FRAMES) * 100}%`,
              background:  'linear-gradient(to bottom, #f59e0b, #fbbf24)',
              borderRadius: '99px',
              transition:  'height 0.1s linear',
              boxShadow:   '0 0 6px rgba(245,158,11,0.5)',
            }} />
          </div>

          {/* ── Số frame nhỏ (developer-friendly) ── */}
          <div style={{
            position:   'absolute',
            right:      '2rem',
            bottom:     '1.4rem',
            color:      'rgba(245,158,11,0.35)',
            fontFamily: 'monospace',
            fontSize:   '0.6rem',
            letterSpacing: '0.06em',
            pointerEvents: 'none',
          }}>
            {String(currentFrame).padStart(3, '0')} / {TOTAL_FRAMES}
          </div>
        </>
      )}
    </section>
  );
};

export default DinoScrollCanvas;
