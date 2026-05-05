import React, { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Dino from '../home/Dino';
import { useParallax } from '../../hooks/useParallax';

// Bẫy lỗi cho Canvas 3D — tránh crash toàn trang nếu WebGL không hỗ trợ
class CanvasErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

const HeroSection = () => {
  // Ref cho container section — dùng để theo dõi vị trí scroll
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  // Theo dõi tiến trình scroll của section so với viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Hiệu ứng parallax: ảnh nền di chuyển xuống 25% khi scroll qua hero
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  // Nội dung hero di chuyển lên nhẹ khi scroll — tạo cảm giác tách lớp
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Spring để làm mượt các chuyển động parallax
  const smoothBgY = useSpring(bgY, { stiffness: 60, damping: 20 });
  const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 25 });

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      {/* Canvas 3D mô hình khủng long nền (rất mờ) */}
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

      {/* Ảnh nền sảnh bảo tàng — có parallax scroll */}
      <motion.div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/museum_hero_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: smoothBgY,        // Parallax: di chuyển chậm hơn trang
          opacity: bgOpacity,  // Mờ dần khi scroll xuống
          scale: 1.1,          // Scale nhẹ để không bị lộ viền khi di chuyển
        }}
      />

      {/* Các lớp gradient tạo hiệu ứng rạng đông và chùm sáng */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(10,8,4,0.5) 0%, rgba(10,8,4,0.1) 40%, rgba(10,8,4,0.6) 100%)' }} />
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.12) 0%, transparent 60%)' }} />
      {/* Cột ánh sáng spotlight dọc hai bên */}
      <div className="absolute top-0 left-1/4 w-px h-full z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.06), transparent)' }} />
      <div className="absolute top-0 right-1/4 w-px h-full z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.06), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none h-48"
        style={{ background: 'linear-gradient(to top, #0a0804, transparent)' }} />

      {/* Nội dung chính và tiêu đề hero — có parallax nhẹ lên trên */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ y: smoothContentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Huy hiệu trạng thái mở cửa bảo tàng */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#4ade80' }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(245,158,11,0.9)', fontFamily: 'DM Sans, sans-serif' }}>
              Museum Open Now • Visit 24/7
            </span>
          </motion.div>

          {/* Tiêu đề chính Hero */}
          <motion.h1
            className="font-serif leading-[1.05] mb-6"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              color: '#f5f0e8',
              textShadow: '0 4px 40px rgba(245,158,11,0.15)',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Dinosaur Museum
            <br />
            <motion.span
              className="text-gradient-gold italic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
            >
              The Prehistoric Era
            </motion.span>
          </motion.h1>

          {/* Các nút CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <motion.button
              className="btn-amber-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.2)' }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ['0 4px 20px rgba(245,158,11,0.35)', '0 8px 40px rgba(245,158,11,0.55)', '0 4px 20px rgba(245,158,11,0.35)'] }}
              transition={{ boxShadow: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }}
              onClick={() => {
                const t = document.querySelector('#dang-ky');
                if (t) window.__lenis ? window.__lenis.scrollTo(t, { offset: -80, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
              }}
              id="hero-cta-btn"
            >
              🏟️ Book a Free Ticket
            </motion.button>
            <motion.button
              className="btn-amber-outline"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const t = document.querySelector('#galleries');
                if (t) window.__lenis ? window.__lenis.scrollTo(t, { offset: -80, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
              }}
              id="hero-explore-btn"
            >
              🔭 Explore the Museum
            </motion.button>
          </motion.div>

          {/* Hàng số liệu thống kê */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[
              { value: '275+', label: 'Digital Specimens' },
              { value: '66M', label: 'Years of History' },
              { value: '5', label: 'Exhibition Halls' },
              { value: '24/7', label: 'Open to Visit' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
              >
                <div className="font-serif text-2xl font-bold"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#fbbf24' }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5 uppercase tracking-widest"
                  style={{ color: 'rgba(245,240,232,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mũi tên cuộn xuống (scroll indicator) */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
      >
        <span className="text-xs tracking-widest uppercase"
          style={{ color: 'rgba(245,158,11,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
          Scroll Down
        </span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.5), transparent)' }} />
      </motion.div>
    </section>
  );
};

export default HeroSection;