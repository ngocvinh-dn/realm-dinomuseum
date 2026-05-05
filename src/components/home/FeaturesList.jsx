import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';

// Gallery room data — each room has an image, accent color, and artifact count
const galleries = [
  {
    id: 'mesozoic',
    title: 'Mesozoic Era',
    subtitle: 'The Age of Dinosaurs',
    desc: 'Journey through 180 million years of giant reptile dominance — from the Triassic to the end of the Cretaceous.',
    count: 150,
    period: 'Triassic – Cretaceous',
    dinoImage: '/images/dino_brachiosaurus.png',
    dinoLabel: 'Brachiosaurus',
    objectPosition: 'center 20%',
    color: 'rgba(34,197,94,0.15)',
    borderColor: 'rgba(34,197,94,0.3)',
    accentColor: '#22c55e',
  },
  {
    id: 'theropoda',
    title: 'Theropoda Hall',
    subtitle: 'The Great Predators',
    desc: 'Tyrannosaurus Rex, Velociraptor, Spinosaurus — the ultimate killing machines that once ruled this planet.',
    count: 48,
    period: 'Jurassic – Cretaceous',
    dinoImage: '/images/dino_trex.png',
    dinoLabel: 'T-Rex',
    objectPosition: 'center top',
    color: 'rgba(239,68,68,0.12)',
    borderColor: 'rgba(239,68,68,0.25)',
    accentColor: '#ef4444',
  },
  {
    id: 'vietnam',
    title: 'Vietnamese Fossils',
    subtitle: 'Local Discoveries',
    desc: 'Rare finds from Vietnam’s S-shaped territory — dinosaur teeth, footprints, and plant fossils.',
    count: 23,
    period: 'Jurassic – Paleogene',
    dinoImage: '/images/dino_velociraptor.png',
    dinoLabel: 'Velociraptor',
    objectPosition: 'center center',
    color: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.3)',
    accentColor: '#f59e0b',
  },
  {
    id: 'extinction',
    title: 'Mass Extinction',
    subtitle: '66 Million Years Ago',
    desc: 'The K-Pg event — an asteroid, nuclear winter, and the end of an era. What survived and what was lost.',
    count: 35,
    period: 'Cretaceous – Paleogene',
    dinoImage: '/images/dino_triceratops.png',
    dinoLabel: 'Triceratops',
    objectPosition: 'center center',
    color: 'rgba(168,85,247,0.12)',
    borderColor: 'rgba(168,85,247,0.25)',
    accentColor: '#a855f7',
  },
  {
    id: 'embryo',
    title: 'Eggs & Embryos',
    subtitle: 'Where Life Begins',
    desc: 'A collection of fossilized eggs, preserved embryos, and evidence of dinosaur nesting behavior.',
    count: 19,
    period: 'Jurassic – Cretaceous',
    // AI-generated dinosaur egg fossil image
    dinoImage: '/images/dino_eggs_fossil.png',
    dinoLabel: 'Fossil Eggs',
    objectPosition: 'center center',
    color: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.2)',
    accentColor: '#f59e0b',
  },
];

// Component hiển thị ảnh khủng long trong card — hỗ trợ cả ảnh thực và emoji thay thế
const SpinningDino = ({ dinoImage, emoji, accentColor, dinoLabel, objectPosition }) => {
  // Nếu không có ảnh, hiển thị emoji thay thế
  if (!dinoImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-7xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">
          {emoji || '🦕'}
        </span>
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
          filter: 'brightness(0.75) saturate(1.1)',
          objectPosition: objectPosition || 'center center',
        }}
      />
      {/* Gradient tối từ dưới lên để nội dung text dễ đọc */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,8,4,0.85) 100%)' }}
      />
    </div>
  );
};

