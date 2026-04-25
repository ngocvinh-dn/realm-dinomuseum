import React from 'react';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Dino from './Dino';
import CanvasErrorBoundary from './CanvasErrorBoundary';

const HeroSection = ({ onDownloadClick }) => {
  const scrollToDownload = () => {
    const el = document.querySelector('#download');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CanvasErrorBoundary>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <Dino />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Hero background image overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/hero_dino_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.22,
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.08) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none h-64"
        style={{ background: 'linear-gradient(to top, #0a0804, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              // background: 'rgba(245,158,11,0.1)',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(150,75,0,1)',
              color: '#fbbf24',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Bộ Ebook Khủng Long Tiếng Việt — 2026
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
          >
            Bí ẩn{' '}
            <span className="text-gradient-gold">66 Triệu Năm</span>
            <br />
            <span style={{ color: 'rgba(245,240,232,0.9)' }}>Nay Trong</span>{' '}
            <span className="italic" style={{ color: 'rgba(245,240,232,0.6)' }}>Tầm Tay Bạn.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.6)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Bộ tài liệu PDF chuyên sâu về khủng long và khám phá cổ sinh vật học bằng tiếng Việt,
            được biên soạn từ nguồn học thuật uy tín. Dành cho người đam mê khoa học .
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.button
              onClick={scrollToDownload}
              id="hero-cta-btn"
              className="btn-amber-primary text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              🦕 Tải Ebook Miễn Phí
            </motion.button>
            <motion.a
              href="#benefits"
              onClick={(e) => { e.preventDefault(); document.querySelector('#benefits')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-sm font-medium flex items-center gap-2 cursor-pointer"
              style={{ color: 'rgba(245,240,232,0.55)' }}
              whileHover={{ color: '#f59e0b' }}
            >
              Tìm hiểu thêm
              <span>↓</span>
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex items-center justify-center gap-8 mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[
              { num: '12,847+', label: 'Người đã tải' },
              { num: '5 PDF', label: 'Tài liệu chuyên sâu' },
              { num: '100%', label: 'Tiếng Việt' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold font-serif" style={{ color: '#fbbf24', fontFamily: 'Playfair Display, serif' }}>{stat.num}</div>
                <div className="text-xs mt-0.5 tracking-wider uppercase" style={{ color: 'rgba(245,240,232,0.4)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.5)' }}>Cuộn để khám phá</span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, #f59e0b, transparent)' }} />
      </motion.div>
    </section>
  );
};

export default HeroSection;