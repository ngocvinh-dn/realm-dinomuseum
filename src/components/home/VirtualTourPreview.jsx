import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';

// Static image data for each tour view — each view corresponds to an exhibition room
const tourViews = [
  {
    id: 'main-hall',
    title: 'Main Hall — T-Rex',
    desc: 'The massive T-Rex "Sue" skeleton stands at the center of the hall. Rotate and zoom in to explore every bone detail.',
    bgColor: 'linear-gradient(135deg, rgba(17,14,8,1) 0%, rgba(26,18,8,0.9) 100%)',
    highlight: 'Floor area: 800 m²',
    dinoImage: '/images/dino_trex.png',
    dinoLabel: 'Tyrannosaurus Rex',
    fallbackEmoji: '🦖',
    objectPosition: 'center top',
  },
  {
    id: 'theropoda',
    title: 'Theropoda Room — Raptor',
    desc: 'Velociraptor — the most intelligent predator of the Cretaceous. Rotate the 3D model to see the pelvic bone structure.',
    bgColor: 'linear-gradient(135deg, rgba(30,10,10,0.9) 0%, rgba(17,14,8,1) 100%)',
    highlight: '48 specimens',
    dinoImage: '/images/dino_velociraptor.png',
    dinoLabel: 'Velociraptor',
    fallbackEmoji: '🦕',
    objectPosition: 'center center',
  },
  {
    id: 'fossil-vn',
    title: 'Brachiosaurus Hall',
    desc: 'Brachiosaurus — the tallest giant of the Jurassic period. Its 9m neck stretches up into the tree canopy. True-to-scale model.',
    bgColor: 'linear-gradient(135deg, rgba(10,20,10,0.9) 0%, rgba(17,14,8,1) 100%)',
    highlight: '23 local specimens',
    dinoImage: '/images/dino_brachiosaurus.png',
    dinoLabel: 'Brachiosaurus',
    fallbackEmoji: '🦕',
    objectPosition: 'center 20%',
  },
];

// Component hiển thị ảnh khủng long trong khung tour ảo
const SketchfabViewer = ({ dinoImage, dinoLabel, fallbackEmoji, objectPosition }) => {
  // Nếu không có ảnh thì hiển thị emoji thay thế
  if (!dinoImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-7xl opacity-20 transition-opacity duration-500">
          {fallbackEmoji}
        </span>
        <div
          className="absolute w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)' }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={dinoImage}
        alt={dinoLabel || 'Dinosaur'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{
          filter: 'brightness(0.65) saturate(1.15)',
          objectPosition: objectPosition || 'center center',
        }}
      />
      {/* Gradient tối từ dưới lên để text dễ đọc */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(10,8,4,0.9) 100%)' }}
      />
    </div>
  );
};

const VirtualTourPreview = () => {
  const [activeView, setActiveView] = useState(null);
  // Ref cho section — dùng để tính parallax scroll
  const sectionRef = useRef(null);
  // Parallax nhẹ cho heading
  const headingY = useParallax(sectionRef, ['30px', '-15px']);

  // Smooth scroll to ticket booking form
  const scrollToTicket = () => {
    const t = document.querySelector('#dang-ky');
    if (t) window.__lenis ? window.__lenis.scrollTo(t, { offset: -80, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="virtual-tour"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--theme-bg-alt) 0%, var(--theme-bg) 100%)' }}
    >
      {/* Ánh sáng ambient phía trên */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Tiêu đề phần Tour Ảo — có parallax nhẹ */}
        <motion.div
          className="mb-16 text-center"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-divider mx-auto" style={{ margin: '0 auto 1.5rem' }} />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>
            3D Virtual Tour Preview
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
            Begin{' '}
            <span className="text-gradient-amber">Your Journey</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed"
            style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif', fontStyle: 'italic' }}>
            Hover over each room to load the 3D model — rotate, zoom in, and explore everything.
          </p>
        </motion.div>

        {/* Lưới các card tour với ảnh khủng long */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {tourViews.map((view, i) => (
            <motion.div
              key={view.id}
              className="tour-frame cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              onMouseEnter={() => setActiveView(view.id)}
              onMouseLeave={() => setActiveView(null)}
              onClick={scrollToTicket}
            >
              {/* Vùng hiển thị ảnh khủng long */}
              <div className="h-64 relative" style={{ background: view.bgColor }}>
                {/* Hiệu ứng đường quét ngang (scanlines) */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, transparent 1px, transparent 3px)',
                  }}
                />
                {/* Góc khung viền vàng trang trí */}
                {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2',
                  'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((cls, j) => (
                  <div key={j} className={`absolute ${cls} w-5 h-5 z-10`}
                    style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                ))}
                {/* Chấm tròn vàng ở 4 góc */}
                {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, j) => (
                  <div key={j} className={`absolute ${pos} w-2 h-2 rounded-full z-10`}
                    style={{ background: 'rgba(245,158,11,0.5)' }} />
                ))}

                {/* Ảnh khủng long tĩnh */}
                <SketchfabViewer
                  dinoImage={view.dinoImage}
                  dinoLabel={view.dinoLabel}
                  fallbackEmoji={view.fallbackEmoji}
                  objectPosition={view.objectPosition}
                />

                {/* Nhãn HUD phía dưới card */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20"
                  style={{ background: 'linear-gradient(to top, rgba(10,8,4,0.9), transparent)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: '#fbbf24', fontFamily: 'DM Sans, sans-serif' }}>
                      {view.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs"
                      style={{ background: 'rgba(245,158,11,0.15)', color: 'rgba(245,240,232,0.7)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
                      {view.highlight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mô tả card phía dưới ảnh */}
              <div className="p-4" style={{ background: 'var(--theme-card-bg)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif' }}>
                  {view.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Khối CTA cuối phần */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* Các tính năng tour nổi bật */}
          <div
            className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-2xl mb-8 mx-auto"
            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
          >
            {[
              { icon: '🔄', label: '360° Rotation' },
              { icon: '🔍', label: 'Zoom In Detail' },
              { icon: '🆓', label: 'Completely Free' },
              { icon: '📱', label: 'All Devices' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--theme-text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Nút CTA đặt vé */}
          <motion.button
            onClick={scrollToTicket}
            id="tour-cta-btn"
            className="btn-amber-primary text-base px-10 py-5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            🎟️ Start Virtual Tour — Book a Ticket
          </motion.button>

          <p className="mt-4 text-xs" style={{ color: 'var(--theme-text-dim)', fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
            Get your tour link after filling the form • No payment required
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTourPreview;
