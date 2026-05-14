import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollCanvasSequence.css';

gsap.registerPlugin(ScrollTrigger);

const MAX_DPR = 2;

const getDocumentTop = (element) => {
  let top = 0;
  let current = element;

  while (current) {
    top += current.offsetTop || 0;
    current = current.offsetParent;
  }

  return top;
};

const drawCover = (canvas, image) => {
  if (!canvas || !image) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const canvasWidth = Math.round(width * dpr);
  const canvasHeight = Math.round(height * dpr);

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  if (!imageWidth || !imageHeight) return;

  const scale = Math.max(width / imageWidth, height / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
};

const clearCanvas = (canvas) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const canvasWidth = Math.round(width * dpr);
  const canvasHeight = Math.round(height * dpr);

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
};

const ScrollCanvasSequence = ({
  triggerRef,
  pinTargetRef,
  basePath = '/sequences',
  framePrefix = '0514_frame_',
  frameExtension = 'webp',
  frameCount = 462,
  scrollEnd = 'bottom bottom',
  opacity = 1,
  preloadConcurrency = 4,
  preloadRadius = 14,
  initialPreloadCount = 48,
  pinSpacing = false,
}) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const lastImageRef = useRef(null);
  const renderRafRef = useRef(null);

  const frames = useMemo(
    () => Array.from({ length: frameCount }, (_, index) => {
      const frameNumber = String(index + 1).padStart(3, '0');
      return `${basePath}/${framePrefix}${frameNumber}.${frameExtension}`;
    }),
    [basePath, frameCount, frameExtension, framePrefix]
  );

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const trigger = triggerRef?.current;
    if (!canvas || !trigger || frames.length === 0) return undefined;

    let cancelled = false;
    let activeLoads = 0;
    let nextLoadIndex = 0;
    let scrollTickFrame = null;
    let refreshFrame = null;
    const refreshTimers = [];
    let startScroll = 0;
    let scrollDistance = 1;
    const loaded = new Set();
    const loading = new Set();
    const queued = new Set();
    const loadQueue = [];
    const images = new Array(frames.length);
    imagesRef.current = images;

    const getScrollY = () => {
      const nativeScroll = window.scrollY ?? window.pageYOffset ?? 0;
      const lenis = window.__lenis;
      const lenisScroll = lenis?.animatedScroll ?? lenis?.actualScroll;

      if (nativeScroll > 0 || !Number.isFinite(lenisScroll)) {
        return nativeScroll;
      }

      return lenisScroll;
    };

    const measureScrollRange = () => {
      startScroll = getDocumentTop(trigger);
      scrollDistance = Math.max(1, trigger.offsetHeight - window.innerHeight);
    };

    const drawNearest = (index) => {
      const exact = images[index];
      if (exact) {
        lastImageRef.current = exact;
        drawCover(canvas, exact);
        return;
      }

      clearCanvas(canvas);
    };

    const requestDraw = (index) => {
      const safeIndex = Math.max(0, Math.min(frames.length - 1, Math.round(index)));
      frameRef.current = safeIndex;
      canvas.dataset.currentFrame = String(safeIndex + 1);
      if (frames[safeIndex]) {
        canvas.parentElement.style.backgroundImage = `url("${frames[safeIndex]}")`;
      }

      if (renderRafRef.current) return;
      renderRafRef.current = requestAnimationFrame(() => {
        renderRafRef.current = null;
        drawNearest(frameRef.current);
      });
    };

    const pumpQueue = () => {
      if (cancelled) return;

      while (activeLoads < preloadConcurrency && loadQueue.length > 0) {
        const index = loadQueue.shift();
        queued.delete(index);

        if (index < 0 || index >= frames.length || loaded.has(index) || loading.has(index)) continue;

        activeLoads += 1;
        loading.add(index);
        const image = new Image();
        image.decoding = 'async';
        image.fetchPriority = index <= frameRef.current + preloadRadius && index >= frameRef.current - preloadRadius ? 'high' : 'low';
        image.onload = () => {
          activeLoads -= 1;
          loading.delete(index);
          loaded.add(index);
          images[index] = image;

          if (cancelled) return;

          if (!lastImageRef.current || index === frameRef.current) {
            lastImageRef.current = image;
            drawCover(canvas, image);
          }

          pumpQueue();
        };
        image.onerror = () => {
          activeLoads -= 1;
          loading.delete(index);
          pumpQueue();
        };
        image.src = frames[index];
      }
    };

    const queueFrame = (index, priority = false) => {
      if (index < 0 || index >= frames.length || loaded.has(index) || loading.has(index)) return;

      if (queued.has(index)) {
        if (priority) {
          const queuedIndex = loadQueue.indexOf(index);
          if (queuedIndex > 0) {
            loadQueue.splice(queuedIndex, 1);
            loadQueue.unshift(index);
          }
        }
        return;
      }

      queued.add(index);
      if (priority) {
        loadQueue.unshift(index);
      } else {
        loadQueue.push(index);
      }

      pumpQueue();
    };

    const loadFrame = (index, priority = false) => {
      queueFrame(index, priority);
    };

    const loadAround = (index) => {
      loadFrame(index, true);
      for (let offset = 1; offset <= preloadRadius; offset += 1) {
        loadFrame(index + offset, offset <= 3);
        loadFrame(index - offset, offset <= 3);
      }
    };

    const pumpPreload = () => {
      if (cancelled) return;

      const warmPreloadLimit = Math.min(frames.length, initialPreloadCount);

      while (nextLoadIndex < warmPreloadLimit) {
        queueFrame(nextLoadIndex, nextLoadIndex < 12);
        nextLoadIndex += 1;
      }
    };

    const renderProgress = (progress) => {
      const clamped = Math.max(0, Math.min(1, progress || 0));
      const frame = clamped * (frames.length - 1);
      loadAround(Math.round(frame));
      requestDraw(frame);
    };

    const renderFromScroll = () => {
      const progress = (getScrollY() - startScroll) / scrollDistance;
      renderProgress(progress);
    };

    loadFrame(0, true);
    requestDraw(0);
    pumpPreload();

    const pinTarget = pinTargetRef?.current || trigger;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger,
        start: 'top top',
        end: scrollEnd,
        pin: pinTarget,
        pinSpacing,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measureScrollRange();
          renderFromScroll();
        },
      });
    }, trigger);

    const tickSequence = () => {
      if (cancelled) return;
      ScrollTrigger.update();
      renderFromScroll();
      scrollTickFrame = requestAnimationFrame(tickSequence);
    };

    const handleResize = () => {
      measureScrollRange();
      drawNearest(frameRef.current);
      ScrollTrigger.refresh();
      renderFromScroll();
    };

    const handleScroll = () => {
      ScrollTrigger.update();
      renderFromScroll();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.__lenis?.on?.('scroll', handleScroll);

    measureScrollRange();
    renderFromScroll();
    scrollTickFrame = requestAnimationFrame(tickSequence);
    refreshFrame = requestAnimationFrame(() => {
      measureScrollRange();
      ScrollTrigger.refresh();
      renderFromScroll();
    });

    [180, 700, 1400].forEach((delay) => {
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        measureScrollRange();
        ScrollTrigger.refresh();
        renderFromScroll();
      }, delay);
      refreshTimers.push(timer);
    });

    return () => {
      cancelled = true;
      if (refreshFrame) cancelAnimationFrame(refreshFrame);
      if (scrollTickFrame) cancelAnimationFrame(scrollTickFrame);
      if (renderRafRef.current) cancelAnimationFrame(renderRafRef.current);
      refreshTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.__lenis?.off?.('scroll', handleScroll);
      ctx.revert();
    };
  }, [frames, initialPreloadCount, pinSpacing, pinTargetRef, preloadConcurrency, preloadRadius, scrollEnd, triggerRef]);

  return (
    <div
      className="scroll-canvas-sequence"
      style={{
        opacity,
        backgroundImage: frames[0] ? `url("${frames[0]}")` : undefined,
      }}
    >
      <canvas ref={canvasRef} className="scroll-canvas-sequence__canvas" />
    </div>
  );
};

export default ScrollCanvasSequence;
