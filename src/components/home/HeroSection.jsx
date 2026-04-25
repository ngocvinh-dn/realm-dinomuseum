import React from 'react';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Dino from './Dino';
import CanvasErrorBoundary from './CanvasErrorBoundary';

const HeroSection = () => {
  const scrollToTicket = () => {
    const el = document.querySelector('#dang-ky');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTour = () => {
    const el = document.querySelector('#virtual-tour');
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

      {/* Museum hall background image */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/museum_hero_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.35,
        }}
      />

      {/* Dramatic overlay layers */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(10,8,4,0.5) 0%, rgba(10,8,4,0.1) 40%, rgba(10,8,4,0.6) 100%)' }} />
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.12) 0%, transparent 60%)' }} />
      {/* Spotlight columns */}
      <div className="absolute top-0 left-1/4 w-px h-full z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.06), transparent)' }} />
      <div className="absolute top-0 right-1/4 w-px h-full z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.06), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none h-48"
        style={{ background: 'linear-gradient(to top, #0a0804, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Live Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(150,75,0,0.8)',
              color: '#ffffffff',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Bảo Tàng Đang Mở Cửa • Tham Quan 24/7
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="font-serif leading-[1.05] mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
          >
            Bước Vào Thế Giới{' '}
            <span className="text-gradient-gold">Hàng Triệu</span>
            <br />
            <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Năm Trước</span>
          </motion.h1>

          {/* Subheadline */}
          {/* <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.65)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Bảo tàng ảo immersive đầu tiên tại Việt Nam về khủng long & cổ sinh vật học.
            Không cần VR headset — chỉ cần trình duyệt của bạn.
          </motion.p> */}

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.button
              onClick={scrollToTicket}
              id="hero-cta-btn"
              className="btn-amber-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              🎟️ Đặt Vé Tham Quan Miễn Phí
            </motion.button>
            <motion.button
              onClick={scrollToTour}
              id="hero-tour-btn"
              className="btn-amber-outline"
              style={{ color: 'rgba(231, 221, 221, 0.8)', borderColor: 'rgba(245,240,232,0.2)' }}
              whileHover={{ color: '#ffffffff', borderColor: 'rgba(245, 244, 242, 0.5)', scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              ▶ Xem Preview Tour Ảo
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[
              { num: '12,000+', label: 'Lượt tham quan' },
              { num: '5 Phòng', label: 'Phòng trưng bày' },
              { num: '200+', label: 'Hiện vật số hóa' },
              { num: '100%', label: 'Tiếng Việt' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl font-bold font-serif"
                  style={{ color: '#fffefbff', fontFamily: 'Playfair Display, serif' }}
                >
                  {stat.num}
                </div>
                <div className="text-xs mt-0.5 tracking-wider uppercase" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  {stat.label}
                </div>
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
        <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Cuộn để khám phá
        </span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, #f59e0b, transparent)' }} />
      </motion.div>
    </section>
  );
};

export default HeroSection;