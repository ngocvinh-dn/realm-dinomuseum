import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';

// Featured specimen data for the museum
const specimens = [
  {
    id: 'trex',
    name: 'T-Rex',
    fullName: 'Tyrannosaurus rex',
    tag: 'Theropoda',
    dinoImage: '/images/dino_trex.png',
    objectPosition: 'center top',
    period: 'Late Cretaceous',
    age: '67 million yrs',
    length: '12.3 m',
    weight: '8.4 tons',
    location: 'South Dakota, USA (1990)',
    desc: 'The most complete T-Rex skeleton ever found. “Sue” is named after its discoverer — Sue Hendrickson. Currently on display at the Field Museum, Chicago.',
    highlight: true,
  },
  {
    id: 'triceratops',
    name: '"Horridus" Triceratops',
    fullName: 'Triceratops horridus',
    tag: 'Ceratopsidae',
    dinoImage: '/images/dino_triceratops.png',
    objectPosition: 'center center',
    period: 'Late Cretaceous',
    age: '68 million yrs',
    length: '9 m',
    weight: '12 tons',
    location: 'Montana, USA',
    desc: 'Complete skull with its iconic 3 horns. Triceratops was the most common species of late Cretaceous — coexisting alongside T-Rex.',
    highlight: false,
  },
  {
    id: 'amber',
    name: 'Myanmar Amber',
    fullName: 'Burmite Amber Inclusion',
    tag: 'Mesozoic Amber',
    // AI-generated amber fossil image
    dinoImage: '/images/amber_fossil.png',
    objectPosition: 'center center',
    period: 'Mid-Cretaceous',
    age: '99 million yrs',
    length: '3.2 cm',
    weight: '8.7 g',
    location: 'Myanmar (Burma)',
    desc: 'Fossilized tree resin containing perfectly preserved organisms from 99 million years ago — insects, dinosaur feathers, and even tadpoles.',
    highlight: false,
  },
  {
    id: 'vn-tooth',
    name: 'Vietnamese Theropod Tooth',
    fullName: 'Indosuchus sp. (cf.)',
    tag: 'VN Discovery',
    dinoImage: '/images/dino_velociraptor.png',
    objectPosition: 'center center',
    period: 'Jurassic – Cretaceous',
    age: '80–130 million yrs',
    length: '4.7 cm',
    weight: null,
    location: 'Dong Nai & Binh Thuan, VN',
    desc: 'One of the rare pieces of evidence for dinosaur existence in Vietnamese territory — a medium-sized theropod dinosaur.',
    highlight: false,
  },
];

// Component hiển thị ảnh hiện vật trong card — hỗ trợ cả ảnh và emoji thay thế
const SketchfabSpecimen = ({ dinoImage, emoji, objectPosition }) => {
  // Nếu không có ảnh, hiển thị emoji thay thế
  if (!dinoImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-8xl opacity-20 transition-opacity duration-500">{emoji || '🦕'}</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={dinoImage}
        alt="Dinosaur specimen"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{
          filter: 'brightness(0.7) saturate(1.1)',
          objectPosition: objectPosition || 'center center',
        }}
      />
      {/* Gradient tối từ dưới lên để text hiển thị rõ ràng */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(10,8,4,0.9) 100%)' }}
      />
    </div>
  );
};

const SpecimenShowcase = () => {
  const [activeId, setActiveId] = useState(null);
  const [loadedIds, setLoadedIds] = useState({});
  // Ref cho section — dùng để tính parallax scroll
  const sectionRef = useRef(null);
  // Parallax nhẹ cho heading
  const headingY = useParallax(sectionRef, ['30px', '-20px']);

  // Theo dõi card hiện vật nào đang active
  const handleMouseEnter = (id) => {
    setActiveId(id);
    setLoadedIds(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="specimens"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      style={{ background: 'var(--theme-bg-alt)' }}
    >
      {/* Hoa văn chéo mờ làm texture nền */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(245,158,11,0.5) 0px, rgba(245,158,11,0.5) 1px, transparent 1px, transparent 40px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Tiêu đề section Hiện Vật Nổi Bật — có parallax nhẹ */}
        <motion.div
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
            Featured Specimens
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--theme-text)' }}>
            The Stars{' '}
            <span className="text-gradient-amber">of Our Collection</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed"
            style={{ color: 'var(--theme-text-muted)', fontFamily: 'Nunito, sans-serif', fontStyle: 'italic' }}>
            Hover over each specimen to view detailed scientific data. Every artifact tells a story millions of years in the making.
          </p>
        </motion.div>

        {/* Lưới các card hiện vật (2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specimens.map((s, i) => {
            const isActive = activeId === s.id;
            const isLoaded = loadedIds[s.id];
            return (
              <motion.div
                key={s.id}
                className="specimen-card group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                onMouseEnter={() => handleMouseEnter(s.id)}
                onMouseLeave={() => setActiveId(null)}
                style={{
                  border: s.highlight ? '1px solid rgba(245,158,11,0.35)' : undefined,
                  boxShadow: s.highlight ? '0 0 40px rgba(245,158,11,0.08)' : undefined,
                }}
              >
                {/* Vùng ảnh hiện vật */}
                <div
                  className="relative h-64 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(17,14,8,0.9) 0%, rgba(30,23,16,0.7) 100%)',
                  }}
                >
                  {/* Gradient tối overlay */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,8,4,0.95))' }}
                  />
                  {/* Hiệu ứng spotlight khi hover */}
                  <motion.div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.2) 0%, transparent 70%)' }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Ảnh hiện vật hoặc emoji thay thế */}
                  <SketchfabSpecimen
                    dinoImage={s.dinoImage}
                    emoji={s.emoji}
                    objectPosition={s.objectPosition}
                  />

                  {/* Nhãn phân loại và đánh dấu tiêu biểu */}
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(10,8,4,0.8)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}>
                      {s.tag}
                    </span>
                    {s.highlight && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                        ✦ Featured
                      </span>
                    )}
                  </div>

                  {/* Nhãn kỷ địa chất góc trên phải */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: 'rgba(10,8,4,0.8)', color: 'rgba(245,240,232,0.7)', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif' }}>
                      {s.period}
                    </span>
                  </div>

                  {/* Tên hiện vật phía dưới ảnh */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-serif font-bold text-xl"
                        style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8' }}>
                        {s.name}
                      </h3>
                    </div>
                    <p className="text-xs italic" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Nunito, sans-serif' }}>
                      {s.fullName}
                    </p>
                  </div>
                </div>

                {/* Bảng thông số khoa học */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Age', value: s.age },
                      { label: 'Length', value: s.length },
                      { label: 'Location', value: s.location.split(',')[0] },
                    ].map((stat, j) => (
                      <div key={j} className="text-center p-2 rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <div className="text-xs font-bold" style={{ color: '#fbbf24', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
                          {stat.value}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--theme-text-dim)', fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Panel chi tiết xuất hiện khi hover */}
                  <div className="detail-panel">
                    <p className="text-xs leading-relaxed mb-3"
                      style={{ color: 'var(--theme-text-muted)', fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>
                      <span>📍</span>
                      <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.location}</span>
                    </div>
                  </div>

                  {/* Đường kẻ gradient xuất hiện khi hover */}
                  <div className="mt-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecimenShowcase;
