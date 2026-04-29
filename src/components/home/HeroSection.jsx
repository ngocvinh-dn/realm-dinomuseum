import React, { useRef, Suspense, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Dino from '../home/Dino';
import { useSiteAssets } from '../../hooks/useSiteAssets';

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

const HeroSection = ({ copy }) => {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const { assets } = useSiteAssets();
  const heroBg = assets.find((a) => a.asset_key === 'hero-bg' || a.asset_key === 'hero_background' || a.asset_type === 'image')?.public_url || '/images/museum_hero_bg.jpg';
  const heroVideo = assets.find((a) => a.asset_key === 'hero-bg-video' || a.asset_key === 'hero_video' || (a.asset_type === 'video' && a.slug === 'hero-video'))?.public_url || '/videos/dino-hero.mp4';
  const heroAudio = assets.find((a) => a.asset_key === 'hero-bg-audio' || a.asset_key === 'hero_music' || (a.asset_type === 'audio' && a.slug === 'hero-audio'))?.public_url || 'https://cdn.pixabay.com/audio/2022/10/30/audio_946f88d5c4.mp3';
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const smoothBgY = useSpring(bgY, { stiffness: 60, damping: 20 });
  const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startAudio = async () => {
      try {
        audio.volume = 1.5;
        await audio.play();
        localStorage.setItem('dino-audio-unlocked', '1');
      } catch {
        // ignored: browser blocks until user gesture
      }
    };

    if (localStorage.getItem('dino-audio-unlocked') === '1') {
      startAudio();
    }

    const unlockOnFirstGesture = () => {
      startAudio();
      window.removeEventListener('pointerdown', unlockOnFirstGesture);
      window.removeEventListener('keydown', unlockOnFirstGesture);
      window.removeEventListener('touchstart', unlockOnFirstGesture);
    };

    window.addEventListener('pointerdown', unlockOnFirstGesture, { passive: true });
    window.addEventListener('keydown', unlockOnFirstGesture);
    window.addEventListener('touchstart', unlockOnFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockOnFirstGesture);
      window.removeEventListener('keydown', unlockOnFirstGesture);
      window.removeEventListener('touchstart', unlockOnFirstGesture);
    };
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden" style={{ paddingTop: '80px' }}>
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top, rgba(245,158,11,0.14), transparent 55%), linear-gradient(180deg, rgba(10,8,4,0.35) 0%, rgba(10,8,4,0.65) 100%)' }} />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.4, filter: 'saturate(1.05) brightness(0.85)' }}
          poster={heroBg}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>
      <audio ref={audioRef} src={heroAudio} preload="auto" loop />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <CanvasErrorBoundary>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <Dino />
              <Environment preset="sunset" />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} enablePan={false} />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: `url('${heroBg}')`, backgroundSize: 'cover', backgroundPosition: 'center', y: smoothBgY, opacity: bgOpacity, scale: 1.1 }} />
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(10,8,4,0.5) 0%, rgba(10,8,4,0.1) 40%, rgba(10,8,4,0.6) 100%)' }} />
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.12) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none h-48" style={{ background: 'linear-gradient(to top, #0a0804, transparent)' }} />

      <motion.div className="relative z-10 max-w-5xl mx-auto px-6" style={{ y: smoothContentY, opacity: contentOpacity }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(12px)' }}>
            <motion.div className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(245,158,11,0.9)', fontFamily: 'DM Sans, sans-serif' }}>{copy.heroOpen}</span>
          </motion.div>
          <motion.h1 className="font-serif leading-[1.05] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#f5f0e8' }}>
            {copy.heroTitle}<br /><motion.span className="text-gradient-gold italic">{copy.heroSubtitle}</motion.span>
          </motion.h1>
          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
            <motion.button className="btn-amber-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => document.querySelector('#galleries')?.scrollIntoView({ behavior: 'smooth' })}>{copy.heroExplore}</motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
