import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import './ImageSequenceTransition.css';

const MAX_DPR = 2;

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

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const scale = Math.max(width / imageWidth, height / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
};

const ImageSequenceTransition = ({
  isOpen,
  onComplete,
  basePath = '/sequences',
  framePrefix = '0514_frame_',
  frameExtension = 'webp',
  frameCount = 462,
  fps = 30,
}) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const completeRef = useRef(false);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const frames = useMemo(
    () => Array.from({ length: frameCount }, (_, index) => {
      const frameNumber = String(index + 1).padStart(3, '0');
      return `${basePath}/${framePrefix}${frameNumber}.${frameExtension}`;
    }),
    [basePath, frameCount, frameExtension, framePrefix]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;
    let loaded = 0;
    const loadedImages = new Array(frames.length);

    completeRef.current = false;
    imagesRef.current = [];
    setReady(false);
    setProgress(0);

    frames.forEach((src, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (cancelled) return;
        loadedImages[index] = image;
        loaded += 1;
        setProgress(Math.round((loaded / frames.length) * 100));

        if (index === 0) {
          drawCover(canvasRef.current, image);
        }

        if (loaded === frames.length) {
          imagesRef.current = loadedImages;
          setReady(true);
        }
      };
      image.onerror = () => {
        if (cancelled) return;
        loaded += 1;
        setProgress(Math.round((loaded / frames.length) * 100));
        if (loaded === frames.length) {
          imagesRef.current = loadedImages.filter(Boolean);
          setReady(true);
        }
      };
      image.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [frames, isOpen]);

  useEffect(() => {
    if (!isOpen || !ready) return undefined;

    const images = imagesRef.current;
    if (!images.length) {
      onComplete?.();
      return undefined;
    }

    const duration = (images.length / fps) * 1000;
    const startedAt = performance.now();

    const play = (now) => {
      const elapsed = now - startedAt;
      const nextFrame = Math.min(images.length - 1, Math.floor((elapsed / 1000) * fps));
      frameRef.current = nextFrame;
      drawCover(canvasRef.current, images[nextFrame]);

      if (elapsed >= duration) {
        if (!completeRef.current) {
          completeRef.current = true;
          window.setTimeout(() => onComplete?.(), 180);
        }
        return;
      }

      rafRef.current = requestAnimationFrame(play);
    };

    const handleResize = () => {
      drawCover(canvasRef.current, images[frameRef.current]);
    };

    window.addEventListener('resize', handleResize);
    rafRef.current = requestAnimationFrame(play);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [fps, isOpen, onComplete, ready]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="image-sequence-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <canvas ref={canvasRef} className="image-sequence-transition__canvas" />
          <div className="image-sequence-transition__shade" />

          {!ready && (
            <div className="image-sequence-transition__loader">
              <p>Dang mo cong bao tang</p>
              <div className="image-sequence-transition__bar">
                <span style={{ width: `${progress}%` }} />
              </div>
              <strong>{progress}%</strong>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageSequenceTransition;