// Animation stagger cho các card — xuất hiện lần lượt từ trên xuống
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const GalleriesPreview = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [loadedIds, setLoadedIds] = useState({});
  // Ref cho section — dùng để tính parallax scroll
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  // Parallax nhẹ cho heading: dịch chuyển lên nhẹ khi scroll qua
  const headingY = useParallax(sectionRef, ['30px', '-20px']);

  // Theo dõi card nào đang được hover
  const handleMouseEnter = (id) => {
    setHoveredId(id);
    setLoadedIds(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="galleries"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--theme-bg) 0%, var(--theme-bg-alt) 60%, var(--theme-bg) 100%)' }}
    >
      {/* Ánh sáng ambient mờ phía trên */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Tiêu đề section Phòng Trưng Bày — có parallax nhẹ */}
        <motion.div
          ref={headingRef}
          className="mb-16"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-divider" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>
            5 Themed Exhibition Halls
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
            Explore Each{' '}
            <br className="hidden md:block" />
            <span className="text-gradient-amber">Exhibition Hall</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed"
            style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif', fontStyle: 'italic' }}>
            Hover over each room to see a rotating 3D dinosaur model — lit up just like a real museum.
          </p>
        </motion.div>

        {/* Lưới các card phòng trưng bày */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {galleries.map((gallery) => (
            <motion.div
              key={gallery.id}
              variants={cardVariants}
              className="gallery-room-card group"
              onMouseEnter={() => handleMouseEnter(gallery.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                border: `1px solid ${hoveredId === gallery.id ? gallery.borderColor : 'rgba(245,158,11,0.1)'}`,
              }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Hiệu ứng spotlight khi hover */}
              <div className="spotlight" />

              {/* Vùng ảnh khủng long phía trên card */}
              <div
                className="relative h-52 overflow-hidden rounded-t-2xl"
                style={{
                  background: `linear-gradient(135deg, ${gallery.color} 0%, rgba(10,8,4,0.8) 100%)`,
                }}
              >
                {/* Overlay tối nhẹ */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'transparent' }}
                />
                {/* Nhãn kỷ địa chất góc trên phải */}
                <div
                  className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(10,8,4,0.7)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {gallery.period}
                </div>

                {/* Ảnh khủng long được scale vừa khung */}
                <SpinningDino
                  dinoImage={gallery.dinoImage}
                  emoji={gallery.emoji}
                  accentColor={gallery.accentColor}
                  dinoLabel={gallery.dinoLabel}
                  objectPosition={gallery.objectPosition}
                />
              </div>

              {/* Nội dung text phía dưới card */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight"
                      style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
                      {gallery.title}
                    </h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: '#f59e0b', fontFamily: 'DM Sans, sans-serif' }}>
                      {gallery.subtitle}
                    </p>
                  </div>
                  {/* Huy hiệu số lượng hiện vật */}
                  <div
                    className="flex-shrink-0 text-center px-3 py-1.5 rounded-xl"
                    style={{ background: gallery.color, border: `1px solid ${gallery.borderColor}` }}
                  >
                    <div className="text-lg font-bold font-serif"
                      style={{ fontFamily: 'Cormorant Garamond, serif', color: '#fbbf24' }}>
                      {gallery.count}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--theme-text-muted)', fontFamily: 'DM Sans, sans-serif' }}>items</div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif' }}>
                  {gallery.desc}
                </p>

                {/* Đường kẻ gradient xuất hiện khi hover */}
                <div className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-4"
                  style={{ background: `linear-gradient(90deg, ${gallery.accentColor || '#f59e0b'}, transparent)` }} />

                {/* Nút vào tham quan — cuộn đến form đặt vé */}
                <button
                  className="btn-amber-outline text-xs py-2 px-4 w-full"
                  id={`gallery-btn-${gallery.id}`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                  onClick={() => {
                    const t = document.querySelector('#dang-ky');
                    if (t) window.__lenis ? window.__lenis.scrollTo(t, { offset: -80, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  🚪 Enter Hall
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GalleriesPreview;